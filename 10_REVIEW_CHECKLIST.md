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
