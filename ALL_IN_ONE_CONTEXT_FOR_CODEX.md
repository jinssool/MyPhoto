<!-- FILE: 00_CODEX_CONTEXT.md -->


# 가족사진 이미지 중심 추억 앨범 웹서비스 — Codex 전체 구현 문맥파일

## 0. 이 문서의 목적

이 문서는 코딩 에이전트가 서비스의 의도, 제품 경계, 구현 우선순위, 금지사항을 잃지 않고 구현하도록 전달하는 최상위 문맥 파일이다.

이 서비스는 **새로운 클라우드 스토리지**가 아니다.  
Google Drive를 원본 사진 저장소로 사용하고, 웹서비스는 가족사진을 **시간·장소·사람·이벤트 기준으로 쉽게 탐색하는 이미지 중심 가족 앨범 UI**를 제공한다.

---

## 1. 제품 한 줄 정의

Google Drive에 저장된 가족사진을 인덱싱해서, 중장년층도 쉽게 시간·장소·사람·이벤트 기준으로 추억을 다시 볼 수 있게 하는 가족 전용 이미지 중심 웹 앨범.

---

## 2. 핵심 사용자

### 2.1 가족 대표 관리자

- Google Drive 연결
- 사진 폴더 선택
- 사진 인덱싱 실행
- 제외 후보 확인
- 대표 앨범 관리
- 복구함/숨김 사진 관리

### 2.2 일반 가족 사용자

초기에는 별도 계정을 만들지 않는다. 가족이 하나의 공유 계정으로 사용한다.

- 사진 보기
- 연도/월/이벤트별 탐색
- 장소/지도 탐색
- 사람별 탐색
- 반응 남기기
- 다운로드/공유
- 미분류 사진 간단 정리

---

## 3. 제품 원칙

### 3.1 이미지 중심

파일명, 폴더명, Drive 구조를 전면에 드러내지 않는다.  
사용자는 “파일을 관리한다”가 아니라 “사진을 본다”는 느낌을 받아야 한다.

### 3.2 부모님도 쓸 수 있는 단순함

- 메뉴는 적게
- 글자는 크게
- 사진은 크게
- 주요 행동은 1~2번 클릭 안에
- 로그인/권한/설정 화면은 최소화

### 3.3 자동 정리, 단 최종 삭제는 금지

서비스는 사진을 자동 분류하고 추천할 수 있다.  
하지만 원본 Drive 파일을 자동 삭제해서는 안 된다.

허용:
- 숨김 처리
- 제외 후보 처리
- 중복 그룹화
- 대표 사진 추천
- 복구 가능한 휴지통 상태

금지:
- Google Drive 원본 자동 삭제
- 사용자 확인 없는 대량 제외
- 원본 파일명/폴더 구조 임의 변경

### 3.4 초기에는 가족 공동 계정

초기 MVP에서는 다음을 구현하지 않는다.

- 가족 구성원별 계정
- 친척 초대
- 앨범별 권한
- 복잡한 ACL
- 댓글/음성 메모
- 유료 결제
- 공개 커뮤니티

---

## 4. 초기 MVP 목표

MVP의 목표는 “사진을 보기 좋게 탐색할 수 있다”를 증명하는 것이다.

### 반드시 구현할 것

1. Google Drive 폴더 연결 또는 Drive 파일 목록 가져오기
2. 사진 메타데이터 DB 인덱싱
3. 썸네일 중심 갤러리
4. 연도/월 기준 타임라인
5. 사진 상세 보기
6. 다운로드/원본 열기
7. 반응 기능
8. 제외 후보/숨김 처리
9. 지도/장소 보기의 1차 버전
10. 사람별 보기의 데이터 구조와 UI 껍데기

### MVP에서 미루는 것

1. 고도화된 자동 얼굴인식
2. 완전한 중복/유사도 AI 정리
3. 댓글/음성 메모
4. 구성원별 권한
5. 포토북 주문
6. 오래된 종이사진 복원
7. 자동 영상 생성
8. 모바일 앱

---

## 5. 권장 기술 스택

### Frontend

