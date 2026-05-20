import "server-only";

import type { GoogleTokenResponse } from "./googleTypes";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export class GoogleTokenRefreshError extends Error {
  constructor(message = "Google OAuth access token refresh failed.") {
    super(message);
    this.name = "GoogleTokenRefreshError";
  }
}

function getRefreshConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new GoogleTokenRefreshError("Google OAuth client credentials are not configured.");
  }

  return { clientId, clientSecret };
}

export async function refreshGoogleAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
  const config = getRefreshConfig();
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new GoogleTokenRefreshError(`Google OAuth access token refresh failed with status ${response.status}.`);
  }

  return response.json() as Promise<GoogleTokenResponse>;
}
