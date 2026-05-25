# Family Usability Test Guide

Use this guide to run a short internal test with non-technical family members. The goal is to learn whether the MVP feels like a family album and whether the main flow is understandable without explaining the product first.

## Test Purpose

- Confirm that family members understand Home, Timeline, Photo Detail, Cleanup, and Import.
- Check whether labels like `좋아요 남기기`, `앨범에서 숨기기`, `둘러보기에서 제외`, and `다시 보이기` are clear.
- Confirm that people understand Drive originals are not deleted, moved, or changed.
- Find confusing wording, scary buttons, unclear next steps, and places where the UI feels too technical.

## Who Should Test

- 1-2 parents or older family members who did not build the app.
- 1 family member who is comfortable with web apps.
- Optional: 1 person who cares about organizing family photos.

Avoid testing only with engineers. This MVP is for family browsing, not file management.

## Setup Checklist

- [ ] Run the app locally with Supabase configured.
- [ ] Confirm Google Drive is connected from `/admin/import`.
- [ ] Import or seed at least 5-10 test photos.
- [ ] Use a test Drive folder, not a large real family archive.
- [ ] Confirm `/`, `/timeline`, `/cleanup`, and one `/photos/<photo-id>` page load.
- [ ] Confirm the tester knows this is a rough internal MVP.
- [ ] Prepare `docs/FEEDBACK_LOG.md` for notes.
- [ ] Do not explain every feature before the test.

Recommended facilitator opening:

```text
가족사진을 보기 쉽게 모아보는 앨범 초안이에요.
원본 사진은 Google Drive에 그대로 있고, 여기서는 앨범에서 보이는 방식만 바뀝니다.
편하게 눌러보시고 헷갈리는 부분을 말로 이야기해 주세요.
```

## 15-Minute Test Script

### 0-2 Minutes: First Impression

1. Open `/`.
2. Ask the tester to say what they think this app is for.
3. Do not correct them immediately unless they think original Drive files can be deleted.

Observe:

- Do they understand this is a photo album?
- Do they notice photo-first browsing?
- Do they know what to click next?

### 2-5 Minutes: Browse Photos

Ask:

```text
최근 사진을 둘러보고, 보고 싶은 사진 하나를 크게 열어보세요.
```

Observe:

- Can they open a photo card?
- Do the photo titles, dates, and places help or distract?
- Do they find the navigation labels understandable?

### 5-7 Minutes: Timeline

Ask:

```text
시간별 메뉴로 가서 예전 사진을 찾아보세요.
```

Observe:

- Do they understand year/month grouping?
- Do they notice the unknown-date section if present?
- Does Timeline feel like a memory album rather than a file list?

### 7-10 Minutes: Photo Detail Actions

Open one photo detail page and ask:

```text
이 사진에 좋아요를 남겨보세요.
이 버튼들이 어떤 일을 할 것 같은지 말해 주세요.
```

Buttons to discuss:

- `좋아요 남기기`
- `앨범에서 숨기기`
- `둘러보기에서 제외`
- `다시 보이기`

Observe:

- Do they understand that actions affect the album view only?
- Are hide and exclude meaningfully different to them?
- Does the Drive original safety note reduce concern?

### 10-12 Minutes: Cleanup

Ask:

```text
정리함에서 한 장을 보고, 앨범에 둘지 나중에 볼지 골라보세요.
```

Observe:

- Do cleanup reasons make sense?
- Do buttons feel too serious or safe enough?
- Do they worry that the original Drive file will be deleted?

### 12-14 Minutes: Import Page

Open `/admin/import` and ask:

```text
이 화면에서 어떤 순서로 해야 할지 말해 주세요.
```

Observe:

- Do they understand the three steps?
- Do they understand preview is not registration?
- Do they understand registration stores metadata only?
- Does JSON result wording sound too technical?

### 14-15 Minutes: Wrap-Up

Ask the post-test questions below. Capture exact phrases in the feedback log.

## Tasks For Family Members

Give these one at a time:

1. Find a photo you want to look at longer.
2. Find photos by time.
3. Leave a like on one photo.
4. Tell me what `앨범에서 숨기기` means.
5. Tell me what `둘러보기에서 제외` means.
6. Restore a hidden or excluded photo if available.
7. Review one cleanup candidate.
8. Explain what the import page does before clicking anything.

## Observation Checklist

- [ ] Tester understands the app is an album, not Drive replacement storage.
- [ ] Tester understands original Drive files are unchanged.
- [ ] Tester can open a photo from Home.
- [ ] Tester can use Timeline without help.
- [ ] Tester understands `좋아요 남기기`.
- [ ] Tester understands or asks a clear question about hide/exclude.
- [ ] Tester notices how to restore a hidden/excluded photo.
- [ ] Tester understands cleanup is review/visibility, not deletion.
- [ ] Tester understands preview vs album registration on Import.
- [ ] Tester does not need technical terms explained to proceed.
- [ ] Tester can describe what they would do next.

## Questions After Testing

Ask:

1. What did you think this app was for?
2. Which screen felt most useful?
3. Which word or button was confusing?
4. Did any action feel risky or scary?
5. Did you believe the original Google Drive photos were safe?
6. Would you use this to look through family photos?
7. What would you want changed before using real family albums?
8. What should we remove or simplify?

## Known Things Not To Explain Unless Asked

Do not explain these upfront. If testers ask, answer briefly.

- Supabase.
- OAuth.
- token encryption.
- metadata.
- import job IDs.
- RLS or production auth.
- database schema.
- cleanup candidate internals.
- why JSON appears after preview/import.

If the tester gets blocked by one of these, record it as a usability issue.

## Safety Reminder For Facilitators

- Use a small test folder first, ideally 5-10 photos.
- Do not test on an entire family archive yet.
- Do not ask testers to delete, move, rename, or upload Drive files.
- The app should never mutate Drive originals.
