# Codex 파트별 구현 지시서

## 사용 방법

아래 Task를 한 번에 모두 시키지 말고, 하나씩 순서대로 Codex에게 전달한다.  
각 Task는 구현 범위, 금지사항, 완료 기준을 포함한다.

---

# Task 0 — Project Scaffold

## 목표

가족사진 앨범 웹서비스의 기본 프로젝트 구조를 만든다.

## 지시문

```text
너는 senior full-stack engineer다. 
가족사진 이미지 중심 앨범 웹서비스의 기본 React/TypeScript 프로젝트 골격을 만들어라.

제품 원칙:
- 이 서비스는 Google Drive 원본 사진을 보여주는 이미지 중심 가족 앨범이다.
- 파일 관리 UI가 아니라 사진 탐색 UI가 중심이다.
- 초기에는 가족 공동 계정 기준이다.
- 댓글/음성메모/권한관리/결제는 구현하지 않는다.

구현 범위:
1. 기본 라우트 생성
   - /
   - /timeline
   - /photos/[photoId]
   - /places
   - /people
   - /events
   - /cleanup
   - /admin/import
   - /settings
2. 공통 레이아웃
3. 상단/측면 네비게이션
4. TypeScript type 기본 정의
5. mock data 파일
6. README와 .env.example 작성

금지:
- 아직 Google Drive API 붙이지 마라.
- 아직 Supabase 붙이지 마라.
- 얼굴인식 구현하지 마라.
- 댓글 기능 만들지 마라.

완료 기준:
- 모든 라우트 접속 가능
- mock data 기반으로 홈에 사진 카드 표시
- npm run build 통과
```

---

# Task 1 — Mock Image-Centered UI

## 목표

부모님도 보기 쉬운 이미지 중심 UI를 만든다.

## 지시문

```text
Mock 데이터만 사용해서 가족사진 앨범의 핵심 UI를 구현해라.

구현 화면:
1. Home
   - 오늘의 추억
   - 최근 추가된 사진
   - 반응 많은 사진
   - 연도별 앨범 카드
2. Timeline
   - 연도/월별 사진 그룹
   - 큰 대표 사진 + 그리드
   - 시기 미정 섹션
3. Photo Detail
   - 큰 이미지
   - 촬영일
   - 장소
   - 사람 태그
   - 반응 버튼
   - 다운로드 버튼 UI
   - 원본 열기 버튼 UI
4. Cleanup
   - 흐림 후보
   - 중복 후보
   - 스크린샷 후보
   - 시기 미정 후보

UX 조건:
- 사진이 화면의 중심이어야 한다.
- 파일명은 보조 정보로만 표시한다.
- 버튼은 크고 명확해야 한다.
- 중장년층 사용자를 고려해 글씨는 작지 않게 한다.

금지:
- 실제 API 연동 금지
- 복잡한 설정 페이지 금지
- SNS 피드처럼 만들지 말 것

완료 기준:
- mock 사진 30장 이상으로 자연스럽게 탐색 가능
- 모바일/데스크톱에서 레이아웃 깨지지 않음
- 사진 상세 이동 가능
```

---

# Task 2 — Supabase Schema

## 목표

사진 메타데이터 인덱스 DB를 만든다.

## 지시문

```text
Supabase Postgres migration을 작성해라.

필수 테이블:
- families
- drive_connections
- import_jobs
- photos
- places
- events
- person_clusters
- person_photos
- reactions
- cleanup_candidates

중요 정책:
- 모든 핵심 테이블에 family_id를 포함한다.
- photos는 (family_id, drive_file_id) unique 제약을 가진다.
- visibility_state는 active/hidden/excluded/trash_candidate만 허용한다.
- 원본 삭제가 아니라 상태 변경만 가능해야 한다.
- taken_at, visibility_state, place_id에는 index를 둔다.

추가:
- seed.sql로 mock family와 mock photos를 넣어라.
- TypeScript 타입 또는 DB type helper를 만들어라.

금지:
- refresh token을 평문 저장하는 실제 구현을 만들지 마라. placeholder 구조만 둬라.
- 사용자별 복잡한 권한 모델 만들지 마라.

완료 기준:
- migration 실행 가능
- seed 실행 후 timeline query 가능
- build 통과
```

---

# Task 3 — DB Query Layer

## 목표

UI가 DB에서 사진 데이터를 가져오게 만든다.

## 지시문

