import "server-only";

import { GoogleTokenRefreshError, refreshGoogleAccessToken } from "@/lib/google/tokenRefresh";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { decryptToken, encryptToken } from "@/lib/security/tokenCrypto";
import type { DriveConnectionRow } from "@/types/database";

import type { GoogleTokenResponse } from "../google/googleTypes";

const ACCESS_TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

export class DriveReconnectRequiredError extends Error {
  constructor(message = "Google Drive must be reconnected.") {
    super(message);
    this.name = "DriveReconnectRequiredError";
  }
}

export class DriveConnectionTableMissingError extends Error {
  operation: string;
  code: string | null;

  constructor(operation: string, code: string | null) {
    super("The drive_connections table is missing or unavailable.");
    this.name = "DriveConnectionTableMissingError";
    this.operation = operation;
    this.code = code;
  }
}

export class DriveConnectionSaveError extends Error {
  operation: string;
  code: string | null;

  constructor(operation: string, code: string | null) {
    super("Google Drive connection metadata could not be saved.");
    this.name = "DriveConnectionSaveError";
    this.operation = operation;
    this.code = code;
  }
}

type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

function getTokenExpiresAt(tokenResponse: GoogleTokenResponse) {
  if (!tokenResponse.expires_in) return null;

  return new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString();
}

function isAccessTokenStillValid(tokenExpiresAt: string | null) {
  if (!tokenExpiresAt) return false;

  const expiresAt = Date.parse(tokenExpiresAt);
  if (Number.isNaN(expiresAt)) return false;

  return expiresAt - ACCESS_TOKEN_EXPIRY_BUFFER_MS > Date.now();
}

function getSupabaseErrorCode(error: SupabaseErrorLike) {
  return error.code ?? null;
}

function isDriveConnectionsTableMissing(error: SupabaseErrorLike) {
  const message = error.message?.toLowerCase() ?? "";

  return (
    error.code === "42P01" ||
    (error.code === "PGRST205" && message.includes("drive_connections")) ||
    message.includes('relation "drive_connections" does not exist') ||
    message.includes("could not find the table") && message.includes("drive_connections")
  );
}

function toDriveConnectionSaveError(error: SupabaseErrorLike, operation: string) {
  const code = getSupabaseErrorCode(error);

  if (isDriveConnectionsTableMissing(error)) {
    return new DriveConnectionTableMissingError(operation, code);
  }

  return new DriveConnectionSaveError(operation, code);
}

export async function getDriveConnection(familyId: string): Promise<DriveConnectionRow | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("drive_connections")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    if (isDriveConnectionsTableMissing(error)) {
      throw new DriveConnectionTableMissingError("select_drive_connection", getSupabaseErrorCode(error));
    }

    throw error;
  }

  return data;
}

export async function upsertDriveConnectionFromOAuth(
  familyId: string,
  tokenResponse: GoogleTokenResponse
): Promise<DriveConnectionRow | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  let existingConnection: DriveConnectionRow | null;

  try {
    existingConnection = await getDriveConnection(familyId);
  } catch (error) {
    if (error instanceof DriveConnectionTableMissingError) {
      throw error;
    }

    throw new DriveConnectionSaveError("select_existing_drive_connection", null);
  }

  if (!tokenResponse.access_token) {
    throw new Error("Google OAuth token response did not include an access token.");
  }

  const connectionFields = {
    google_account_email: null,
    access_token_encrypted: encryptToken(tokenResponse.access_token),
    refresh_token_encrypted: tokenResponse.refresh_token
      ? encryptToken(tokenResponse.refresh_token)
      : existingConnection?.refresh_token_encrypted ?? null,
    token_expires_at: getTokenExpiresAt(tokenResponse),
    status: "active" as const,
    last_synced_at: null
  };

  const mutation = existingConnection
    ? supabase
        .from("drive_connections")
        .update(connectionFields)
        .eq("family_id", familyId)
        .eq("id", existingConnection.id)
        .select("*")
        .single()
    : supabase
        .from("drive_connections")
        .insert({
          family_id: familyId,
          ...connectionFields
        })
        .select("*")
        .single();

  const { data, error } = await mutation;

  if (error) {
    throw toDriveConnectionSaveError(
      error,
      existingConnection ? "update_drive_connection" : "insert_drive_connection"
    );
  }

  return data;
}

export async function getDecryptedDriveTokens(familyId: string) {
  const connection = await getDriveConnection(familyId);

  if (!connection || connection.status !== "active" || !connection.access_token_encrypted) {
    return null;
  }

  return {
    accessToken: decryptToken(connection.access_token_encrypted),
    refreshToken: connection.refresh_token_encrypted ? decryptToken(connection.refresh_token_encrypted) : null,
    tokenExpiresAt: connection.token_expires_at
  };
}

export async function getValidDriveAccessToken(familyId: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const connection = await getDriveConnection(familyId);

  if (!connection || connection.status !== "active" || !connection.access_token_encrypted) {
    return null;
  }

  const accessToken = decryptToken(connection.access_token_encrypted);
  if (isAccessTokenStillValid(connection.token_expires_at)) {
    return accessToken;
  }

  if (!connection.refresh_token_encrypted) {
    throw new DriveReconnectRequiredError("Google Drive refresh token is missing.");
  }

  const refreshToken = decryptToken(connection.refresh_token_encrypted);
  let refreshedToken: GoogleTokenResponse;

  try {
    refreshedToken = await refreshGoogleAccessToken(refreshToken);
  } catch (error) {
    if (error instanceof GoogleTokenRefreshError) {
      throw new DriveReconnectRequiredError("Google Drive refresh token could not refresh access.");
    }

    throw error;
  }

  if (!refreshedToken.access_token) {
    throw new DriveReconnectRequiredError("Google did not return a refreshed access token.");
  }

  const refreshedFields = {
    access_token_encrypted: encryptToken(refreshedToken.access_token),
    refresh_token_encrypted: refreshedToken.refresh_token
      ? encryptToken(refreshedToken.refresh_token)
      : connection.refresh_token_encrypted,
    token_expires_at: getTokenExpiresAt(refreshedToken),
    status: "active" as const
  };

  const { error } = await supabase
    .from("drive_connections")
    .update(refreshedFields)
    .eq("family_id", familyId)
    .eq("id", connection.id);

  if (error) throw error;

  return refreshedToken.access_token;
}
