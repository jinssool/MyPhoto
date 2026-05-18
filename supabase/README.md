# Supabase Schema

This folder contains the local Supabase schema and seed structure for the Family Memory Gallery metadata index.

The app stores Google Drive file references, thumbnail links, and normalized photo metadata. It does not store original image files or image blobs in Supabase.

RLS policies are intentionally deferred until the auth and server-access strategy is chosen. Until then, every core table includes `family_id` so the Task 3 query layer can consistently scope reads and writes.

## Local Validation

Supabase CLI was not available in this environment. To validate locally after installing it:

```bash
npm run validate:query-layer
npm run typecheck
npm run build
supabase db reset
supabase status
npm run dev
```

`supabase db reset` applies `supabase/migrations/*.sql` and then loads `supabase/seed.sql`.

## Local Supabase Seeded Read Test

1. Reset and seed the local database:

```bash
supabase db reset
supabase status
```

2. Copy the local API URL and anon key from `supabase status` into `.env.local`:

```bash
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<local anon key from supabase status>
```

`.env.local` is local-only and must not be committed.

3. Run the app and verify seeded read routes:

```bash
npm run dev
```

Check:

```text
/
/timeline
/photos/00000000-0000-0000-0000-000000003001
/places
/people
/events
/cleanup
```

4. Run the standard validation gates:

```bash
npm run validate:query-layer
npm run typecheck
npm run build
```

To recheck mock fallback, unset `SUPABASE_URL` and `SUPABASE_ANON_KEY`, then verify the same read routes plus `/photos/p-001`.