- React 기반 웹 앱
- TypeScript
- Next.js 또는 Vite + React 중 선택 가능
- 단, Google OAuth callback, 서버 API route, Vercel 배포를 고려하면 Next.js가 더 안정적이다.

### Backend / DB

- Supabase Postgres
- Supabase Auth는 초기에는 관리자 로그인 또는 단일 가족 계정 용도로만 단순 사용
- Supabase Storage는 원본 저장소가 아니라, 필요 시 생성 썸네일/캐시/파생 이미지 저장용으로만 사용

### External API

- Google Drive API
- Google OAuth
- Google Drive file ID 기반 원본 참조
- Google Drive thumbnailLink 또는 webContentLink 활용

### Optional

- Map: Mapbox, Google Maps, Kakao Maps 중 하나
- 얼굴인식: 나중에 독립 worker 또는 별도 Python service로 분리
- 이미지 품질/중복: perceptual hash, blur score 등은 단계적으로 도입

---

## 6. 데이터 처리 기본 구조

### Google Drive

- 원본 사진 저장
- 대용량 파일 보관
- 사용자의 기존 사진 저장 습관 유지

### Supabase DB

- Drive file ID
- 파일명
- MIME type
- 촬영일
- 날짜 정확도
- 위치정보
- 썸네일 URL
- 품질 점수
- 중복 그룹
- 사람 그룹
- 장소 그룹
- 이벤트/앨범
- 반응 수
- 숨김/제외 상태

### Web UI

- 홈
- 타임라인
- 지도
- 사람
- 이벤트
- 정리함
- 사진 상세

---

## 7. 핵심 화면

### 7.1 홈

역할:
- 가족이 들어왔을 때 바로 사진을 보고 싶게 만드는 화면

구성:
- 오늘의 추억
- 최근 추가된 사진
- 많이 반응한 사진
- 연도별 대표 앨범
- 여행/이벤트 대표 앨범
- 정리할 사진 알림

### 7.2 타임라인

역할:
- 촬영일 기준으로 사진을 자연스럽게 훑어보는 화면

구성:
- 연도 필터
- 월별 섹션
- 대형 대표 사진
- 작은 썸네일 그리드
- 시기 미정 섹션

### 7.3 지도

역할:
- 가족여행과 장소 기억을 지도 위에서 보는 화면

구성:
- 지도 위 클러스터
- 국가/도시/장소별 사진 수
- 장소 클릭 시 사진 그리드
- 민감 장소는 정확 좌표 대신 별칭/대략 위치 사용

### 7.4 사람

역할:
- 특정 가족 구성원이 나온 사진을 보는 화면

초기 구현:
- 사람 그룹 데이터 구조
- 사람 카드 UI
- 수동 이름 설정
- 특정 사람 사진 목록

나중 구현:
- 자동 얼굴 클러스터링
- 같은 사람 후보 병합
- 잘못 묶인 사진 분리

### 7.5 정리함

역할:
- 중복, 흐림, 캡처, 문서 사진 후보를 사용자가 쉽게 처리하는 화면

구성:
- 흐린 사진 후보
- 스크린샷/문서 후보
- 중복 후보
- 시기 미정 사진
- 장소 미정 사진
- 사람 미정 사진

---

## 8. 구현상 가장 중요한 금지사항

Codex는 다음을 하면 안 된다.

1. Google Drive 원본 파일을 삭제하지 않는다.
2. Google Drive 폴더 구조를 변경하지 않는다.
3. 사용자의 확인 없이 사진을 영구 제외하지 않는다.
4. 얼굴인식 기능을 핵심 경로에 강제로 연결하지 않는다.
5. 모든 사진 원본을 서버에 저장하지 않는다.
6. 한 번에 10,000장을 모두 렌더링하지 않는다.
7. 지도에 집 주소 같은 민감 좌표를 정확히 노출하지 않는다.
8. 댓글/음성메모/권한관리 등 비초기 기능을 먼저 만들지 않는다.
9. UI보다 설정 기능을 먼저 복잡하게 만들지 않는다.
10. 구현 중 임의로 제품 방향을 커뮤니티/SNS로 바꾸지 않는다.

---

## 9. 구현 우선순위

### 1순위

- 사진 인덱스 DB
- 썸네일 갤러리
- 타임라인
- 상세 보기
- Drive 연동
- 반응
- 숨김/제외 상태

