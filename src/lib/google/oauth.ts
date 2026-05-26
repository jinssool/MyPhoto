import "server-only";

import type { GoogleOAuthConfig, GoogleOAuthConfigResult, GoogleTokenResponse } from "./googleTypes";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export const GOOGLE_DRIVE_READONLY_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

export type GoogleOAuthTokenExchangeFailureReason = "request_failed" | "http_error" | "invalid_json";

export class GoogleOAuthTokenExchangeError extends Error {
  reason: GoogleOAuthTokenExchangeFailureReason;
  status: number | null;

  constructor(reason: GoogleOAuthTokenExchangeFailureReason, status: number | null = null) {
    super("Google OAuth token exchange failed.");
    this.name = "GoogleOAuthTokenExchangeError";
    this.reason = reason;
    this.status = status;
  }
}

function parseScopes(scopeText: string | undefined) {
  return (scopeText?.trim() ? scopeText : GOOGLE_DRIVE_READONLY_SCOPE).split(/\s+/).filter(Boolean);
}

function isReadOnlyDriveScope(scope: string) {
  return scope === GOOGLE_DRIVE_READONLY_SCOPE;
}

export function getGoogleOAuthConfig(): GoogleOAuthConfigResult {
  const requiredEnvVars: Array<[string, string | undefined]> = [
    ["GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID],
    ["GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET],
    ["GOOGLE_REDIRECT_URI", process.env.GOOGLE_REDIRECT_URI]
  ];
  const missing = requiredEnvVars.filter(([, value]) => !value).map(([name]) => name);

  const scopes = parseScopes(process.env.GOOGLE_DRIVE_SCOPES);
  const invalid = scopes.filter((scope) => !isReadOnlyDriveScope(scope));

  if (missing.length > 0 || invalid.length > 0) {
    return { ok: false, missing, invalid };
  }

  return {
    ok: true,
    config: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectUri: process.env.GOOGLE_REDIRECT_URI as string,
      scopes
    }
  };
}

export function buildGoogleOAuthAuthorizationUrl(config: GoogleOAuthConfig, state: string) {
  const url = new URL(GOOGLE_AUTH_URL);

  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scopes.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);

  return url;
}

export async function exchangeGoogleOAuthCodeForTokens(config: GoogleOAuthConfig, code: string): Promise<GoogleTokenResponse> {
  let response: Response;

  try {
    response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code"
      })
    });
  } catch {
    throw new GoogleOAuthTokenExchangeError("request_failed");
  }

  if (!response.ok) {
    throw new GoogleOAuthTokenExchangeError("http_error", response.status);
  }

  try {
    return (await response.json()) as GoogleTokenResponse;
  } catch {
    throw new GoogleOAuthTokenExchangeError("invalid_json", response.status);
  }
}
