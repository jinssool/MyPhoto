-- Family Memory Gallery seed data for local development.
-- This seed stores Drive-style metadata and thumbnail references only.

insert into families (id, name)
values ('00000000-0000-0000-0000-000000000001', '우리집 앨범')
on conflict (id) do update set name = excluded.name;

insert into drive_connections (
  id,
  family_id,
  google_account_email,
  drive_folder_id,
  drive_folder_name,
  status
)
values (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000001',
  'mock-family@example.com',
  'mock-drive-folder-family-photos',
  'Family Photos Mock Folder',
  'disconnected'
)
on conflict (id) do update set
  google_account_email = excluded.google_account_email,
  drive_folder_id = excluded.drive_folder_id,
  drive_folder_name = excluded.drive_folder_name,
  status = excluded.status;

insert into import_jobs (
  id,
  family_id,
  drive_connection_id,
  status,
  source_folder_id,
  total_count,
  imported_count,
  skipped_count,
  failed_count,
  started_at,
  completed_at
)
values (
  '00000000-0000-0000-0000-000000000201',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000101',
  'completed',
  'mock-drive-folder-family-photos',
  16,
  16,
  0,
  0,
  '2026-05-17 00:00:00+00',
  '2026-05-17 00:03:00+00'
)
on conflict (id) do update set
  status = excluded.status,
  total_count = excluded.total_count,
  imported_count = excluded.imported_count,
  skipped_count = excluded.skipped_count,
  failed_count = excluded.failed_count,
  completed_at = excluded.completed_at;

insert into places (
  id,
  family_id,
  name,
  display_name,
  country,
  region,
  city,
  location_precision,
  is_sensitive,
  photo_count
)
values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', 'Han River Park', '한강공원', 'KR', 'Seoul', 'Seoul', 'approximate', false, 2),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000001', 'Grandma''s house', '할머니 댁', 'KR', null, null, 'hidden', true, 4),
  ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000001', 'Gangneung beach', '강릉 바닷가', 'KR', 'Gangwon', 'Gangneung', 'approximate', false, 1),
  ('00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000000001', 'Old family home', '예전 우리집', 'KR', null, null, 'hidden', true, 2),
  ('00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000000001', 'Incheon Airport', '인천공항', 'KR', 'Incheon', 'Incheon', 'approximate', false, 1),
  ('00000000-0000-0000-0000-000000001006', '00000000-0000-0000-0000-000000000001', 'Gapyeong campground', '가평 캠핑장', 'KR', 'Gyeonggi', 'Gapyeong', 'approximate', false, 2),
  ('00000000-0000-0000-0000-000000001007', '00000000-0000-0000-0000-000000000001', 'Place unknown', '장소 확인 필요', null, null, null, 'unknown', false, 2),
  ('00000000-0000-0000-0000-000000001008', '00000000-0000-0000-0000-000000000001', 'Paris cafe', '파리 카페', 'FR', 'Ile-de-France', 'Paris', 'approximate', false, 1),
  ('00000000-0000-0000-0000-000000001009', '00000000-0000-0000-0000-000000000001', 'Jeju stone wall road', '제주 돌담길', 'KR', 'Jeju', 'Jeju', 'approximate', false, 1),
  ('00000000-0000-0000-0000-000000001010', '00000000-0000-0000-0000-000000000001', 'Bukhansan trail', '북한산 등산길', 'KR', 'Seoul', 'Seoul', 'approximate', false, 2),
  ('00000000-0000-0000-0000-000000001011', '00000000-0000-0000-0000-000000000001', 'Seoul banquet hall', '서울 가족모임 장소', 'KR', 'Seoul', 'Seoul', 'approximate', false, 2)
on conflict (family_id, name) do update set
  display_name = excluded.display_name,
  country = excluded.country,
  region = excluded.region,
  city = excluded.city,
  location_precision = excluded.location_precision,
  is_sensitive = excluded.is_sensitive,
  photo_count = excluded.photo_count;