### 2순위

- 장소/지도
- 시기 미정 보정
- 이벤트 앨범
- 중복 후보
- 흐림 후보
- 스크린샷 후보

### 3순위

- 사람별 보기
- 수동 사람 그룹
- 얼굴 클러스터링 모듈
- 장소 병합
- 대표 사진 추천 고도화

---

## 10. 가장 안전한 개발 방식

1. Mock 데이터로 UI 먼저 구현
2. Supabase 스키마와 seed 데이터 연결
3. Drive API를 adapter로 분리
4. 실제 Google Drive 연동은 작은 폴더로 검증
5. import job 구조로 비동기 처리
6. 썸네일/원본 로딩은 lazy loading
7. 삭제 대신 visibility_state 변경
8. 얼굴인식/중복정리는 feature flag로 분리
9. 각 단계마다 acceptance criteria를 통과한 뒤 다음 단계 진행
10. Codex에게 한 번에 큰 기능을 시키지 말고 작은 단위로 나누기

---

## 11. 최종 제품 감각

이 서비스는 “사진 저장소”가 아니다.  
부모님이 웹사이트에 들어왔을 때 다음 경험을 해야 한다.

- “사진이 크고 보기 좋다.”
- “옛날 사진이 연도별로 정리돼 있다.”
- “유럽여행 사진을 바로 찾을 수 있다.”
- “엄마/아빠/나 사진만 볼 수 있다.”
- “지도에서 우리가 다녀온 곳을 볼 수 있다.”
- “마음에 드는 사진을 바로 저장하거나 공유할 수 있다.”
- “복잡한 설정 없이 그냥 볼 수 있다.”

이 감각을 해치는 기능은 MVP에서 제외한다.


<!-- FILE: 01_PRODUCT_REQUIREMENTS.md -->


# PRD — 가족사진 이미지 중심 추억 앨범 웹서비스

## 1. 제품명 후보

- 기억서랍
- 그때우리
- 패밀로그
- 우리집 앨범
- 시간앨범
- 가족사진관
- Family Memory Gallery

초기 개발 코드명: `family-memory-gallery`

---

## 2. 문제

가족사진은 많이 저장되어 있지만, 실제로 다시 보기 어렵다.

### 기존 방식의 문제

- Google Drive: 저장은 좋지만 감성적인 사진 탐색이 약하다.
- Band: 커뮤니티용으로는 좋지만 오래된 사진 아카이브 탐색이 어렵다.
- KakaoTalk: 공유는 쉽지만 장기 보관/정리에 부적합하다.
- 휴대폰 갤러리: 개인 기기 중심이라 가족 공동 앨범으로 보기 어렵다.
- 외장디스크/오래된 컴퓨터: 접근성이 낮고 검색이 어렵다.

---

## 3. 목표

중장년층도 쉽게 쓸 수 있는 가족 전용 이미지 중심 앨범을 만든다.

### 정량적 성공 기준 초안

MVP 내부 테스트 기준:

- 부모님 세대 사용자가 도움 없이 홈 → 연도별 사진 보기까지 1분 이내 가능
- 특정 여행/연도 사진을 3번 이하의 클릭으로 접근 가능
- 5,000장 사진 기준 최초 갤러리 화면 3초 이내 표시
- 사진 상세 화면 진입 1초 내 체감 로딩
- 잘못 제외된 사진은 복구 가능
- 원본 Drive 파일 삭제 사고 0건

---

## 4. 범위

### In Scope — MVP

- 가족 공동 계정
- Google Drive 폴더 연결
- 사진 메타데이터 인덱싱
- 썸네일 갤러리
- 연도/월 타임라인
- 사진 상세 보기
- 반응
- 다운로드/원본 열기
- 숨김/제외 후보 관리
- 장소 보기 1차
- 사람 보기 UI 및 수동 그룹 구조
- 이벤트 앨범 1차

### Out of Scope — 초기 제외

- 구성원별 계정
- 친척 초대
- 앨범별 권한
- 댓글
- 음성 메모
- 결제
- 포토북 주문
- 모바일 앱
- 자동 영상 생성
- 원본 대량 서버 저장
- Drive 원본 삭제

