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

## Product Rules

- This is not a storage service.
- Google Drive is the source of original photos.
- The app should feel like a family album, not a file manager.
- MVP assumes one shared family account.
- Never delete, rename, or move original Google Drive files from this app.
