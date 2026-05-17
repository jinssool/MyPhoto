# Codex `/goal` 사용법 및 가족사진 앨범 프로젝트용 Goal 프롬프트

## 1. `/goal`의 역할

`/goal`은 Codex에게 긴 작업의 목표를 지속적으로 붙여두는 기능이다.

일반 프롬프트는 한 번의 지시를 처리하고 멈추는 성격이 강하다.  
`/goal`은 “이 조건이 실제로 만족될 때까지 계속 진행하라”는 지속 목표를 현재 Codex thread에 붙이는 방식이다.

따라서 `/goal`은 다음에 적합하다.

- 여러 파일을 고쳐야 하는 작업
- 구현 → 테스트 → 수정 → 재테스트가 필요한 작업
- 마이그레이션
- 리팩터링
- 성능 개선
- 버그 재현 및 수정
- MVP의 한 Phase 단위 구현

반대로 다음에는 부적합하다.

- 단순 파일 하나 수정
- 문구 변경
- 작은 CSS 조정
- 전체 서비스를 한 번에 완성하라는 모호한 지시
- 종료조건이 없는 “계속 개선해줘”류 작업

---

## 2. 사용 준비

Codex CLI에서 `/goal`은 experimental 기능이다.

### 확인 순서

```bash
codex --version
```

Codex CLI에서 `/experimental`을 열어 goals 기능을 켜거나, `~/.codex/config.toml`에 다음을 추가한다.

```toml
[features]
goals = true
```

그 뒤 Codex CLI를 다시 시작한다.

### 기본 명령

```text
/goal <objective>
```

현재 goal 확인:

```text
/goal
```

일시정지:

```text
/goal pause
```

재개:

```text
/goal resume
```

삭제:

```text
/goal clear
```

---

## 3. 좋은 `/goal`의 구조

좋은 `/goal`은 다음 6개 요소를 가져야 한다.

```text
1. Objective: 무엇을 끝내야 하는가
2. Context: 반드시 먼저 읽어야 할 문서/파일
3. Scope: 이번에 건드릴 범위
4. Constraints: 절대 하면 안 되는 것
5. Verification: 완료를 증명할 방법
6. Stop condition: 언제 멈춰야 하는가
```

가장 중요한 것은 Verification이다.  
“구현했다”가 아니라 “무엇으로 완료를 증명할지”가 있어야 한다.

---

## 4. 나쁜 `/goal` 예시

```text
/goal 가족사진 앨범 웹서비스를 완성해줘.
```

문제:
- 범위가 너무 큼
- 종료조건 없음
- 어떤 파일을 먼저 볼지 없음
- 테스트 기준 없음
- 하지 말아야 할 것 없음

```text
/goal UI 예쁘게 만들어줘.
```

문제:
- 예쁨의 기준이 없음
- 검증 불가능
- Codex가 임의로 디자인 방향을 바꿀 수 있음

```text
/goal Google Drive 연동, 얼굴인식, 지도, 중복정리까지 다 만들어줘.
```

문제:
- 리스크 높은 기능을 한 번에 묶음
- 실패 지점 파악 어려움
- 제품 방향이 흔들릴 수 있음

---

## 5. 좋은 `/goal` 기본 템플릿

```text
/goal Complete [Task 이름] for the Family Memory Gallery project.

Before coding, read:
- AGENTS.md
- 00_CODEX_CONTEXT.md
- 05_CODEX_TASKS.md
- relevant existing source files

Objective:
[이번 Task에서 완성할 구체 목표]

Scope:
- [수정/생성 가능한 영역]
- [이번에 포함할 기능]

Do not:
- Do not implement out-of-scope features.
- Do not delete or modify Google Drive original files.
- Do not expose secrets or tokens to client code.
- Do not add comments, voice memos, payments, or complex permissions.
- Do not implement face recognition unless this task explicitly asks for it.
- Do not load original images in gallery grids.

Verification:
- Run typecheck/build.
- Run relevant tests if present.
- Confirm all acceptance criteria below are met.
- Inspect git diff and summarize changed files.

Acceptance criteria:
- [완료 기준 1]
- [완료 기준 2]
- [완료 기준 3]

Stopping condition:
Stop only when verification passes, or when blocked by a missing credential, missing dependency, or ambiguous product decision. If blocked, write a concise blocker report with the exact next action.
```