insert into events (
  id,
  family_id,
  title,
  description,
  start_date,
  end_date,
  date_precision,
  place_id,
  event_type,
  photo_count
)
values
  ('00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000000001', 'Spring picnic', '봄 소풍 샘플 묶음', '2001-04-22', '2001-04-22', 'day', '00000000-0000-0000-0000-000000001001', 'family_day', 2),
  ('00000000-0000-0000-0000-000000002002', '00000000-0000-0000-0000-000000000001', 'Grandma birthday', '할머니 생신 사진', '2008-09-14', '2008-09-14', 'day', '00000000-0000-0000-0000-000000001002', 'birthday', 2),
  ('00000000-0000-0000-0000-000000002003', '00000000-0000-0000-0000-000000000001', 'Summer trip', '여름 가족여행', '2010-07-23', '2012-07-28', 'year', '00000000-0000-0000-0000-000000001003', 'trip', 2),
  ('00000000-0000-0000-0000-000000002004', '00000000-0000-0000-0000-000000000001', 'Old home memories', '예전 우리집 스캔 사진', null, null, 'decade', '00000000-0000-0000-0000-000000001004', 'home', 2),
  ('00000000-0000-0000-0000-000000002005', '00000000-0000-0000-0000-000000000001', 'Europe trip', '첫 해외 가족여행', '2016-05-03', '2016-05-09', 'day', '00000000-0000-0000-0000-000000001005', 'trip', 4),
  ('00000000-0000-0000-0000-000000002006', '00000000-0000-0000-0000-000000000001', 'Camping weekend', '가평 캠핑 주말', '2006-08-12', '2006-08-12', 'day', '00000000-0000-0000-0000-000000001006', 'trip', 2),
  ('00000000-0000-0000-0000-000000002007', '00000000-0000-0000-0000-000000000001', 'Chuseok gathering', '추석 가족 모임', '2018-09-24', '2018-09-24', 'day', '00000000-0000-0000-0000-000000001002', 'holiday', 1),
  ('00000000-0000-0000-0000-000000002008', '00000000-0000-0000-0000-000000000001', 'Jeju trip', '제주 여행', '2021-10-04', '2021-10-05', 'day', '00000000-0000-0000-0000-000000001009', 'trip', 1),
  ('00000000-0000-0000-0000-000000002009', '00000000-0000-0000-0000-000000000001', 'Weekend hike', '주말 산행', '2022-05-21', '2022-05-21', 'day', '00000000-0000-0000-0000-000000001010', 'family_day', 2),
  ('00000000-0000-0000-0000-000000002010', '00000000-0000-0000-0000-000000000001', 'Family reunion', '가족 모임', '2023-11-18', '2023-11-18', 'day', '00000000-0000-0000-0000-000000001011', 'gathering', 2)
on conflict (family_id, title) do update set
  description = excluded.description,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  date_precision = excluded.date_precision,
  place_id = excluded.place_id,
  event_type = excluded.event_type,
  photo_count = excluded.photo_count;

