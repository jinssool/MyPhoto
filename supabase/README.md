# Supabase Schema

This folder contains the local Supabase schema and seed structure for the Family Memory Gallery metadata index.

The app stores Google Drive file references, thumbnail links, and normalized photo metadata. It does not store original image files or image blobs in Supabase.

RLS policies are intentionally deferred until the auth and server-access strategy is chosen. Until then, every core table includes `family_id` so the Task 3 query layer can consistently scope reads and writes.

## Local Validation

Supabase CLI was not available in this environment. To validate locally after installing it:

```bash
npm run typecheck
npm run build
supabase db reset
```

`supabase db reset` applies `supabase/migrations/*.sql` and then loads `supabase/seed.sql`.
