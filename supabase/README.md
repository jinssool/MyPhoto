# Supabase Schema

This folder contains the local Supabase schema and seed structure for the Family Memory Gallery metadata index.

The app stores Google Drive file references, thumbnail links, and normalized photo metadata. It does not store original image files.

## Local Validation

Supabase CLI was not available in this environment. To validate locally after installing it:

```bash
npm run typecheck
npm run build
supabase db reset
```

`supabase db reset` applies `supabase/migrations/*.sql` and then loads `supabase/seed.sql`.