insert into photos (
  id,
  family_id,
  drive_file_id,
  drive_folder_id,
  drive_web_view_link,
  drive_web_content_link,
  drive_thumbnail_link,
  title,
  caption,
  filename,
  mime_type,
  width,
  height,
  taken_at,
  date_source,
  date_precision,
  approximate_date_label,
  location_precision,
  place_id,
  event_id,
  visibility_state,
  is_screenshot_candidate,
  is_document_candidate,
  duplicate_group_id,
  reaction_count
)
values
  ('00000000-0000-0000-0000-000000003001', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-001', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-001', null, 'https://picsum.photos/seed/family-river-picnic/900/650', 'First picnic by the river', 'A quiet afternoon with everyone gathered around the lunch mat.', 'IMG_200104_river-picnic.jpg', 'image/jpeg', 900, 650, '2001-04-22 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000002001', 'active', false, false, null, 18),
  ('00000000-0000-0000-0000-000000003002', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-002', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-002', null, 'https://picsum.photos/seed/grandma-birthday-table/900/720', 'Grandma''s birthday table', 'Candles, fruit, and the cake everyone remembers.', 'DCIM_2008_09_birthday.jpg', 'image/jpeg', 900, 720, '2008-09-14 12:00:00+00', 'filename', 'day', null, 'hidden', '00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000002002', 'active', false, false, null, 31),
  ('00000000-0000-0000-0000-000000003003', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-003', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-003', null, 'https://picsum.photos/seed/family-beach-walk/850/1050', 'Beach walk after dinner', 'The sky turned pink before the family walked back to the pension.', 'beach-trip-2012-07.jpg', 'image/jpeg', 850, 1050, '2012-07-28 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000002003', 'active', false, false, null, 24),
  ('00000000-0000-0000-0000-000000003004', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-004', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-004', null, 'https://picsum.photos/seed/family-snow-yard/900/700', 'Snow day in the yard', 'A small snowman and a very cold family portrait.', 'winter_1999_scan.jpg', 'image/jpeg', 900, 700, '1999-01-11 12:00:00+00', 'manual', 'month', 'Winter 1999', 'hidden', '00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000002004', 'active', false, false, null, 42),
  ('00000000-0000-0000-0000-000000003005', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-005', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-005', null, 'https://picsum.photos/seed/family-airport-trip/900/650', 'Airport before the first trip abroad', 'Suitcases lined up before boarding.', 'EUROPE_2016_001.jpg', 'image/jpeg', 900, 650, '2016-05-03 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000002005', 'active', false, false, null, 29),
  ('00000000-0000-0000-0000-000000003006', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-006', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-006', null, 'https://picsum.photos/seed/unknown-summer-family/900/900', 'Unknown summer snapshot', 'A warm day from an old folder waiting for a better date.', 'scan_family_untitled_034.jpg', 'image/jpeg', 900, 900, null, 'unknown', 'unknown', 'Date unknown', 'unknown', '00000000-0000-0000-0000-000000001007', null, 'active', false, false, null, 7),
  ('00000000-0000-0000-0000-000000003010', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-010', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-010', null, 'https://picsum.photos/seed/blurry-campfire-laugh/900/680', 'Blurry campfire laugh', 'The photo is soft, but the laugh is still worth reviewing.', 'campfire_blur_2006.jpg', 'image/jpeg', 900, 680, '2006-08-12 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001006', '00000000-0000-0000-0000-000000002006', 'active', false, false, null, 13),
  ('00000000-0000-0000-0000-000000003011', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-011', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-011', null, 'https://picsum.photos/seed/family-river-picnic-copy/900/650', 'Duplicate picnic frame', 'Almost the same pose as another picnic photo.', 'IMG_200104_river-picnic-copy.jpg', 'image/jpeg', 900, 650, '2001-04-22 12:01:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000002001', 'active', false, false, 'dup-picnic-001', 9),
  ('00000000-0000-0000-0000-000000003018', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-018', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-018', null, 'https://picsum.photos/seed/train-ticket-screenshot/900/650', 'Train ticket screenshot', 'Useful for the trip, but probably not a memory photo.', 'Screenshot_20160508_ticket.png', 'image/png', 900, 650, '2016-05-08 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000002005', 'active', true, false, null, 2),
  ('00000000-0000-0000-0000-000000003019', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-019', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-019', null, 'https://picsum.photos/seed/family-dinner-receipt/850/1050', 'Receipt from the family dinner', 'A document-like photo that belongs in cleanup review.', 'receipt_dinner_2016.jpg', 'image/jpeg', 850, 1050, '2016-05-09 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001008', '00000000-0000-0000-0000-000000002005', 'active', false, true, null, 1),
  ('00000000-0000-0000-0000-000000003020', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-020', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-020', null, 'https://picsum.photos/seed/chuseok-kitchen-helpers/900/700', 'Chuseok kitchen helpers', 'Everyone had a job, even if some jobs were just tasting.', 'chuseok_2018_kitchen.jpg', 'image/jpeg', 900, 700, '2018-09-24 12:00:00+00', 'filename', 'day', null, 'hidden', '00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000002007', 'active', false, false, null, 45),
  ('00000000-0000-0000-0000-000000003025', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-025', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-025', null, 'https://picsum.photos/seed/video-call-birthday/900/650', 'Video call birthday', 'A screenshot from the year birthday candles moved online.', 'Screenshot_202004_birthday.png', 'image/png', 900, 650, '2020-04-18 12:00:00+00', 'filename', 'day', null, 'unknown', '00000000-0000-0000-0000-000000001007', null, 'active', true, false, null, 21),
  ('00000000-0000-0000-0000-000000003026', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-026', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-026', null, 'https://picsum.photos/seed/jeju-stone-wall-walk/900/700', 'Jeju stone wall walk', 'Windy weather, matching hats, and a slow walk after lunch.', 'jeju_2021_stone_wall.jpg', 'image/jpeg', 900, 700, '2021-10-04 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001009', '00000000-0000-0000-0000-000000002008', 'active', false, false, null, 47),
  ('00000000-0000-0000-0000-000000003029', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-029', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-029', null, 'https://picsum.photos/seed/hiking-map-photo/850/1050', 'Hiking map photo', 'A practical map photo that should be reviewed separately.', 'hiking_map_2022.jpg', 'image/jpeg', 850, 1050, '2022-05-21 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001010', '00000000-0000-0000-0000-000000002009', 'active', false, true, null, 3),
  ('00000000-0000-0000-0000-000000003030', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-030', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-030', null, 'https://picsum.photos/seed/family-reunion-dinner/900/650', 'Family reunion dinner', 'A long table and every chair filled.', 'reunion_2023_dinner.jpg', 'image/jpeg', 900, 650, '2023-11-18 12:00:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001011', '00000000-0000-0000-0000-000000002010', 'active', false, false, null, 58),
  ('00000000-0000-0000-0000-000000003031', '00000000-0000-0000-0000-000000000001', 'mock-drive-p-031', 'mock-drive-folder-family-photos', 'https://drive.google.com/mock/p-031', null, 'https://picsum.photos/seed/family-reunion-dinner-alt/900/650', 'Reunion group duplicate', 'A near-duplicate group photo from the same dinner.', 'reunion_2023_dinner_alt.jpg', 'image/jpeg', 900, 650, '2023-11-18 12:01:00+00', 'filename', 'day', null, 'approximate', '00000000-0000-0000-0000-000000001011', '00000000-0000-0000-0000-000000002010', 'active', false, false, 'dup-reunion-001', 12)
