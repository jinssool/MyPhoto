import { NextRequest, NextResponse } from "next/server";

import { upsertDriveConnectionFromOAuth } from "@/lib/drive/driveConnectionQueries";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { exchangeGoogleOAuthCodeForTokens, getGoogleOAuthConfig } from "@/lib/google/oauth";

function redirectToImport(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/admin/import?drive=${status}`, request.url));
}

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (error) {
    return redirectToImport(request, "oauth_denied");
  }

  if (!code) {
    return redirectToImport(request, "missing_code");
  }

  if (state && state !== MOCK_FAMILY_ID) {
    return redirectToImport(request, "invalid_state");
  }

  const configResult = getGoogleOAuthConfig();
  if (!configResult.ok) {
    return redirectToImport(request, "oauth_not_configured");
  }

  try {
    const tokenResponse = await exchangeGoogleOAuthCodeForTokens(configResult.config, code);
    const connection = await upsertDriveConnectionFromOAuth(MOCK_FAMILY_ID, tokenResponse);

    if (!connection) {
      return redirectToImport(request, "supabase_not_configured");
    }

    return redirectToImport(request, "connected");
  } catch {
    return redirectToImport(request, "oauth_failed");
  }
}