---

## 6. 가족사진 앨범 프로젝트용 운영 원칙

이 프로젝트에서 `/goal`을 쓰는 가장 안전한 단위는 “전체 서비스”가 아니라 “Task 하나”다.

권장 순서:

```text
Task 0 Project Scaffold
Task 1 Mock Image-Centered UI
Task 2 Supabase Schema
Task 3 DB Query Layer
Task 4 Google Drive OAuth Skeleton
Task 5 Drive Folder Scanner
Task 6 Import Job
Task 7 Timeline Performance
Task 8 Reactions and Highlights
Task 9 Visibility / Cleanup Basic
Task 10 Places Basic
Task 11 Events Basic
Task 12 People Manual Version
Task 13 Face Recognition Experimental Module
Task 14 QA and Safety Review
```

`/goal`로 돌려도 되는 구간:

- Task 0~3: 비교적 안전
- Task 4~6: 보안/토큰/Drive scope 때문에 중간 리뷰 필요
- Task 7~12: 적합
- Task 13: feature flag와 privacy 조건을 매우 강하게 넣어야 함
- Task 14: 매우 적합

---

## 7. 처음 넣을 `/goal` — Task 0

```text
/goal Complete Task 0 — Project Scaffold for the Family Memory Gallery project.

Before coding, read the project context files if present:
- 00_CODEX_CONTEXT.md
- 05_CODEX_TASKS.md
- 06_AGENTS.md
- 10_REVIEW_CHECKLIST.md

Objective:
Create the initial React/TypeScript project scaffold for an image-centered family photo memory album web service.

Scope:
- Set up the app structure.
- Create routes for:
  - /
  - /timeline
  - /photos/[photoId]
  - /places
  - /people
  - /events
  - /cleanup
  - /admin/import
  - /settings
- Add a simple shared layout and navigation.
- Add mock photo data.
- Show photo cards on the home page.
- Add README.md and .env.example if missing.
- Add or update AGENTS.md only if needed to preserve project rules.

Product rules:
- This is not a storage service.
- Google Drive is the original photo storage.
- The app is an image-centered browsing UI.
- MVP uses a shared family account assumption.
- The UI should feel like a family album, not a file manager.

Do not:
- Do not implement Google Drive API yet.
- Do not implement Supabase yet.
- Do not implement face recognition.
- Do not implement comments, voice memos, payments, invitations, or complex permissions.
- Do not add any Drive delete, rename, or move behavior.
- Do not overbuild settings.

Verification:
- Run install if needed.
- Run typecheck/build/lint if configured.
- Open or inspect each route to confirm it renders.
- Confirm the home page shows mock photo cards.
- Confirm there are no secret values committed.
- Inspect git diff.

Acceptance criteria:
- All listed routes exist.
- App runs locally.
- Home page shows an image-centered photo card layout using mock data.
- Navigation is simple and parent-friendly.
- Build or typecheck passes, or the exact blocker is documented.

Stopping condition:
Stop only when the above verification passes, or when blocked by missing package manager setup or ambiguous framework choice. If blocked, report the blocker and the exact next action.
```

---

## 8. Task 1용 `/goal` — Mock Image-Centered UI