---

## 5. 사용자 시나리오

### 시나리오 A — 부모님이 옛날 가족사진 보기

1. 가족 앨범 웹사이트 접속
2. 홈에서 “2000년대” 또는 “옛날 사진” 클릭
3. 연도별 사진을 크게 봄
4. 마음에 드는 사진 클릭
5. 저장 또는 가족 카톡으로 공유

### 시나리오 B — 유럽여행 사진 찾기

1. 홈 또는 검색에서 “유럽여행” 클릭
2. 이벤트 앨범 진입
3. 장소/날짜별로 사진 확인
4. 대표 사진 저장

### 시나리오 C — 엄마 사진만 보기

1. 사람 메뉴 진입
2. “엄마” 카드 클릭
3. 엄마가 나온 사진만 시간순으로 보기

### 시나리오 D — 사진 정리

1. 관리자가 정리함 진입
2. 흐린 사진/중복 후보 확인
3. 제외/포함/대표 사진 선택
4. 원본은 삭제하지 않고 서비스 표시 상태만 변경

---

## 6. 화면별 요구사항

## 6.1 홈

### 기능

- 오늘의 추억
- 최근 추가된 사진
- 인기 반응 사진
- 연도별 대표 앨범
- 이벤트 대표 앨범
- 정리 필요 알림

### UX 원칙

- 첫 화면부터 사진이 보여야 한다.
- 파일명보다 이미지가 중심이어야 한다.
- 텍스트는 짧고 버튼은 커야 한다.

---

## 6.2 타임라인

### 기능

- 연도별 그룹
- 월별 그룹
- 시기 미정 그룹
- 대표 사진 자동 선택
- 무한 스크롤 또는 페이지네이션

### 정렬 우선순위

1. EXIF 촬영일
2. Drive imageMediaMetadata time
3. 파일명 날짜 패턴
4. Drive createdTime
5. 사용자 입력 대략 시기
6. unknown

---

## 6.3 사진 상세

### 기능

- 큰 이미지 보기
- 좌우 이동
- 촬영일 표시
- 장소 표시
- 사람 표시
- 반응
- 다운로드
- 원본 Drive 열기
- 숨김 처리
- 대표 사진 지정

---

## 6.4 장소/지도

### 기능

- 장소별 사진 묶음
- 지도 클러스터
- GPS 없는 사진 장소 입력
- 민감 장소 별칭 처리
- 장소 병합 후보

### 민감 장소 정책

- 집 주소는 정확 좌표를 노출하지 않는다.
- “우리집”, “예전 집”, “외갓집” 같은 별칭 사용 가능
- 기본 지도 표시에는 좌표를 둔감화한다.

---

## 6.5 사람

### MVP 기능

- 사람 그룹 목록
- 사람 그룹 이름 설정
- 사람별 사진 목록
- 수동 사진 추가/제거 구조

### Post-MVP 기능

- 얼굴 자동 감지
- 얼굴 클러스터링
- 같은 사람 후보 병합
- 오분류 분리

---

## 6.6 정리함

### 기능

- 흐림 후보
- 중복 후보
- 스크린샷/문서 후보
- 시기 미정 사진
- 장소 미정 사진
- 사람 미정 사진

### 정책

- 자동 삭제 금지
- 사용자가 확인 후 상태 변경
- 언제든 복구 가능

---

## 7. 반응 기능

초기에는 댓글을 만들지 않는다.

### 반응 종류

- 좋아요
- 하트
- 웃김
- 그리움
- 예쁨
- 다시 보고 싶음

### 데이터 원칙

가족 공동 계정이므로 “누가 눌렀는지”는 초기에는 중요하지 않다.  
MVP에서는 반응 카운트 중심으로 구현한다.

---

## 8. 비기능 요구사항

### 성능

- 5,000장 이상 대응
- 목록은 썸네일만 로드
- 상세에서만 큰 이미지 로드
- 무한 스크롤/가상화 적용
- 연도/월 단위 쿼리 최적화

### 안정성

- Drive 원본 삭제 금지
- import job 재시도 가능
- 중간 실패 시 재개 가능
- DB 상태와 Drive 상태 불일치 처리

