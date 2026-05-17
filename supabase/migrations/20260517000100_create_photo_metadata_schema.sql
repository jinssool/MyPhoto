-- Family Memory Gallery metadata schema.
-- Stores Google Drive references and app metadata only, not original photo files.

create extension if not exists "pgcrypto";

create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists drive_connections (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  google_account_email text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  drive_folder_id text,
  drive_folder_name text,
  status text not null default 'disconnected'
    check (status in ('disconnected', 'active', 'error', 'revoked')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists import_jobs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  drive_connection_id uuid references drive_connections(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'running', 'completed', 'failed', 'canceled')),
  source_folder_id text,
  total_count integer not null default 0 check (total_count >= 0),
  imported_count integer not null default 0 check (imported_count >= 0),
  skipped_count integer not null default 0 check (skipped_count >= 0),
  failed_count integer not null default 0 check (failed_count >= 0),
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  display_name text not null,
  country text,
  region text,
  city text,
  latitude double precision,
  longitude double precision,
  location_precision text not null default 'unknown'
    check (location_precision in ('exact', 'approximate', 'hidden', 'unknown')),
  is_sensitive boolean not null default false,
  photo_count integer not null default 0 check (photo_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, name)
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  description text,
  start_date date,
  end_date date,
  date_precision text not null default 'unknown'
    check (date_precision in ('exact', 'day', 'month', 'year', 'decade', 'unknown')),
  cover_photo_id uuid,
  place_id uuid references places(id) on delete set null,
  event_type text,
  photo_count integer not null default 0 check (photo_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, title)
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,

  source text not null default 'google_drive'
    check (source in ('google_drive')),
  drive_file_id text not null,
  drive_folder_id text,
  drive_web_view_link text,
  drive_web_content_link text,
  drive_thumbnail_link text,

  title text,
  caption text,
  filename text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),

  taken_at timestamptz,
  date_source text not null default 'unknown'
    check (date_source in ('exif', 'filename', 'drive_created', 'manual', 'unknown')),
  date_precision text not null default 'unknown'
    check (date_precision in ('exact', 'day', 'month', 'year', 'decade', 'unknown')),
  approximate_date_label text,

  latitude double precision,
  longitude double precision,
  location_precision text not null default 'unknown'
    check (location_precision in ('exact', 'approximate', 'hidden', 'unknown')),

  place_id uuid references places(id) on delete set null,
  event_id uuid references events(id) on delete set null,

  visibility_state text not null default 'active'
    check (visibility_state in ('active', 'hidden', 'excluded', 'trash_candidate')),

  quality_score numeric,
  blur_score numeric,
  is_screenshot_candidate boolean not null default false,
  is_document_candidate boolean not null default false,
  perceptual_hash text,
  duplicate_group_id text,

  favorite_count integer not null default 0 check (favorite_count >= 0),
  reaction_count integer not null default 0 check (reaction_count >= 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (family_id, drive_file_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'events_cover_photo_id_fkey'
  ) then
    alter table events
      add constraint events_cover_photo_id_fkey
      foreign key (cover_photo_id) references photos(id) on delete set null;
  end if;
end $$;

create table if not exists person_clusters (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  display_name text not null,
  relation_label text,
  cover_photo_id uuid references photos(id) on delete set null,
  is_hidden boolean not null default false,
  photo_count integer not null default 0 check (photo_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, display_name)
);

create table if not exists person_photos (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  person_cluster_id uuid not null references person_clusters(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  source text not null default 'manual'
    check (source in ('manual', 'import')),
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  created_at timestamptz not null default now(),
  unique (family_id, person_cluster_id, photo_id)
);

create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  reaction_type text not null
    check (reaction_type in ('like', 'heart', 'funny', 'miss', 'pretty', 'see_again')),
  count integer not null default 1 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, photo_id, reaction_type)
);

create table if not exists cleanup_candidates (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  candidate_type text not null check (
    candidate_type in (
      'blurry_candidate',
      'duplicate_candidate',
      'screenshot_candidate',
      'document_candidate',
      'unknown_date',
      'unknown_place',
      'unknown_person'
    )
  ),
  reason text,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 1)),
  status text not null default 'pending'
    check (status in ('pending', 'kept', 'hidden', 'excluded', 'review_later', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, photo_id, candidate_type)
);

create index if not exists idx_photos_family_taken_at on photos(family_id, taken_at desc);
create index if not exists idx_photos_family_visibility on photos(family_id, visibility_state);
create index if not exists idx_photos_family_place on photos(family_id, place_id);
create index if not exists idx_photos_family_event on photos(family_id, event_id);
create index if not exists idx_photos_drive_file on photos(drive_file_id);
create index if not exists idx_cleanup_candidates_family_status on cleanup_candidates(family_id, status);

create index if not exists idx_drive_connections_family on drive_connections(family_id);
create index if not exists idx_import_jobs_family_status on import_jobs(family_id, status);
create index if not exists idx_places_family_name on places(family_id, name);
create index if not exists idx_events_family_title on events(family_id, title);
create index if not exists idx_person_clusters_family on person_clusters(family_id);
create index if not exists idx_person_photos_family_person on person_photos(family_id, person_cluster_id);
create index if not exists idx_person_photos_family_photo on person_photos(family_id, photo_id);
create index if not exists idx_reactions_family_photo on reactions(family_id, photo_id);
