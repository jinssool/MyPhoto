# Remote Family Test Deployment Guide

This guide is for a private family test of the internal MVP, not a public production launch. Google Drive remains the original photo storage, and the deployed app stores album metadata only.

## Safety Boundaries

- Keep Google Drive scope exactly `https://www.googleapis.com/auth/drive.readonly`.
- Do not add Drive write, delete, move, rename, upload, or modify scopes.
- Do not store original image files or image blobs.
- Do not use a Supabase service role key in app code or Vercel env vars.
- Do not commit `.env.local`, real OAuth secrets, Supabase keys, or token encryption keys.
- Use a small test folder first, ideally 5-10 photos.

## Required Accounts

- Vercel account for the Next.js deployment.
- Supabase Cloud project for album metadata.
- Google Cloud OAuth client for Drive read-only OAuth.

## Required Environment Variables

Set these in Vercel Project Settings, not in committed files:

| Name | Required | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Supabase Cloud project URL. |
| `SUPABASE_ANON_KEY` | Yes | Supabase public anon key only. Do not use the service role key. |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth web client ID. |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth web client secret. Server-side only. |
| `GOOGLE_REDIRECT_URI` | Yes | `https://<vercel-domain>/api/google/drive/oauth/callback` |
| `GOOGLE_DRIVE_SCOPES` | Yes | Must be `https://www.googleapis.com/auth/drive.readonly`. |
| `TOKEN_ENCRYPTION_KEY` | Yes | Generate with `openssl rand -base64 32`. |
| `BASIC_AUTH_USER` | No | Placeholder for future app middleware only. Prefer Vercel Deployment Protection for this MVP. |
| `BASIC_AUTH_PASSWORD` | No | Placeholder for future app middleware only. Prefer Vercel Deployment Protection for this MVP. |

`NEXT_PUBLIC_APP_NAME` may remain the public display label. Do not create `NEXT_PUBLIC_` versions of secrets.

## Supabase Cloud Setup

1. Create a Supabase Cloud project.
2. Log in and link the local project:

```bash
supabase login
supabase link --project-ref <project-ref>
```

3. Apply the existing migration:

```bash
supabase migration list
supabase db push
```

The migration file is:

```text
supabase/migrations/20260517000100_create_photo_metadata_schema.sql
```

SQL Editor fallback:

1. Open Supabase Dashboard -> SQL Editor.
2. Paste the full contents of `supabase/migrations/20260517000100_create_photo_metadata_schema.sql`.
3. Run it once.

If `supabase db push --dry-run` reports remote migration versions that are not present locally, do not repair migration history blindly. Have the project owner choose one of these paths:

- use SQL Editor to apply only this MVP schema after confirming the remote database is disposable for the family test;
- run `supabase db pull` into a separate branch and reconcile the existing remote schema first;
- create a fresh Supabase Cloud project for this private MVP test.

The local `supabase/seed.sql` file is for local demo data. For the remote family test, prefer importing metadata from a small real test Drive folder after OAuth is configured.

## Token Encryption Key

Generate one value locally:

```bash
openssl rand -base64 32
```

Put the generated value only in Vercel as `TOKEN_ENCRYPTION_KEY`. Do not print it in logs, paste it into docs, or commit it.

## Google OAuth Setup

Create or update a Google OAuth web client:

- Authorized JavaScript origin: `https://<vercel-domain>`
- Authorized redirect URI: `https://<vercel-domain>/api/google/drive/oauth/callback`

Set Vercel env vars:

```text
GOOGLE_CLIENT_ID=<google oauth web client id>
GOOGLE_CLIENT_SECRET=<google oauth web client secret>
GOOGLE_REDIRECT_URI=https://<vercel-domain>/api/google/drive/oauth/callback
GOOGLE_DRIVE_SCOPES=https://www.googleapis.com/auth/drive.readonly
```

If the Vercel domain changes, update both Google OAuth and `GOOGLE_REDIRECT_URI` before reconnecting Drive.

## Vercel Setup

Install or run the Vercel CLI:

```bash
npx vercel --version
npx vercel login
npx vercel link --yes --project family-memory-gallery
```

Dashboard env setup:

1. Open Vercel Dashboard -> Project -> Settings -> Environment Variables.
2. Add each required variable for Production.
3. Add the same values for Preview only if family testers will use preview deployments.
4. Do not add service role keys.

CLI env setup also works and avoids storing secrets in shell history because the CLI prompts for values:

```bash
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_ANON_KEY production
npx vercel env add GOOGLE_CLIENT_ID production
npx vercel env add GOOGLE_CLIENT_SECRET production
npx vercel env add GOOGLE_REDIRECT_URI production
npx vercel env add GOOGLE_DRIVE_SCOPES production
npx vercel env add TOKEN_ENCRYPTION_KEY production
```

Deploy after env vars are set:

```bash
npx vercel --prod
```

## Access Protection

Use Vercel Deployment Protection or a private preview link for this family test. This keeps access control outside the app and avoids interfering with the Google OAuth callback.

Do not add app-level Basic Auth unless there is a separate implementation pass that verifies OAuth callback behavior. If that is added later, it must be active only when both `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` are present, and those values must stay server-only.

## Family Test Checklist

Before sharing the link:

- [ ] `npm run validate:query-layer`
- [ ] `npm run validate:deployment`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm audit --audit-level=moderate`
- [ ] Supabase migration applied.
- [ ] Vercel env vars set.
- [ ] Google OAuth redirect URI matches the deployed domain exactly.
- [ ] `/admin/import` loads on the deployed URL.
- [ ] Google Drive connects successfully.
- [ ] Preview works with a small test folder.
- [ ] Import registers metadata only.
- [ ] `/` and `/timeline` show imported photos.
- [ ] One `/photos/<photo-id>` page loads.
- [ ] `/cleanup` loads.
- [ ] Family tester has `docs/FAMILY_TEST_GUIDE.md` instructions available to the facilitator.

## Rollback Notes

- Vercel: use the previous deployment from the Vercel Dashboard or run `vercel rollback` if the CLI is linked and logged in.
- Google OAuth: remove the deployed redirect URI or revoke the OAuth client if the test is canceled.
- Supabase: pause the project or remove deployment env vars if the test should stop. Do not hard delete app rows unless there is a separate database maintenance decision.
- Google Drive originals do not need rollback because the app never mutates them.