### 보안/프라이버시

- Google OAuth token은 서버에서 안전하게 관리
- client에 refresh token 노출 금지
- 민감 좌표 둔감화
- 얼굴 데이터 삭제 가능 구조
- 외부 공유 링크는 초기에는 제한적 구현

### 접근성

- 큰 글씨
- 명확한 버튼
- 고대비
- 키보드 기본 접근 가능
- 모바일에서도 깨지지 않는 반응형

---

## 9. MVP 완료 기준

- 실제 또는 mock Google Drive 사진 500장 이상을 인덱싱할 수 있다.
- 홈/타임라인/상세 화면에서 사진을 볼 수 있다.
- 연도/월별 탐색이 가능하다.
- 반응을 남길 수 있다.
- 사진을 숨김/제외 처리할 수 있다.
- 사진 원본은 삭제되지 않는다.
- Drive 연동 실패 시 오류 메시지가 명확하다.
- Codex가 임의로 scope creep 기능을 추가하지 않았다.


<!-- FILE: 02_ARCHITECTURE.md -->


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


<!-- FILE: 03_DATABASE_SCHEMA.md -->


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


<!-- FILE: 04_IMPLEMENTATION_ROADMAP.md -->


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


<!-- FILE: 05_CODEX_TASKS.md -->


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


<!-- FILE: 06_AGENTS.md -->


# AGENTS.md — Coding Agent Rules

## Role

You are implementing a family photo memory album web service.

This is not a storage product.  
Google Drive is the original storage.  
The web app is an image-centered browsing and memory UI.

---

## Product Priorities

1. Beautiful photo browsing
2. Timeline by taken date
3. Place/map exploration
4. People-based exploration
5. Easy reactions
6. Easy download/share
7. Safe cleanup without deleting originals

---

## Non-Goals for MVP

Do not implement:

- Complex multi-user permission system
- Comments
- Voice memos
- Payment
- Public social feed
- Photobook order
- Mobile native app
- Automatic Drive deletion
- Original image bulk storage
- Face recognition as a required core path

---

## Safety Rules

Never delete or modify original Google Drive files.

Allowed:
- Store drive_file_id
- Store metadata
- Store thumbnail URL
- Change app-level visibility state
- Mark as hidden/excluded/trash_candidate

Not allowed:
- Delete Drive file
- Rename Drive file
- Move Drive file
- Change Drive folder structure
- Download and store all originals by default

---

## Engineering Rules

- Use TypeScript.
- Keep domain logic out of UI components.
- Use adapter pattern for Google Drive.
- Use query/mutation modules for Supabase access.
- Every photo query must filter by family_id.
- Do not expose server secrets to client.
- Use pagination for photo lists.
- Use thumbnails in grids.
- Load full image only in detail view.
- Provide empty/error/loading states.
- Keep UI simple and image-centered.

---

## Data Rules

Every important entity should include family_id.

Photo uniqueness:
- family_id + drive_file_id

Photo visibility:
- active
- hidden
- excluded
- trash_candidate

No hard delete in normal UI.

---

## UI Rules

- Large images
- Large buttons
- Minimal menu depth
- Avoid file-manager feeling
- Avoid technical metadata unless secondary
- Parents should be able to understand the main actions

Primary navigation:
- Home
- Timeline
- Places
- People
- Events
- Cleanup
- Import

---

## Implementation Strategy

Build in this order:

1. Mock UI
2. Supabase schema
3. DB query layer
4. Google Drive OAuth
5. Drive folder scanner
6. Import job
7. Timeline performance
8. Reactions
9. Cleanup
10. Places
11. Events
12. Manual people
13. Experimental face recognition

Do not skip directly to face recognition.

---

## Acceptance Standard

A feature is complete only when:

- It builds
- It has loading/error/empty states
- It does not expose secrets
- It respects family_id
- It does not delete originals
- It does not add out-of-scope social features
- It keeps the product image-centered


<!-- FILE: 07_RISK_REGISTER.md -->


# 리스크 관리표

## 1. 제품 리스크

