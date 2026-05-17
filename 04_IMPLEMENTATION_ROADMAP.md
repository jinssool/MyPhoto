# 구현 로드맵 — 가장 리스크가 낮은 순서

## 전체 전략

이 프로젝트는 한 번에 전체 기능을 구현하면 실패 가능성이 높다.  
가장 안전한 방식은 다음 순서다.

1. Mock 데이터 기반 이미지 중심 UI
2. Supabase DB 연결
3. 사진 인덱싱 구조
4. Google Drive 연동
5. 타임라인/상세/반응 안정화
6. 장소/이벤트 확장
7. 정리함
8. 사람별 보기 수동 구현
9. 얼굴인식/중복정리 고도화

---

# Phase 0. 프로젝트 골격

## 목표

개발 환경과 기본 구조를 만든다.

## 구현

- React/TypeScript 프로젝트 생성
- Supabase client 설정
- 라우팅 구조 생성
- 기본 레이아웃
- `.env.example`
- README
- AGENTS.md

## 완료 기준

- 로컬 실행 가능
- 홈/타임라인/사진상세/장소/사람/정리함 라우트 접속 가능
- mock data로 최소 화면 표시

---

# Phase 1. Mock Gallery UI

## 목표

Drive 연동 전에 제품 감각을 검증한다.

## 구현

- mockPhotos.ts 작성
- 홈 화면
- 타임라인 화면
- 사진 상세 모달 또는 페이지
- 반응 버튼 UI
- 숨김/제외 버튼 UI
- 이미지 grid
- 연도/월 필터

## 완료 기준

- 사진이 크게 보인다.
- 연도/월별로 탐색 가능하다.
- 부모님 세대가 봐도 메뉴가 복잡하지 않다.
- 파일명 중심 UI가 아니다.

## Codex 지시 포인트

- 실제 Google Drive API 붙이지 말 것
- DB 붙이지 말 것
- UI와 UX 감각만 먼저 완성
- 컴포넌트 재사용 가능하게 분리

---

# Phase 2. Supabase DB Schema + Seed

## 목표

실제 데이터 구조를 만든다.

## 구현

- migrations 작성
- seed data 작성
- photo query layer 작성
- mock data를 DB seed로 이전
- timeline query 구현
- reaction mutation 구현
- visibility mutation 구현

## 완료 기준

- DB에서 사진 목록을 불러온다.
- 연도/월별 쿼리가 된다.
- 반응 count가 증가한다.
- 숨김/제외 상태가 반영된다.

## Codex 지시 포인트

- SQL migration을 명확히 작성
- 임의로 복잡한 auth 구현하지 말 것
- service role key client 노출 금지
- 모든 query는 family_id 기준 필터 포함

---

# Phase 3. Google Drive Adapter

## 목표

Drive API를 직접 UI에 섞지 않고 adapter로 분리한다.

## 구현

- Google OAuth start/callback endpoint
- drive_connections table 저장
- Drive file list fetch 함수
- image file만 필터링
- pagination 처리
- Drive file metadata를 내부 PhotoImportItem으로 변환

## 완료 기준

- 특정 Drive folder의 이미지 파일 목록을 가져올 수 있다.
- 가져온 결과를 화면 또는 로그에서 확인할 수 있다.
- token이 client에 노출되지 않는다.
- 원본 Drive 파일은 변경하지 않는다.

## Codex 지시 포인트

- Drive 삭제/수정 scope 요청 금지
- 가능하면 read-only scope 사용
- UI 코드에서 Drive API 직접 호출 금지
- adapter 함수에 테스트 가능한 mock 구현 포함

---

# Phase 4. Import Job

## 목표

Drive 사진을 DB에 안전하게 인덱싱한다.

## 구현

- import_jobs 생성
- import_job_items 또는 내부 진행 상태
- Drive folder scan
- photos upsert
- 중복 drive_file_id 방지
- import 진행률 표시
- 실패 item 기록
- 재시도 가능 구조

## 완료 기준

- Drive folder에서 사진 100장 이상 인덱싱 가능
- 중복 실행해도 같은 사진이 중복 생성되지 않음
- 실패해도 job 상태에 기록됨
- 완료 후 타임라인에 표시됨

