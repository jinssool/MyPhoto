# Query Layer

The query layer is intentionally server-only until the auth and RLS strategy is defined.

- When `SUPABASE_URL` or `SUPABASE_ANON_KEY` is absent, query functions return the existing mock data fallback.
- When Supabase is configured and a database query fails, query functions throw the Supabase error.
- Client-side Supabase querying is intentionally avoided for now; UI pages should call server-side helpers when integration begins.
- Supabase service-role credentials must never be exposed in this repository, browser code, or `NEXT_PUBLIC_*` variables.
- Every Supabase read, insert, and update for family metadata must include or set `family_id`.