| 리스크 | 심각도 | 설명 | 대응 |
|---|---:|---|---|
| 기능이 너무 많아짐 | 높음 | 얼굴인식, 지도, 중복정리, 이벤트까지 한 번에 구현하면 MVP가 늦어짐 | Phase 분리, feature flag |
| 부모님 사용성이 낮음 | 높음 | 메뉴/설정/권한이 복잡하면 사용 안 함 | 홈/타임라인/상세 중심 |
| 사진 저장소처럼 보임 | 중간 | Drive와 차별성이 약해짐 | 파일명/폴더보다 이미지 탐색 강조 |
| 댓글/SNS화 | 중간 | 제품 핵심이 흐려짐 | 반응만 초기 제공 |

---

## 2. 기술 리스크

| 리스크 | 심각도 | 설명 | 대응 |
|---|---:|---|---|
| Google Drive API quota | 높음 | 대량 사진 스캔 시 제한 가능 | pagination, incremental sync, 작은 폴더부터 |
| 썸네일 만료/접근 실패 | 중간 | Drive thumbnailLink가 항상 안정적이지 않을 수 있음 | fallback, 원본 열기, 필요 시 캐시 |
| 10,000장 성능 문제 | 높음 | 한 번에 로드하면 느림 | pagination, lazy loading, indexes |
| EXIF 날짜 누락 | 높음 | 오래된 사진/스캔 사진은 날짜가 없음 | date_precision, unknown bucket, 수동 보정 |
| GPS 누락 | 중간 | 장소 탐색 불완전 | 장소 미정 후보, 수동 입력 |
| 얼굴인식 정확도 | 높음 | 어린 시절/노화/유사 얼굴 문제 | 자동 확정 금지, 후보 승인 방식 |
| 중복 탐지 오탐 | 중간 | 비슷하지만 의미 다른 사진 제외 위험 | 후보만 제안, 자동 삭제 금지 |

---

## 3. 보안/프라이버시 리스크

| 리스크 | 심각도 | 설명 | 대응 |
|---|---:|---|---|
| Google token 노출 | 매우 높음 | Drive 접근권 유출 | server-only 저장, client 노출 금지 |
| service role key 노출 | 매우 높음 | DB 전체 위험 | env 분리, client bundle 검사 |
| 집 주소 노출 | 높음 | GPS로 집 위치 노출 가능 | location_precision, sensitive place |
| 얼굴 데이터 민감성 | 높음 | 얼굴 embedding은 민감 데이터 | feature flag, 삭제 기능, 외부 공유 제외 |
| 공유 링크 확산 | 중간 | 가족사진 외부 노출 | 초기 공유 제한, 만료 링크 검토 |

---

## 4. 운영 리스크

| 리스크 | 심각도 | 설명 | 대응 |
|---|---:|---|---|
| Drive 파일 이동/삭제로 링크 깨짐 | 중간 | 사용자가 Drive에서 파일 변경 | sync status, missing 표시 |
| import 중단 | 중간 | 대량 처리 중 실패 | import_jobs, 재시도 |
| 가족 계정 공유 보안 | 중간 | 링크/비밀번호 공유 위험 | 내부 MVP 한정, 추후 개별 계정 |
| 비용 증가 | 중간 | 썸네일 캐시/AI 처리 비용 | 원본 미저장, AI 후순위 |

---

## 5. 가장 위험한 구현 실수 TOP 10

1. Google Drive 원본 삭제 기능을 넣는 것
2. client에 Google refresh token을 노출하는 것
3. service role key를 브라우저 번들에 넣는 것
4. 모든 사진을 한 번에 렌더링하는 것
5. 원본 이미지를 목록에서 불러오는 것
6. 얼굴인식을 핵심 경로에 강제하는 것
7. 중복 사진을 자동 삭제하는 것
8. 날짜 없는 사진을 Drive 업로드일로 확정해버리는 것
9. 집 주소 좌표를 지도에 그대로 표시하는 것
10. 댓글/권한/초대 기능을 먼저 만들어 MVP를 흐리는 것

---

## 6. 리스크가 가장 낮은 MVP 컷

최초 내부 사용 버전은 다음만 포함한다.

- Drive 폴더 연결
- 사진 인덱싱
- 홈
- 타임라인
- 사진 상세
- 반응
- 숨김/제외
- 장소 카드 또는 간단 지도

