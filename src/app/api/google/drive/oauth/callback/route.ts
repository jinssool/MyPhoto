import { NextRequest, NextResponse } from "next/server";

import {
  DriveConnectionSaveError,
  DriveConnectionTableMissingError,
  upsertDriveConnectionFromOAuth
} from "@/lib/drive/driveConnectionQueries";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { exchangeGoogleOAuthCodeForTokens, getGoogleOAuthConfig, GoogleOAuthTokenExchangeError } from "@/lib/google/oauth";
import { assertTokenEncryptionConfigured, TokenEncryptionConfigError } from "@/lib/security/tokenCrypto";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type SafeOAuthCallbackLogDetails = {
  invalidScopeCount?: number;
  missingConfigCount?: number;
  operation?: string;
  reason?: string;
  status?: number | null;
  supabaseCode?: string | null;
};

function redirectToImport(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/admin/import?drive=${status}`, request.url));
}

function logOAuthCallbackError(reason: string, details: SafeOAuthCallbackLogDetails = {}) {
  console.error("[google-drive-oauth-callback]", reason, details);
}

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (error) {
    logOAuthCallbackError("oauth_denied_by_google");
    return redirectToImport(request, "oauth_denied");
  }

  if (!code) {
    logOAuthCallbackError("missing_authorization_code");
    return redirectToImport(request, "missing_code");
  }

  if (state && state !== MOCK_FAMILY_ID) {
    logOAuthCallbackError("invalid_oauth_state");
    return redirectToImport(request, "invalid_state");
  }

  const configResult = getGoogleOAuthConfig();
  if (!configResult.ok) {
    logOAuthCallbackError("oauth_config_not_ready", {
      invalidScopeCount: configResult.invalid.length,
      missingConfigCount: configResult.missing.length
    });
    return redirectToImport(request, "oauth_not_configured");
  }

  try {
    assertTokenEncryptionConfigured();
  } catch (error) {
    if (error instanceof TokenEncryptionConfigError) {
      logOAuthCallbackError("token_encryption_not_configured");
      return redirectToImport(request, "token_encryption_not_configured");
    }

    throw error;
  }

  if (!isSupabaseConfigured()) {
    logOAuthCallbackError("supabase_env_not_configured");
    return redirectToImport(request, "supabase_not_configured");
  }

  try {
    const tokenResponse = await exchangeGoogleOAuthCodeForTokens(configResult.config, code);

    if (!tokenResponse.access_token) {
      logOAuthCallbackError("google_token_response_missing_required_value");
      return redirectToImport(request, "google_token_response_invalid");
    }

    await upsertDriveConnectionFromOAuth(MOCK_FAMILY_ID, tokenResponse);

    return redirectToImport(request, "connected");
  } catch (error) {
    if (error instanceof GoogleOAuthTokenExchangeError) {
      logOAuthCallbackError("google_token_exchange_failed", {
        reason: error.reason,
        status: error.status
      });
      return redirectToImport(request, "google_token_exchange_failed");
    }

    if (error instanceof DriveConnectionTableMissingError) {
      logOAuthCallbackError("drive_connections_table_missing", {
        operation: error.operation,
        supabaseCode: error.code
      });
      return redirectToImport(request, "drive_connections_table_missing");
    }

    if (error instanceof DriveConnectionSaveError) {
      logOAuthCallbackError("drive_connection_save_failed", {
        operation: error.operation,
        supabaseCode: error.code
      });
      return redirectToImport(request, "drive_connection_save_failed");
    }

    logOAuthCallbackError("oauth_callback_unclassified_failure");
    return redirectToImport(request, "oauth_failed");
  }
}
