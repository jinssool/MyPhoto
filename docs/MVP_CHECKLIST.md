# MVP v0.1 Checklist

Internal snapshot for the Family Memory Gallery MVP.

## Product Shape

- [x] Family photo memory album, not a storage product.
- [x] Google Drive remains the original photo source.
- [x] MVP assumes one shared family account.
- [x] UI is image-centered, simple, warm, and parent-friendly.
- [x] Mock fallback remains available when Supabase is not configured.

## Core Browsing

- [x] Home renders active album photos.
- [x] Timeline renders active album photos by year and month.
- [x] Photo detail renders an imported or seeded photo.
- [x] Places route renders available place groups or an empty state.
- [x] People route renders available people groups or an empty state.
- [x] Events route renders available event groups or an empty state.
- [x] Cleanup route renders review candidates or an empty state.

## Google Drive Flow

- [x] Google OAuth uses read-only Drive scope.
- [x] OAuth tokens are encrypted before storage.
- [x] Expired access tokens can refresh server-side when a refresh token is available.
- [x] Folder preview lists image metadata only.
- [x] Folder import registers metadata only.
- [x] Import is idempotent by `family_id` and `drive_file_id`.
- [x] Import creates `import_jobs` status records.
- [x] Import never downloads, stores, deletes, moves, or renames Drive originals.

## App Actions

- [x] Photo reaction increments app metadata.
- [x] Hide removes a photo from default Home and Timeline browsing.
- [x] Exclude removes a photo from default Home and Timeline browsing.
- [x] Restore makes a photo active again.
- [x] Cleanup keep, review later, hide, and exclude update app metadata only.
- [x] No action mutates Google Drive files.

## Safety Checks

- [x] No Drive write/delete/move/rename scope.
- [x] No Drive mutation calls.
- [x] No `googleapis` dependency or import.
- [x] No original image download/storage path.
- [x] No image blob storage path.
- [x] No Supabase hard deletes in app query/action layers.
- [x] No service role key usage in app code.
- [x] No raw access or refresh token logging.
- [x] `TOKEN_ENCRYPTION_KEY` is server-side only.
- [x] No client-side Supabase query/write.

## Required Verification

Run before handoff:

```bash
npm run validate:query-layer
npm run typecheck
npm run build
npm audit --audit-level=moderate
git diff --check
```

Smoke routes:

```text
/
/timeline
/photos/<imported-photo-id>
/cleanup
/places
/people
/events
/admin/import
```

## Intentionally Not Included

- [ ] Drive original storage.
- [ ] Drive file mutation.
- [ ] Comments.
- [ ] Voice memos.
- [ ] Face recognition.
- [ ] Google Picker.
- [ ] Invitations or complex permissions.
- [ ] Recursive or large-scale import.
- [ ] Background queues.
- [ ] Production auth/RLS.
- [ ] Payments.