사람별 보기와 얼굴인식은 데이터 구조만 먼저 만들고, 실제 자동화는 다음 버전에서 실험한다.


<!-- FILE: 08_ACCEPTANCE_CRITERIA.md -->


# MVP Acceptance Criteria

## 1. 제품 기준

MVP는 다음 질문에 “예”라고 답할 수 있어야 한다.

1. 가족사진이 파일이 아니라 사진 중심으로 보이는가?
2. 연도/월별로 쉽게 탐색할 수 있는가?
3. 원하는 사진을 크게 볼 수 있는가?
4. 부모님이 주요 버튼을 이해할 수 있는가?
5. Google Drive 원본은 안전하게 유지되는가?
6. 반응/저장/공유 행동이 쉬운가?
7. 숨김/제외한 사진을 복구할 수 있는가?
8. 대량 사진에서도 목록이 멈추지 않는가?

---

## 2. 기능별 완료 기준

### 2.1 Drive Import

- [ ] Google Drive 연결 가능
- [ ] 지정 폴더 기준 이미지 파일 조회 가능
- [ ] 이미지 외 파일 제외
- [ ] import job 생성
- [ ] photos table upsert
- [ ] 중복 import 방지
- [ ] 실패 상태 표시
- [ ] 원본 파일 삭제/수정 없음

### 2.2 Home

- [ ] 오늘의 추억 표시
- [ ] 최근 추가 사진 표시
- [ ] 반응 많은 사진 표시
- [ ] 연도별 대표 앨범 표시
- [ ] 정리 필요 알림 표시

### 2.3 Timeline

- [ ] 연도별 탐색
- [ ] 월별 탐색
- [ ] 시기 미정 표시
- [ ] pagination 또는 infinite scroll
- [ ] hidden/excluded 사진 제외
- [ ] 썸네일 lazy loading

### 2.4 Photo Detail

- [ ] 큰 이미지 표시
- [ ] 촬영일 표시
- [ ] 장소 표시
- [ ] 사람 태그 표시
- [ ] 이전/다음 이동
- [ ] 반응 가능
- [ ] 다운로드/원본 열기 가능
- [ ] 숨김/제외 가능

### 2.5 Reactions

- [ ] 반응 종류 표시
- [ ] count 증가
- [ ] 사진 상세에 반영
- [ ] 홈 하이라이트에 반영

### 2.6 Cleanup

- [ ] 정리 후보 목록 표시
- [ ] 후보 이유 표시
- [ ] 포함/제외/숨김 가능
- [ ] 복구 가능
- [ ] 원본 삭제 없음

### 2.7 Places

- [ ] GPS 있는 사진 장소 그룹 표시
- [ ] 장소별 사진 목록 표시
- [ ] GPS 없는 사진 후보 표시
- [ ] 민감 장소 정확 좌표 숨김 가능

### 2.8 People

MVP 최소 기준:

- [ ] 사람 그룹 목록 UI 존재
- [ ] 사람 이름 수정 가능
- [ ] 사진을 사람 그룹에 수동 연결 가능
- [ ] 사람별 사진 보기 가능

자동 얼굴인식은 MVP 필수 아님.

---

## 3. 성능 기준

초기 내부 MVP 기준:

- [ ] 1,000장 seed data에서 timeline이 정상 작동
- [ ] 목록 화면에서 원본 이미지 로드하지 않음
- [ ] 첫 화면 로딩 체감 3초 이내 목표
- [ ] 상세 사진 전환 시 skeleton 또는 loading 상태 표시
- [ ] DB query에 필요한 index 존재

---

## 4. 보안 기준

- [ ] service role key client 노출 없음
- [ ] Google refresh token client 노출 없음
- [ ] Drive API scope는 최소 권한
- [ ] Drive 삭제/수정 scope 없음
- [ ] 모든 photo query에 family_id 조건 포함
- [ ] 공유 링크는 초기 제한 또는 비활성
- [ ] 얼굴인식 feature는 기본 off

---

## 5. 출시 전 수동 QA

### 부모님 사용성 체크

