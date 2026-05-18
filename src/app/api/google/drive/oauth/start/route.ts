import { NextResponse } from "next/server";

import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { buildGoogleOAuthAuthorizationUrl, getGoogleOAuthConfig } from "@/lib/google/oauth";

export async function GET() {
  const configResult = getGoogleOAuthConfig();

  if (!configResult.ok) {
    return NextResponse.json(
      {
        error: "Google Drive OAuth is not configured for local development.",
        missing: configResult.missing,
        invalidScopes: configResult.invalid
      },
      { status: 500 }
    );
  }

  return NextResponse.redirect(buildGoogleOAuthAuthorizationUrl(configResult.config, MOCK_FAMILY_ID));
}
