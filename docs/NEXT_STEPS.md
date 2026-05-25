# Next Steps

Roadmap after the internal MVP v0.1 snapshot. These are intentionally not part of the current MVP.

## Near-Term Hardening

1. Define production auth and RLS.
   - Decide whether the app remains one shared family account or moves to named users.
   - Add RLS policies only after the access model is clear.
   - Keep service-role credentials out of browser code and local documentation examples.

2. Improve import operations.
   - Add a simple human-readable import result page or status panel.
   - Keep the import metadata-only and read-only against Drive.
   - Add better retry messaging for expired or revoked Google tokens.

3. Add focused test coverage.
   - Cover query helpers for active, hidden, and excluded visibility.
   - Cover metadata import idempotency.
   - Cover cleanup action state transitions.
   - Keep safety validation as a required CI-style gate.

4. Tighten monitoring for local/internal use.
   - Log import job status without logging raw tokens.
   - Track import failures by status and message.
   - Avoid storing original image bytes or derived blobs.

## Product Polish

1. Refine album browsing.
   - Improve date labels for imported Drive metadata.
   - Add lightweight filters only when family users need them.
   - Keep the first screen image-centered.

2. Improve cleanup language.
   - Keep cleanup actions framed as album visibility decisions.
   - Avoid any wording that suggests Drive files are deleted or moved.

3. Improve empty states.
   - Keep messages clear for family members.
   - Link to the next safe action, usually Drive import or Home.

## Deferred Features

These require separate design and safety review before implementation:

- Google Picker.
- Recursive Drive folder import.
- Large-scale import pagination and background queues.
- Production auth, roles, invitations, and complex permissions.
- Comments.
- Voice memos.
- Face recognition or person clustering automation.
- Payments.
- Sharing outside the internal family account.

## Safety Boundaries To Preserve

- Do not store Drive original files.
- Do not store image blobs.
- Do not request Drive write scopes.
- Do not call Drive delete, move, rename, upload, or patch APIs.
- Do not hard delete Supabase photo metadata from app actions.
- Do not log raw access tokens or refresh tokens.
- Do not expose `TOKEN_ENCRYPTION_KEY`, Google client secrets, or service-role credentials to client code.