- [ ] 홈에서 사진을 바로 볼 수 있는가?
- [ ] 글자가 너무 작지 않은가?
- [ ] 버튼 의미가 명확한가?
- [ ] 연도별 사진 찾기가 쉬운가?
- [ ] 사진 저장/공유가 쉬운가?
- [ ] 메뉴가 너무 많지 않은가?

### 사고 방지 체크

- [ ] Drive 원본이 삭제되지 않았는가?
- [ ] 제외 사진 복구가 되는가?
- [ ] import 중복 실행해도 중복 생성되지 않는가?
- [ ] 날짜 없는 사진이 이상한 위치에 섞이지 않는가?
- [ ] 민감 장소가 정확히 노출되지 않는가?


<!-- FILE: 10_REVIEW_CHECKLIST.md -->


# Codex 구현물 리뷰 체크리스트

## 1. 제품 방향 리뷰

- [ ] 사진이 파일보다 먼저 보이는가?
- [ ] 홈에서 바로 추억을 볼 수 있는가?
- [ ] 메뉴가 너무 많지 않은가?
- [ ] 부모님이 이해하기 어려운 용어가 많은가?
- [ ] 댓글/SNS/권한관리로 제품 방향이 새고 있지 않은가?
- [ ] Google Drive와 차별되는 “이미지 중심 탐색”이 보이는가?

---

## 2. 코드 구조 리뷰

- [ ] Drive API가 adapter로 분리되어 있는가?
- [ ] UI 컴포넌트에 API/SQL 로직이 과하게 섞이지 않았는가?
- [ ] Supabase query layer가 도메인별로 정리되어 있는가?
- [ ] TypeScript 타입이 정의되어 있는가?
- [ ] 환경변수와 secret이 분리되어 있는가?
- [ ] build가 통과하는가?

---

## 3. DB 리뷰

- [ ] photos에 family_id가 있는가?
- [ ] photos에 unique(family_id, drive_file_id)가 있는가?
- [ ] visibility_state가 hard delete를 대체하는가?
- [ ] taken_at, visibility_state index가 있는가?
- [ ] date_precision이 있어서 대략 날짜를 표현할 수 있는가?
- [ ] location_precision이 있어서 민감 위치를 숨길 수 있는가?

---

## 4. Drive 연동 리뷰

- [ ] read-only scope인가?
- [ ] 삭제/수정 scope를 요청하지 않는가?
- [ ] refresh token이 client에 노출되지 않는가?
- [ ] Drive folder를 지정해서 스캔하는가?
- [ ] 전체 Drive를 무작정 스캔하지 않는가?
- [ ] pagination이 있는가?
- [ ] import 중복 실행 시 중복 row가 생기지 않는가?

---

## 5. 성능 리뷰

- [ ] 목록에서 원본 이미지를 불러오지 않는가?
- [ ] 썸네일을 우선 사용하는가?
- [ ] pagination/infinite scroll이 있는가?
- [ ] 1,000장 이상 seed로 테스트했는가?
- [ ] 상세 화면에서만 큰 이미지를 로드하는가?
- [ ] loading skeleton이 있는가?

---

## 6. 안전성 리뷰

- [ ] Google Drive 원본 삭제 기능이 없는가?
- [ ] DB hard delete가 일반 UI에 없는가?
- [ ] 숨김/제외 사진 복구가 가능한가?
- [ ] cleanup 후보를 자동 확정하지 않는가?
- [ ] 얼굴인식 기능이 기본 off 또는 실험 모듈인가?
- [ ] 민감 좌표가 정확히 노출되지 않는가?

---

## 7. 출시 전 판단

출시 가능한 상태:

- Drive 원본을 건드리지 않는다.
- 500~1,000장 사진으로 정상 작동한다.
- 부모님이 홈/타임라인/상세/저장 행동을 이해할 수 있다.
- 날짜 없는 사진이 시기 미정으로 안전하게 분리된다.
- 제외/숨김은 복구 가능하다.

출시 보류 상태:

- 원본 삭제 가능성이 있다.
- token이 client에 노출된다.
- 사진 수가 많으면 앱이 멈춘다.
- 얼굴인식이 오작동해도 수정할 수 없다.
- 기본 화면이 파일관리자처럼 보인다.
