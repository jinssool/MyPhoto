import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DriveConnectionRow } from "@/types/database";

import type { GoogleTokenResponse } from "../google/googleTypes";

function getTokenExpiresAt(tokenResponse: GoogleTokenResponse) {
  if (!tokenResponse.expires_in) return null;

  return new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString();
}

function getLocalDevTokenPlaceholder(kind: "access" | "refresh", tokenValue: string | undefined) {
  if (!tokenValue) return null;

  // TODO: Replace this placeholder with real server-side encryption before Drive scanning/import work.
  return `local-dev-${kind}-token-placeholder-not-encrypted`;
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

  if (error) throw error;

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

  const existingConnection = await getDriveConnection(familyId);
  const connectionFields = {
    google_account_email: null,
    access_token_encrypted: getLocalDevTokenPlaceholder("access", tokenResponse.access_token),
    refresh_token_encrypted: getLocalDevTokenPlaceholder("refresh", tokenResponse.refresh_token),
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

  if (error) throw error;

  return data;
}