```text
Mock data 의존성을 줄이고 Supabase query layer를 구현해라.

구현 함수:
- getHomeHighlights(familyId)
- getTimelinePhotos(familyId, params)
- getPhotoDetail(familyId, photoId)
- getPlaces(familyId)
- getPeople(familyId)
- getCleanupCandidates(familyId)
- addReaction(familyId, photoId, reactionType)
- updatePhotoVisibility(familyId, photoId, visibilityState)

조건:
- UI 컴포넌트에서 Supabase SQL을 직접 흩뿌리지 마라.
- src/lib/photos, src/lib/reactions, src/lib/places처럼 도메인별로 분리해라.
- 모든 query는 family_id로 제한해라.

완료 기준:
- seed data가 UI에 표시된다.
- 반응을 누르면 DB count가 증가한다.
- hidden/excluded 사진은 기본 gallery에서 제외된다.
```

---

# Task 4 — Google Drive OAuth Skeleton

## 목표

Google Drive 연결의 골격을 만든다.

## 지시문

```text
Google Drive OAuth 연결 skeleton을 구현해라.

구현:
- /api/drive/oauth/start
- /api/drive/oauth/callback
- drive_connections 저장
- read-only Drive scope 사용
- 연결 상태를 /admin/import에서 표시

보안:
- client에 access token/refresh token 노출 금지
- refresh token은 암호화 저장 placeholder 처리
- 실제 암호화 구현이 없으면 TODO와 interface만 만들 것

금지:
- Drive 파일 삭제/수정 권한 요청 금지
- UI에서 직접 Google API 호출 금지
- 전체 Drive를 무작정 스캔하지 말 것

완료 기준:
- OAuth flow 시작 가능
- callback에서 connection row 생성 가능
- /admin/import에서 연결 상태 표시
```

---

# Task 5 — Drive Folder Scanner

## 목표

선택한 Google Drive 폴더에서 이미지 파일 목록을 가져온다.

## 지시문

```text
Drive folder scanner를 구현해라.

구현:
- driveAdapter.listImageFiles(folderId, pageToken?)
- image MIME type 필터
- pagination 처리
- Drive file metadata를 내부 ImportCandidate로 변환
- dry-run preview API
- /admin/import에서 가져올 사진 후보 preview

ImportCandidate 필드:
- driveFileId
- filename
- mimeType
- sizeBytes
- thumbnailLink
- webViewLink
- webContentLink
- width
- height
- takenAtCandidate
- dateSource
- latitude
- longitude

금지:
- 원본 파일 다운로드를 기본 동작으로 하지 마라.
- Drive 폴더 구조 변경 금지.
- 전체 Drive 스캔 금지. 지정 폴더 기준.

완료 기준:
- 작은 Drive 폴더의 이미지 목록 preview 가능
- pagination으로 100개 이상 대응 가능
- 이미지 외 파일은 제외됨
```

---

# Task 6 — Import Job

## 목표

Drive 사진 후보를 photos 테이블에 안전하게 upsert한다.

## 지시문

```text
Drive import job 기능을 구현해라.

구현:
- import_jobs 생성
- import 실행 endpoint
- photos upsert
- 진행률 업데이트
- 실패 item 기록
- 완료/실패 상태 표시
- 같은 folder를 다시 import해도 drive_file_id 기준 중복 생성 방지

정책:
- 원본 이미지는 저장하지 않는다.
- Drive file id와 metadata만 DB에 저장한다.
- thumbnailLink를 우선 사용한다.
- 날짜가 없으면 date_source='unknown', date_precision='unknown'으로 둔다.

완료 기준:
- 100장 이상 import 가능
- 중복 import 안전
- 실패 시 job status에 표시
- import 완료 후 timeline에 표시
```

---

# Task 7 — Timeline Performance

## 목표

사진 수가 늘어도 타임라인이 느려지지 않게 한다.

## 지시문

```text
Timeline 성능을 개선해라.

구현:
- cursor pagination 또는 infinite scroll
- 연도/월별 query
- thumbnail lazy loading
- loading skeleton
- empty state
- error state

금지:
- 모든 사진을 한 번에 불러오지 마라.
- 원본 이미지를 목록에서 불러오지 마라.

완료 기준:
- 1,000장 seed에서도 목록이 정상 작동
- 초기 화면이 빠르게 표시
- 스크롤 시 추가 로딩 가능
```

---

# Task 8 — Reactions and Highlights

## 목표

반응 기능과 홈 하이라이트를 완성한다.

## 지시문

```text
사진 반응 기능을 구현하고 홈 하이라이트에 반영해라.

반응 종류:
- like
- heart
- funny
- miss
- pretty
- see_again

구현:
- 사진 상세 반응 버튼
- reaction count 표시
- reactions table upsert
- photos.reaction_count 동기화
- 홈에서 반응 많은 사진 표시

초기 공동 계정 정책:
- 사용자별 중복 방지보다 count 누적을 우선한다.
- 추후 사용자 계정이 생기면 확장 가능하게 구조만 깔끔히 유지한다.

완료 기준:
- 반응 클릭 시 count 증가
- 홈 하이라이트에 반응 많은 사진 노출
```

---

# Task 9 — Visibility / Cleanup Basic

