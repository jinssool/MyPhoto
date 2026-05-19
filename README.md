# Family Memory Gallery

An image-centered family photo memory album web app scaffold. Google Drive remains the original photo storage; this app is only a browsing and memory UI.

## Current Scope

- Next.js, React, and TypeScript scaffold.
- Routes for home, timeline, photo detail, places, people, events, cleanup, import, and settings.
- Shared layout and parent-friendly navigation.
- Mock photo data and image-centered home photo cards.
- Server-only Supabase metadata query helpers with mock fallback.
- Google Drive read-only OAuth and folder metadata preview.
- No Drive import, Drive mutation, face recognition, comments, payments, invitations, or complex permissions yet.

## Local Drive Folder Preview

After configuring Supabase, Google OAuth, and `TOKEN_ENCRYPTION_KEY` in `.env.local`, reconnect Google Drive once so tokens are encrypted. Then preview image metadata from one folder:

```text
http://localhost:3000/api/google/drive/folders/preview?folderId=<google-drive-folder-id>
```

This endpoint lists image metadata only. It does not insert photo rows, create import jobs, download originals, or modify Google Drive files.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

The local app runs at `http://localhost:3000` by default.

## Local Drive OAuth Token Encryption

Google Drive OAuth tokens are stored only after server-side encryption. Generate a local 32-byte base64 key:

```bash
openssl rand -base64 32
```

Place the generated value in `.env.local`:

```bash
TOKEN_ENCRYPTION_KEY=<generated value>
```

Never commit `.env.local`, and never use `NEXT_PUBLIC_` for this key.

## Product Rules

- This is not a storage service.
- Google Drive is the source of original photos.
- The app should feel like a family album, not a file manager.
- MVP assumes one shared family account.
- Never delete, rename, or move original Google Drive files from this app.