```text
/goal Complete Task 1 — Mock Image-Centered UI for the Family Memory Gallery project.

Before coding, read:
- 00_CODEX_CONTEXT.md
- 05_CODEX_TASKS.md
- 06_AGENTS.md
- 10_REVIEW_CHECKLIST.md
- existing app routes/components

Objective:
Build the core mock UI experience for a parent-friendly image-centered family album before connecting any real APIs.

Scope:
- Home:
  - Today’s memories
  - Recently added photos
  - Photos with many reactions
  - Year/event album cards
- Timeline:
  - Year/month sections
  - Large cover photo + thumbnail grid
  - Unknown date section
- Photo detail:
  - Large image
  - date, place, people tags
  - reaction buttons
  - download/open original buttons as UI only
  - hide/exclude buttons as UI only
- Cleanup:
  - blurry candidates
  - duplicate candidates
  - screenshot/document candidates
  - unknown date/place candidates
- Use at least 30 mock photos.

UX requirements:
- Images must dominate the UI.
- File names must be secondary.
- Buttons must be large and clear.
- Desktop-first, but responsive enough not to break on mobile.
- Avoid a file-manager feel.

Do not:
- Do not connect Google Drive.
- Do not connect Supabase.
- Do not implement real auth.
- Do not implement comments, voice memos, payments, invitations, or complex permissions.
- Do not implement face recognition.
- Do not create destructive actions.

Verification:
- Run build/typecheck/lint if configured.
- Manually inspect all core pages.
- Confirm photo detail navigation works.
- Confirm mock data drives the UI consistently.
- Inspect git diff.

Acceptance criteria:
- Home, Timeline, Photo Detail, and Cleanup pages are usable with mock data.
- The UI clearly communicates family photo browsing.
- No real external API is called.
- Build or typecheck passes, or blocker is documented.

Stopping condition:
Stop only when the mock album browsing experience works across the required pages, or when blocked by a framework/build issue that is documented with the exact failing command.
```

---

## 9. Task 2용 `/goal` — Supabase Schema

```text
/goal Complete Task 2 — Supabase Schema for the Family Memory Gallery project.

Before coding, read:
- 03_DATABASE_SCHEMA.md
- 09_SUPABASE_MIGRATION_STARTER.sql
- 05_CODEX_TASKS.md
- 06_AGENTS.md
- existing Supabase/project files

Objective:
Create the Supabase Postgres schema and seed structure for the photo metadata index. The app must store metadata only, not original photo files.

Scope:
- Add Supabase migrations for:
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
- Add indexes for photo timeline and filtering.
- Add seed data for one family and mock photos.
- Add TypeScript DB type helpers if appropriate.

Data rules:
- Every core table must include family_id.
- photos must have unique(family_id, drive_file_id).
- visibility_state must support active, hidden, excluded, trash_candidate.
- date_precision and location_precision must exist.
- Drive originals must never be represented as server-stored original files.

Do not:
- Do not implement real OAuth token encryption unless the project already has a safe secret-management pattern.
- Do not store Google refresh tokens in client-visible code.
- Do not implement multi-family SaaS permissions yet.
- Do not hard-delete photos from normal app flows.

Verification:
- Run migration locally if Supabase is configured.
- Run seed if possible.
- Confirm schema compiles.
- Confirm indexes exist.
- Inspect git diff.

Acceptance criteria:
- Migration files are present and valid.
- Seed data can represent the mock gallery.
- Schema supports timeline, places, people, reactions, cleanup, and import jobs.
- No secrets are committed.

Stopping condition:
Stop only when the schema is ready for Task 3 query-layer work, or when blocked by missing Supabase setup. If blocked, document the exact command/config needed.
```

---

## 10. Task 4~6 Drive 연동용 `/goal` 주의형 템플릿

Google Drive 연동 구간에서는 `/goal`을 쓰되 자동 주행을 너무 믿으면 안 된다.  
Drive scope, token 저장, client 노출 문제가 있으므로 goal 안에 안전조건을 반복해서 넣는다.

```text
/goal Complete [Task 4/5/6 name] for Google Drive integration in the Family Memory Gallery project.

Objective:
Implement only the requested Google Drive integration step while preserving Drive original safety and token security.

Mandatory safety constraints:
- Use read-only Drive scope where possible.
- Never request delete, rename, move, or write permissions for Drive files.
- Never expose access_token, refresh_token, client_secret, or service role keys to client code.
- Never store original photos in the app by default.
- Never scan the entire Drive; operate only on a selected folder.
- Never alter Google Drive folder structure.
- If token encryption is not implemented, create a clear server-only placeholder and TODO; do not fake security.

Verification:
- Inspect OAuth scopes.
- Inspect client bundle paths for secrets.
- Run build/typecheck.
- Confirm the feature works with a small folder or mock Drive adapter.
- Inspect git diff for any Drive delete/update/move API usage.

Stopping condition:
Stop only when the requested Drive step works safely, or when blocked by missing Google credentials. If blocked, write the exact env vars and Google Cloud Console settings needed.
```