on conflict (family_id, drive_file_id) do update set
  drive_web_view_link = excluded.drive_web_view_link,
  drive_thumbnail_link = excluded.drive_thumbnail_link,
  title = excluded.title,
  caption = excluded.caption,
  filename = excluded.filename,
  mime_type = excluded.mime_type,
  width = excluded.width,
  height = excluded.height,
  taken_at = excluded.taken_at,
  date_source = excluded.date_source,
  date_precision = excluded.date_precision,
  approximate_date_label = excluded.approximate_date_label,
  location_precision = excluded.location_precision,
  place_id = excluded.place_id,
  event_id = excluded.event_id,
  visibility_state = excluded.visibility_state,
  is_screenshot_candidate = excluded.is_screenshot_candidate,
  is_document_candidate = excluded.is_document_candidate,
  duplicate_group_id = excluded.duplicate_group_id,
  reaction_count = excluded.reaction_count;

update events set cover_photo_id = case title
  when 'Spring picnic' then '00000000-0000-0000-0000-000000003001'::uuid
  when 'Grandma birthday' then '00000000-0000-0000-0000-000000003002'::uuid
  when 'Summer trip' then '00000000-0000-0000-0000-000000003003'::uuid
  when 'Old home memories' then '00000000-0000-0000-0000-000000003004'::uuid
  when 'Europe trip' then '00000000-0000-0000-0000-000000003005'::uuid
  when 'Camping weekend' then '00000000-0000-0000-0000-000000003010'::uuid
  when 'Chuseok gathering' then '00000000-0000-0000-0000-000000003020'::uuid
  when 'Jeju trip' then '00000000-0000-0000-0000-000000003026'::uuid
  when 'Weekend hike' then '00000000-0000-0000-0000-000000003029'::uuid
  when 'Family reunion' then '00000000-0000-0000-0000-000000003030'::uuid
  else cover_photo_id
end
where family_id = '00000000-0000-0000-0000-000000000001';

insert into person_clusters (
  id,
  family_id,
  display_name,
  relation_label,
  cover_photo_id,
  photo_count
)
values
  ('00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000000001', '엄마', 'mother', '00000000-0000-0000-0000-000000003001', 12),
  ('00000000-0000-0000-0000-000000004002', '00000000-0000-0000-0000-000000000001', '아빠', 'father', '00000000-0000-0000-0000-000000003001', 11),
  ('00000000-0000-0000-0000-000000004003', '00000000-0000-0000-0000-000000000001', '할머니', 'grandmother', '00000000-0000-0000-0000-000000003002', 4),
  ('00000000-0000-0000-0000-000000004004', '00000000-0000-0000-0000-000000000001', '지수', 'child', '00000000-0000-0000-0000-000000003001', 8),
  ('00000000-0000-0000-0000-000000004005', '00000000-0000-0000-0000-000000000001', '민', 'child', '00000000-0000-0000-0000-000000003003', 8),
  ('00000000-0000-0000-0000-000000004006', '00000000-0000-0000-0000-000000000001', '사람 확인 필요', 'unknown', '00000000-0000-0000-0000-000000003006', 4)
