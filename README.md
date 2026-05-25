# Family Memory Gallery

Internal MVP v0.1 for a family photo memory album. Google Drive remains the original photo storage; this app stores and edits album metadata only.

## MVP Capabilities

- Image-centered Home and Timeline browsing for one shared family account.
- Photo detail page with family-friendly context and safe app-level actions.
- Places, people, events, and cleanup browsing routes with mock fallback data.
- Google Drive read-only OAuth connection.
- Google Drive folder preview for image metadata.
- Metadata-only Drive import into Supabase, idempotent by `family_id` and `drive_file_id`.
- Server-only Supabase query layer with mock fallback when Supabase env vars are absent.
- Photo actions: add reaction, hide from album browsing, exclude from browsing, restore.
- Cleanup actions: keep, review later, hide, exclude.
- Safety validation script that blocks hard deletes, Drive mutation patterns, raw token logging, secret exposure, client-side Supabase usage, and original/blob storage patterns.

## Product Rules

- This is a family memory album, not a storage product.
- Google Drive is the source of original photos.
- The app should feel warm, simple, and parent-friendly.
- MVP assumes one shared family account.
- Never delete, rename, move, or otherwise mutate original Google Drive files from this app.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment placeholders:

```bash
cp .env.example .env.local
```

3. Fill in Supabase, Google OAuth, and token encryption values as described below.

4. Run the app:

```bash
npm run dev
```

The local app runs at `http://localhost:3000` by default.

## Supabase Setup

The app uses Supabase for album metadata only. It stores Google Drive file references, thumbnail links, normalized photo metadata, reaction counts, visibility states, import jobs, and cleanup candidates. It does not store original images or image blobs.

For local Supabase:

```bash
supabase db reset
supabase status
```

Copy the local API URL and anon key into `.env.local`:

```bash
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<local anon key from supabase status>
```

RLS and production auth are intentionally deferred. Until then, query helpers scope reads and writes with the shared `family_id`.

If Supabase env vars are missing, the UI uses mock fallback data so the album can still be reviewed locally.

## Google OAuth Setup

Create a Google OAuth client for local development and set:

```bash
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/drive/oauth/callback
GOOGLE_DRIVE_SCOPES=https://www.googleapis.com/auth/drive.readonly
```

Only `drive.readonly` is allowed. Do not add Drive write, delete, move, rename, or upload scopes.

Reconnect Google Drive from:

```text
http://localhost:3000/admin/import
```

The connection step stores encrypted OAuth tokens server-side. It does not preview folders, register photos, download originals, or modify Drive files.

## Token Encryption Setup

Google Drive OAuth tokens are stored only after server-side encryption. Generate a local 32-byte base64 key:

```bash
openssl rand -base64 32
```

Place the generated value in `.env.local`:

```bash
TOKEN_ENCRYPTION_KEY=<generated value>
```

Never commit `.env.local`, and never prefix this key with `NEXT_PUBLIC_`.

Drive access tokens expire. If an encrypted refresh token is available, the app refreshes access tokens server-side and stores the refreshed access token encrypted. If refresh fails, reconnect Google Drive from `/admin/import`.

## Drive Folder Preview

After Supabase, Google OAuth, and `TOKEN_ENCRYPTION_KEY` are configured, preview a Drive folder:

```text
http://localhost:3000/api/google/drive/folders/preview?folderId=<google-drive-folder-id>
```

You can pass either a folder ID or a full folder URL such as:

```text
https://drive.google.com/drive/folders/<google-drive-folder-id>
```

Preview lists image metadata only. It does not insert rows, create import jobs, download originals, store blobs, or modify Google Drive files.

## Drive Metadata Import

To register previewed folder metadata in the album database:

```bash
curl -X POST http://localhost:3000/api/google/drive/folders/import \
  -F "folderId=<google-drive-folder-id>"
```

The import endpoint:

- creates an `import_jobs` row;
- reads Drive image metadata through read-only Drive access;
- upserts `photos` metadata by `family_id` and `drive_file_id`;
- creates cleanup candidates for simple metadata-based review cases;
- returns a JSON summary with next-step links.

The import endpoint does not download original image files, store image blobs, delete Drive files, move Drive files, or rename Drive files.

## Photo Actions

Photo detail supports these app-level actions:

- `좋아요 남기기`: increments the reaction count.
- `앨범에서 숨기기`: changes the photo visibility state to hidden.
- `둘러보기에서 제외`: changes the photo visibility state to excluded.
- `다시 보이기`: restores the photo visibility state to active.

Hidden and excluded photos are removed from default Home and Timeline browsing. These actions only update app metadata in Supabase; Google Drive originals are unchanged.

## Cleanup Actions

The cleanup page groups review candidates such as duplicate-looking files, screenshots, document-like photos, and unknown dates or places.

Cleanup actions:

- `앨범에 두기`: marks a cleanup candidate as kept.
- `나중에 보기`: marks a cleanup candidate for later review.
- `숨기기`: marks the candidate hidden and hides the photo from default browsing.
- `제외하기`: marks the candidate excluded and excludes the photo from default browsing.

Cleanup is app-level metadata only. It never deletes, moves, renames, or edits original Drive files.

## Validation

Run the standard gates before handing off changes:

```bash
npm run validate:query-layer
npm run validate:deployment
npm run typecheck
npm run build
npm audit --audit-level=moderate
git diff --check
```

Useful smoke routes:

```text
/
/timeline
/photos/<photo-id>
/cleanup
/places
/people
/events
/admin/import
```

## Known Limitations

- One shared family account only.
- No production auth or RLS policy model yet.
- No Google Picker.
- No recursive folder import.
- No background queues.
- No large-scale import pagination beyond the current Drive page-size handling.
- No original image download or storage.
- No image blob storage.
- No Drive delete, move, rename, upload, or write behavior.
- No comments.
- No voice memos.
- No face recognition.
- No payments.
- No invitations or complex permissions.
- No production backup, monitoring, or analytics workflow.

See [docs/MVP_CHECKLIST.md](docs/MVP_CHECKLIST.md) and [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md) for the v0.1 handoff checklist and roadmap.

For remote private family testing, see [docs/REMOTE_DEPLOYMENT_GUIDE.md](docs/REMOTE_DEPLOYMENT_GUIDE.md).