## Codex 지시 포인트

- 긴 작업을 단일 synchronous UI request로 막지 말 것
- 최소한 job status polling 구조 만들 것
- 원본 이미지를 서버에 저장하지 말 것

---

# Phase 5. Timeline / Detail 안정화

## 목표

MVP의 핵심 탐색 경험을 완성한다.

## 구현

- 연도별/월별 timeline
- infinite scroll 또는 pagination
- photo detail
- previous/next navigation
- reaction
- download/open original
- visibility state update
- 대표 사진 후보

## 완료 기준

- 1,000장 이상의 사진에서도 화면이 무너지지 않는다.
- 상세 보기에서 이전/다음 이동 가능
- 반응이 저장되고 홈 하이라이트에 반영
- 숨김 사진은 기본 목록에서 제외

---

# Phase 6. Places / Map 1차

## 목표

장소별 추억 탐색을 만든다.

## 구현

- latitude/longitude 있는 사진 places로 그룹
- places page
- place detail page
- map marker 또는 장소 카드
- 민감 위치 표시 정책
- GPS 없는 사진은 장소 미정 후보로 분류

## 완료 기준

- GPS 있는 사진이 장소별로 묶인다.
- 장소 클릭 시 사진 목록 표시
- exact 좌표 대신 display name 사용 가능
- GPS 없는 사진이 정리함에 표시

## Codex 지시 포인트

- 지도 라이브러리는 한 가지로 제한
- 장소 병합 AI는 아직 만들지 말 것
- 민감 위치 exact 표시 기본값 금지

---

# Phase 7. Events / Albums 1차

## 목표

가족여행, 생일, 명절 같은 이벤트 단위 앨범을 만든다.

## 구현

- events CRUD
- event_photos 연결
- event cover photo
- event detail gallery
- timeline에서 event badge 표시

## 완료 기준

- “유럽여행” 같은 이벤트 생성 가능
- 사진을 이벤트에 추가 가능
- 이벤트별 대표 사진 표시

---

# Phase 8. Cleanup 1차

## 목표

사진 정리 경험을 제공한다.

## 구현

- cleanup_candidates
- 스크린샷 후보
- 문서 후보
- 흐림 후보 placeholder
- 중복 후보 placeholder
- unknown date/place/person 후보
- 포함/제외/숨김/해결 처리

## 완료 기준

- 후보 사진을 정리함에서 볼 수 있다.
- 사용자가 제외해도 원본 Drive 파일은 삭제되지 않는다.
- 잘못 제외한 사진을 복구 가능하다.

## Codex 지시 포인트

- 자동 삭제 절대 금지
- AI 분류 정확도에 의존하지 말 것
- 후보 판단 이유를 UI에 표시

---

# Phase 9. People 수동 버전

## 목표

자동 얼굴인식 없이 사람별 보기 제품 구조를 먼저 만든다.

## 구현

- person_clusters
- person_photos
- 사람 목록
- 사람 이름 수정
- 사진을 사람 그룹에 수동 추가/제거
- 사람별 사진 보기

## 완료 기준

- “엄마”, “아빠”, “나” 같은 그룹 생성 가능
- 특정 사람 사진만 볼 수 있음
- 자동 얼굴인식 없이도 UI 구조 검증 가능

---

# Phase 10. Face Recognition 실험 모듈

## 목표

얼굴인식을 제품 핵심 경로와 분리해 실험한다.

## 구현

- 별도 branch 또는 feature flag
- face_detections
- embedding 생성 모듈
- 같은 사람 후보
- 병합/분리 UI
- face data 삭제 기능

## 완료 기준

- 기존 MVP 기능을 깨지 않는다.
- 얼굴인식 실패 시에도 타임라인/장소/상세 기능 정상 동작
- 사용자가 자동 분류 결과를 수정 가능

---

## 최종 추천 MVP 컷

현실적으로 첫 출시/가족 내부 사용 버전은 Phase 0~6까지면 충분하다.

### 내부 MVP

- Home
- Timeline
- Photo Detail
- Drive Import
- Reaction
- Visibility
- Basic Places

### 1차 확장

- Events
- Cleanup
- Manual People

### 2차 확장

- Duplicate Detection
- Face Recognition
- Map 고도화