---

## 11. Task 14 QA용 `/goal`

```text
/goal Complete Task 14 — QA and Safety Review for the Family Memory Gallery project.

Before making changes, inspect the current repository.

Objective:
Audit the implemented app for product-scope drift, security risks, Drive safety risks, data model risks, and MVP readiness. Apply small fixes where safe, and produce a final risk report.

Review checklist:
1. Search for any Google Drive delete/update/move/rename API usage.
2. Search for service role key exposure in client code.
3. Search for Google token/client secret exposure in client code.
4. Confirm photo queries filter by family_id.
5. Confirm gallery grids load thumbnails, not original images.
6. Confirm hidden/excluded photos are excluded from default timelines.
7. Confirm import uses upsert and avoids duplicate drive_file_id rows.
8. Confirm face recognition is absent or behind a feature flag.
9. Confirm comments, voice memos, payments, and complex permissions were not added.
10. Confirm build/typecheck/test pass.
11. Confirm UX still feels like an image-centered family album, not a file manager.

Allowed changes:
- Small safety fixes
- Build/type errors
- Query filters
- Secret exposure cleanup
- Broken route fixes
- Documentation updates

Do not:
- Do not start new feature implementation.
- Do not add face recognition.
- Do not add comments or permissions.
- Do not rewrite the app architecture unless strictly necessary.

Verification:
- Run build/typecheck/test where available.
- Run grep/search for dangerous Drive operations and secrets.
- Inspect git diff.
- Produce a final report with:
  - Passed checks
  - Fixed issues
  - Remaining risks
  - Recommended next task

Stopping condition:
Stop only when the audit report is complete and all safe fixes are applied, or when a critical blocker requires user decision.
```

---

## 12. 내 사용 추천

### 가장 좋은 방식

```text
1. /plan으로 먼저 계획을 받는다.
2. 계획이 맞으면 /goal로 Task 하나만 실행한다.
3. 끝나면 /review 또는 별도 리뷰 프롬프트로 검증한다.
4. 문제가 없으면 다음 Task로 넘어간다.
```

### 실제 사용 흐름

```text
/plan Read 00_CODEX_CONTEXT.md, 05_CODEX_TASKS.md, and 06_AGENTS.md. Propose a short implementation plan for Task 0 only. Do not code yet.
```

계획 확인 후:

```text
/goal Complete Task 0 — Project Scaffold ...
```

끝난 뒤:

```text
/review Review the working tree against 10_REVIEW_CHECKLIST.md. Focus on scope creep, unsafe Drive behavior, secrets, and whether the UI still matches an image-centered family album.
```

---

## 13. 이 프로젝트에서 `/goal`을 쓰면 안 되는 순간

다음 상황에서는 `/goal`보다 일반 프롬프트나 `/plan`이 낫다.

- 아직 제품 방향을 고민 중일 때
- “어떤 기술스택이 좋을까?”처럼 결정을 내려야 할 때
- Google Cloud Console 설정이 안 되어 있을 때
- Supabase env가 빠져 있을 때
- 가족사진 원본이 실제로 연결되어 있고 백업/권한 확인이 안 되었을 때
- 얼굴인식 정책을 아직 정하지 않았을 때
- 한 번의 작은 수정이면 끝나는 작업일 때

---

## 14. 핵심 결론

`/goal`은 자율주행 버튼이 아니라 검증 가능한 장기 작업 계약이다.

이 프로젝트에서는 다음 원칙으로 써야 한다.

```text
전체 앱 완성용으로 쓰지 말 것.
Task 하나를 완료하는 데만 쓸 것.
종료조건을 반드시 검증 가능하게 쓸 것.
Drive 원본 안전성과 secret 보호 조건을 반복해서 넣을 것.
끝난 뒤 반드시 /review로 재검사할 것.
```