## 목표

사진 삭제 대신 숨김/제외 상태를 구현한다.

## 지시문

```text
visibility_state와 cleanup 기본 기능을 구현해라.

구현:
- 사진 상세에서 숨김/제외 처리
- cleanup_candidates 목록
- 후보별 accept/reject/resolved
- 제외된 사진 복구
- hidden/excluded 사진은 기본 gallery에서 제외
- cleanup 화면에서 상태별 필터

금지:
- Google Drive 원본 삭제 금지
- DB row hard delete 금지

완료 기준:
- 사진을 제외해도 복구 가능
- 기본 타임라인에서 제외 사진이 사라짐
- 정리함에서 후보 상태 변경 가능
```

---

# Task 10 — Places Basic

## 목표

장소별 사진 보기 1차 버전을 만든다.

## 지시문

```text
GPS 정보가 있는 사진을 장소별로 볼 수 있게 구현해라.

구현:
- places list
- place detail gallery
- photos의 latitude/longitude 기반 장소 후보 생성
- GPS 없는 사진은 unknown_place cleanup candidate 생성
- 민감 위치는 exact 좌표 표시하지 않는 UI 옵션
- 지도 또는 지도 대체 카드 UI

주의:
- 지도 라이브러리 연동이 부담되면 1차는 장소 카드 + 좌표 그룹으로 시작해도 된다.
- 집 주소 등 민감 장소는 기본적으로 approximate display를 사용한다.

완료 기준:
- 장소별 사진 목록 접근 가능
- GPS 없는 사진 정리 후보 표시
```

---

# Task 11 — Events Basic

## 목표

가족여행/생일/명절 같은 이벤트 앨범을 만든다.

## 지시문

```text
이벤트 앨범 기능을 구현해라.

구현:
- events list
- event create/edit
- event detail gallery
- 사진을 event에 추가/제거
- cover photo 지정
- timeline에서 event 연결 표시

금지:
- 댓글/긴 기록 기능으로 확장하지 마라.
- 이벤트는 사진 묶음 중심이다.

완료 기준:
- “유럽여행” 이벤트 생성 가능
- 사진을 이벤트에 묶을 수 있음
- 이벤트 상세에서 사진 보기 가능
```

---

# Task 12 — People Manual Version

## 목표

자동 얼굴인식 전에 사람별 보기 구조를 만든다.

## 지시문

```text
자동 얼굴인식 없이 수동 사람 그룹 기능을 구현해라.

구현:
- person_clusters list
- 사람 생성/이름 수정
- person_photos 연결
- 사진 상세에서 사람 태그 추가/제거
- 사람별 사진 보기
- 사람 대표 사진 지정

금지:
- 얼굴인식 모델 붙이지 마라.
- embedding 저장하지 마라.
- 자동 병합 만들지 마라.

완료 기준:
- “엄마”, “아빠”, “나” 그룹 생성 가능
- 특정 사람 사진만 볼 수 있음
```

---

# Task 13 — Face Recognition Experimental Module

## 목표

얼굴인식을 기존 기능과 분리해서 실험한다.

## 지시문

```text
얼굴인식 실험 모듈을 feature flag로 구현해라.

조건:
- 기본 MVP 기능과 분리
- 실패해도 timeline/detail/places 기능에 영향 없어야 함
- face_detections table 사용
- 자동 결과는 unconfirmed 상태로 저장
- 사용자가 병합/분리/삭제할 수 있어야 함

필수:
- 얼굴 데이터 삭제 기능
- 자동 분류 결과 확정 전 UI 표시
- 같은 사람 후보 병합 UI

금지:
- 얼굴인식 결과를 확정값처럼 바로 반영하지 마라.
- 가족 외부 공유에 얼굴 정보를 포함하지 마라.

완료 기준:
- feature flag off 상태에서 앱 정상
- feature flag on 상태에서 후보 생성 가능
- 사용자가 후보를 승인/거절 가능
```

---

# Task 14 — QA and Safety Review

## 목표

출시 전 사고를 막는다.

## 지시문

```text
전체 앱을 QA하고 위험 동작을 제거해라.

검증 항목:
1. Drive 원본 삭제 API 사용 여부 검색
2. service role key client 노출 여부 확인
3. refresh token client 노출 여부 확인
4. 모든 photo query에 family_id 필터 있는지 확인
5. hidden/excluded 사진이 기본 목록에서 제외되는지 확인
6. import 중복 실행 시 중복 row 생성 안 되는지 확인
7. 1,000장 이상 seed에서 성능 확인
8. 민감 좌표 표시 정책 확인
9. 얼굴인식 feature가 기본 off인지 확인
10. build/test 통과

완료 기준:
- 위험 항목 리스트 작성
- 수정 패치 적용
- 남은 리스크 문서화
```
