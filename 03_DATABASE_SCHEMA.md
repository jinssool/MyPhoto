# Supabase 데이터 모델 설계서

## 1. 핵심 엔티티

- families
- family_settings
- drive_connections
- import_jobs
- import_job_items
- photos
- events
- event_photos
- places
- photo_places
- person_clusters
- person_photos
- reactions
- cleanup_candidates
- duplicate_groups
- duplicate_group_items

---

## 2. MVP용 최소 테이블

### 2.1 families

가족 앨범 단위.

```sql
create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);
```

---

### 2.2 drive_connections

Google Drive OAuth 연결 정보.

```sql
create table drive_connections (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  google_account_email text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  drive_folder_id text,
  drive_folder_name text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

주의:
- token은 평문 저장 금지
- MVP 내부용이라도 암호화 컬럼 또는 서버 보관 필요
- client에 refresh token 노출 금지

---

### 2.3 import_jobs

```sql
create table import_jobs (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  drive_connection_id uuid references drive_connections(id) on delete set null,
  status text not null check (status in ('pending', 'running', 'completed', 'failed', 'canceled')),
  total_count integer not null default 0,
  imported_count integer not null default 0,
  skipped_count integer not null default 0,
  failed_count integer not null default 0,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

### 2.4 photos

```sql
create table photos (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,

  source text not null default 'google_drive',
  drive_file_id text not null,
  drive_folder_id text,
  drive_web_view_link text,
  drive_web_content_link text,
  drive_thumbnail_link text,

  filename text not null,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,

  taken_at timestamptz,
  date_source text check (date_source in ('exif', 'filename', 'drive_created', 'manual', 'unknown')),
  date_precision text not null default 'unknown' check (date_precision in ('exact', 'day', 'month', 'year', 'decade', 'unknown')),
  approximate_date_label text,

  latitude double precision,
  longitude double precision,
  location_precision text default 'unknown' check (location_precision in ('exact', 'approximate', 'hidden', 'unknown')),

  place_id uuid,
  event_id uuid,

  visibility_state text not null default 'active'
    check (visibility_state in ('active', 'hidden', 'excluded', 'trash_candidate')),

  quality_score numeric,
  blur_score numeric,
  is_screenshot_candidate boolean not null default false,
  is_document_candidate boolean not null default false,

  perceptual_hash text,
  duplicate_group_id uuid,

  favorite_count integer not null default 0,
  reaction_count integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (family_id, drive_file_id)
);
```

인덱스:

```sql
create index idx_photos_family_taken_at on photos(family_id, taken_at desc);
create index idx_photos_family_visibility on photos(family_id, visibility_state);
create index idx_photos_family_place on photos(family_id, place_id);
create index idx_photos_family_event on photos(family_id, event_id);
create index idx_photos_drive_file on photos(drive_file_id);
create index idx_photos_duplicate_group on photos(duplicate_group_id);
```

---

### 2.5 places

```sql
create table places (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  display_name text not null,
  country text,
  city text,
  region text,
  latitude double precision,
  longitude double precision,
  location_precision text default 'approximate',
  is_sensitive boolean not null default false,
  photo_count integer not null default 0,
  created_at timestamptz not null default now()
);
```

---

### 2.6 events

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  title text not null,
  description text,
  start_date date,
  end_date date,
  date_precision text default 'unknown',
  cover_photo_id uuid,
  place_id uuid references places(id) on delete set null,
  event_type text,
  created_at timestamptz not null default now()
);
```

---

### 2.7 person_clusters

```sql
create table person_clusters (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  display_name text not null,
  relation_label text,
  cover_photo_id uuid,
  is_hidden boolean not null default false,
  photo_count integer not null default 0,
  created_at timestamptz not null default now()
);
```

초기 display_name 예시:
- 사람 1
- 사람 2
- 사람 3

---

### 2.8 person_photos

```sql
create table person_photos (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  person_cluster_id uuid not null references person_clusters(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  source text not null default 'manual' check (source in ('manual', 'face_detection', 'import')),
  confidence numeric,
  created_at timestamptz not null default now(),
  unique (person_cluster_id, photo_id)
);
```

---

### 2.9 reactions

```sql
create table reactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('like', 'heart', 'funny', 'miss', 'pretty', 'see_again')),
  count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, photo_id, reaction_type)
);
```

초기 공동 계정 구조에서는 사용자별 reaction row보다 count 누적 방식이 단순하다.

---

### 2.10 cleanup_candidates

```sql
create table cleanup_candidates (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  candidate_type text not null check (
    candidate_type in (
      'duplicate',
      'blurry',
      'screenshot',
      'document',
      'unknown_date',
      'unknown_place',
      'unknown_person'
    )
  ),
  reason text,
  confidence numeric,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'resolved')),
  created_at timestamptz not null default now(),
  unique (photo_id, candidate_type)
);
```

---

## 3. Post-MVP 확장 테이블

### 3.1 face_detections

자동 얼굴인식을 붙일 때 사용.

```sql
create table face_detections (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  person_cluster_id uuid references person_clusters(id) on delete set null,
  bounding_box jsonb,
  embedding_ref text,
  confidence numeric,
  status text not null default 'unconfirmed',
  created_at timestamptz not null default now()
);
```

---

### 3.2 duplicate_groups

```sql
create table duplicate_groups (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  representative_photo_id uuid,
  duplicate_type text check (duplicate_type in ('exact', 'similar', 'burst')),
  created_at timestamptz not null default now()
);
```

```sql
create table duplicate_group_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  duplicate_group_id uuid not null references duplicate_groups(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  score numeric,
  is_representative boolean not null default false,
  created_at timestamptz not null default now(),
  unique (duplicate_group_id, photo_id)
);
```

---

## 4. 데이터 상태 정책

### visibility_state

- active: 일반 노출
- hidden: 기본 화면에서 숨김
- excluded: 가족 앨범에서 제외
- trash_candidate: 삭제 후보지만 원본 삭제 아님

### date_precision

- exact: 정확한 시간
- day: 날짜까지
- month: 월까지
- year: 연도까지
- decade: 1990년대 등
- unknown: 모름

### location_precision

- exact: 정확 좌표
- approximate: 대략 위치
- hidden: 민감 위치 숨김
- unknown: 위치 없음

---

## 5. RLS 방향

초기 내부 프로젝트라 단순화 가능하지만, 최소한 family_id 기준 격리는 유지한다.

원칙:

- client에서 모든 family_id 접근 허용 금지
- 가족 공동 계정이라도 family_id는 서버에서 결정
- service role은 서버 전용
- 추후 다가족 SaaS화 가능성을 고려해 family_id를 모든 핵심 테이블에 포함
