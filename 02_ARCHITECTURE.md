# 기술 설계서 — Architecture

## 1. 전체 구조

```text
[Google Drive]
  - 원본 사진 저장
  - 파일 ID / 썸네일 / 메타데이터 제공
        |
        v
[Server API / Import Worker]
  - Drive API 호출
  - 파일 목록 스캔
  - 메타데이터 정규화
  - DB 저장
        |
        v
[Supabase Postgres]
  - photo index
  - albums/events
  - places
  - people clusters
  - reactions
  - import jobs
        |
        v
[Web App]
  - Home
  - Timeline
  - Map
  - People
  - Events
  - Cleanup
  - Photo detail
```

---

## 2. 핵심 설계 원칙

### 2.1 Drive Adapter Pattern

Google Drive API를 UI 코드에 직접 섞지 않는다.

권장 구조:

```text
src/lib/drive/driveClient.ts
src/lib/drive/driveAdapter.ts
src/lib/drive/driveTypes.ts
src/server/import/importDriveFolder.ts
```

이렇게 하면 나중에 Google Photos, local upload, NAS 등을 붙일 수 있다.

---

## 3. 주요 모듈

### 3.1 Drive Integration

역할:

- OAuth 연결
- 폴더 선택
- 이미지 파일 목록 조회
- 파일 메타데이터 조회
- thumbnailLink/webViewLink/webContentLink 저장
- 변경 사항 sync

주의:

- client에 refresh token 노출 금지
- Drive 원본 삭제 API 사용 금지
- API quota 대비 pagination 필요

---

### 3.2 Import Job

사진 인덱싱은 동기 요청 하나로 끝내지 않는다.

필요한 이유:

- 1,000장 이상이면 timeout 가능
- 중간 실패 가능
- 재시도 필요
- 사용자가 진행 상태를 봐야 함

상태:

- pending
- running
- completed
- failed
- canceled

job item 상태:

- pending
- imported
- skipped
- failed

---

### 3.3 Metadata Normalizer

입력:

- Google Drive file metadata
- imageMediaMetadata
- filename
- createdTime
- modifiedTime

출력:

- taken_at
- date_source
- date_precision
- width
- height
- latitude
- longitude
- place_candidate
- is_screenshot_candidate
- quality placeholder

날짜 우선순위:

1. EXIF / imageMediaMetadata time
2. filename date pattern
3. Drive createdTime
4. unknown

---

### 3.4 Gallery Query Layer

UI에서 직접 SQL을 흩뿌리지 않는다.

권장:

```text
src/lib/photos/photoQueries.ts
src/lib/photos/photoMutations.ts
src/lib/photos/photoTypes.ts
```

주요 함수:

- getHomeHighlights()
- getTimelinePhotos(year, month, cursor)
- getPhotoDetail(photoId)
- getPhotosByPlace(placeId)
- getPhotosByPerson(personId)
- updatePhotoVisibility(photoId, state)
- addReaction(photoId, reactionType)

---

### 3.5 Cleanup Engine

MVP에서는 완전한 AI 판단이 아니라 후보 분류만 한다.

후보 종류:

- duplicate_candidate
- blurry_candidate
- screenshot_candidate
- document_candidate
- unknown_date
- unknown_place
- unknown_person

정책:

- 후보만 만든다.
- 삭제하지 않는다.
- 사용자가 정리함에서 처리한다.

---

### 3.6 People Engine

초기에는 자동 얼굴인식을 붙이지 않는다.  
DB 구조와 UI를 먼저 만든다.

1차:

- person_clusters 테이블
- person_photos 연결 테이블
- 수동 이름 설정
- 사람별 사진 보기

2차:

- face_detections
- face_embeddings
- candidate merges
- split/merge UI

---

### 3.7 Map Engine

1차:

- latitude/longitude가 있는 사진 표시
- 장소별 그룹 생성
- 도시/국가 단위 표시

2차:

- reverse geocoding
- 장소 별칭
- 민감 위치 둔감화
- 장소 병합 제안

---

## 4. 프론트엔드 화면 라우팅 예시

```text
/
  홈

/timeline
  전체 타임라인

/timeline/[year]
  특정 연도

/timeline/[year]/[month]
  특정 월

/photos/[photoId]
  사진 상세

/places
  장소 목록/지도

/places/[placeId]
  특정 장소 사진

/people
  사람 목록

/people/[personId]
  특정 사람 사진

/events
  이벤트 앨범 목록

/events/[eventId]
  이벤트 앨범 상세

/cleanup
  정리함

/admin/import
  Drive 연결 및 import

/settings
  최소 설정
```

---

## 5. 이미지 로딩 전략

### 목록 화면

- 원본 이미지 로드 금지
- Drive thumbnailLink 또는 서비스 썸네일 사용
- lazy loading
- image grid virtualization 검토

### 상세 화면

- 큰 이미지 로드
- 이전/다음 사진 prefetch
- 실패 시 Drive 원본 열기 제공

### 캐시

- 자주 보는 썸네일은 브라우저 캐시 활용
- 필요 시 Supabase Storage에 derived thumbnail 저장
- 원본 대량 저장은 금지

---

## 6. 권장 폴더 구조

```text
family-memory-gallery/
  README.md
  AGENTS.md
  .env.example

  src/
    app/
      page.tsx
      timeline/
      photos/
      places/
      people/
      events/
      cleanup/
      admin/
      settings/

    components/
      layout/
      gallery/
      photo/
      timeline/
      places/
      people/
      reactions/
      cleanup/
      common/

    lib/
      supabase/
      drive/
      photos/
      metadata/
      dates/
      places/
      people/
      reactions/
      cleanup/

    server/
      import/
      drive/
      jobs/

    types/

  supabase/
    migrations/
    seed.sql

  tests/
    unit/
    integration/
    fixtures/
```

---

## 7. 환경변수 예시

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

APP_BASE_URL=
FAMILY_ADMIN_EMAIL=
```

주의:

- service role key는 client에 노출 금지
- Google refresh token은 DB/서버 저장
- `.env.local`은 커밋 금지

---

## 8. API Endpoint 예시

```text
GET  /api/drive/oauth/start
GET  /api/drive/oauth/callback

POST /api/import/drive-folder
GET  /api/import/jobs/:jobId
POST /api/import/jobs/:jobId/cancel

GET  /api/photos
GET  /api/photos/:photoId
POST /api/photos/:photoId/reactions
PATCH /api/photos/:photoId/visibility

GET  /api/timeline
GET  /api/places
GET  /api/people
GET  /api/events
```

---

## 9. 실패 처리

### Drive API 실패

- 사용자에게 “Google Drive 연결이 만료되었습니다” 표시
- 재연결 버튼 제공
- 기존 인덱스 사진은 가능한 계속 표시

### 썸네일 실패

- placeholder 표시
- 원본 Drive 열기 제공
- retry 가능

### import 중단

- job 상태 failed
- 실패 item 기록
- 재시도 가능

### 날짜 없음

- 시기 미정으로 이동
- 사용자가 대략 시기 입력

---

## 10. 성능 리스크와 대응

| 리스크 | 대응 |
|---|---|
| 10,000장 렌더링 | 무한 스크롤, 페이지네이션, 가상화 |
| 원본 이미지 로딩 과다 | 썸네일 우선 |
| Drive API quota | batch/pagination, incremental sync |
| import timeout | job 기반 처리 |
| 지도 마커 과다 | cluster |
| DB query 느림 | taken_at, place_id, visibility_state index |
| 얼굴인식 비용/속도 | 별도 feature flag, background worker |
