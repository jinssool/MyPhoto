# Family Memory Gallery

An image-centered family photo memory album web app scaffold. Google Drive remains the original photo storage; this app is only a browsing and memory UI.

## Current Scope

- Next.js, React, and TypeScript scaffold.
- Routes for home, timeline, photo detail, places, people, events, cleanup, import, and settings.
- Shared layout and parent-friendly navigation.
- Mock photo data and image-centered home photo cards.
- No Google Drive API, Supabase, face recognition, comments, payments, invitations, or complex permissions yet.

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
