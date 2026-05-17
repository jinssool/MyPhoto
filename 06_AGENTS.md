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