on conflict (family_id, display_name) do update set
  relation_label = excluded.relation_label,
  cover_photo_id = excluded.cover_photo_id,
  photo_count = excluded.photo_count;

insert into person_photos (family_id, person_cluster_id, photo_id, source)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000003001', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004002', '00000000-0000-0000-0000-000000003001', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004004', '00000000-0000-0000-0000-000000003001', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004003', '00000000-0000-0000-0000-000000003002', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000003002', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004002', '00000000-0000-0000-0000-000000003002', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000003003', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004002', '00000000-0000-0000-0000-000000003003', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004005', '00000000-0000-0000-0000-000000003003', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004006', '00000000-0000-0000-0000-000000003006', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004006', '00000000-0000-0000-0000-000000003018', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004006', '00000000-0000-0000-0000-000000003019', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000003020', 'manual'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000004003', '00000000-0000-0000-0000-000000003020', 'manual')
on conflict (family_id, person_cluster_id, photo_id) do nothing;

insert into reactions (family_id, photo_id, reaction_type, count)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003001', 'heart', 18),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003002', 'heart', 31),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003004', 'see_again', 42),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003020', 'heart', 45),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003030', 'heart', 58)
on conflict (family_id, photo_id, reaction_type) do update set count = excluded.count;

insert into cleanup_candidates (
  family_id,
  photo_id,
  candidate_type,
  reason,
  confidence,
  status
)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003006', 'unknown_date', 'No reliable taken_at date found in mock metadata.', 0.95, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003006', 'unknown_place', 'No place metadata available.', 0.95, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003006', 'unknown_person', 'No person labels assigned.', 0.95, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003010', 'blurry_candidate', 'Soft campfire image marked for family review.', 0.72, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003011', 'duplicate_candidate', 'Near-duplicate picnic frame.', 0.86, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003031', 'duplicate_candidate', 'Near-duplicate reunion group frame.', 0.86, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003018', 'screenshot_candidate', 'Travel ticket screenshot.', 0.92, 'review_later'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003018', 'unknown_person', 'No family member labels.', 0.90, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003019', 'document_candidate', 'Receipt-like image.', 0.91, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003019', 'unknown_person', 'No person labels assigned.', 0.90, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003025', 'screenshot_candidate', 'Video call screenshot.', 0.80, 'review_later'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003025', 'unknown_place', 'No physical place metadata.', 0.82, 'pending'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000003029', 'document_candidate', 'Trail map photo.', 0.84, 'pending')
on conflict (family_id, photo_id, candidate_type) do update set
  reason = excluded.reason,
  confidence = excluded.confidence,
  status = excluded.status;

update places
set photo_count = coalesce(counts.photo_count, 0)
from (
  select place_id, count(*)::integer as photo_count
  from photos
  where family_id = '00000000-0000-0000-0000-000000000001'
    and place_id is not null
  group by place_id
) counts
where places.id = counts.place_id
  and places.family_id = '00000000-0000-0000-0000-000000000001';

update places
set photo_count = 0
where family_id = '00000000-0000-0000-0000-000000000001'
  and id not in (
    select distinct place_id
    from photos
    where family_id = '00000000-0000-0000-0000-000000000001'
      and place_id is not null
  );

update events
set photo_count = coalesce(counts.photo_count, 0)
from (
  select event_id, count(*)::integer as photo_count
  from photos
  where family_id = '00000000-0000-0000-0000-000000000001'
    and event_id is not null
  group by event_id
) counts
where events.id = counts.event_id
  and events.family_id = '00000000-0000-0000-0000-000000000001';

update events
set photo_count = 0
where family_id = '00000000-0000-0000-0000-000000000001'
  and id not in (
    select distinct event_id
    from photos
    where family_id = '00000000-0000-0000-0000-000000000001'
      and event_id is not null
  );

update person_clusters
set photo_count = coalesce(counts.photo_count, 0)
from (
  select person_cluster_id, count(*)::integer as photo_count
  from person_photos
  where family_id = '00000000-0000-0000-0000-000000000001'
  group by person_cluster_id
) counts
where person_clusters.id = counts.person_cluster_id
  and person_clusters.family_id = '00000000-0000-0000-0000-000000000001';

update person_clusters
set photo_count = 0
where family_id = '00000000-0000-0000-0000-000000000001'
  and id not in (
    select distinct person_cluster_id
    from person_photos
    where family_id = '00000000-0000-0000-0000-000000000001'
  );
