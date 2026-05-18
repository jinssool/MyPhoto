export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
};

export type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
};

export type GoogleOAuthConfigResult =
  | {
      ok: true;
      config: GoogleOAuthConfig;
    }
  | {
      ok: false;
      missing: string[];
      invalid: string[];
    };
