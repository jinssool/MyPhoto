import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cleanupReasonLabels, getCleanupCandidates, getCleanupGroups } from "@/data/mockPhotos";
import type { CleanupReason } from "@/types/photo";

const cleanupOrder: CleanupReason[] = [
  "blurry_candidate",
  "duplicate_candidate",
  "screenshot_candidate",
  "document_candidate",
  "unknown_date",
  "unknown_place",
  "unknown_person"
];

export default function CleanupPage() {
  const candidates = getCleanupCandidates();
  const groups = getCleanupGroups();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${candidates.length} photos`}
        title="Review photos safely"
        description="These are mock app-level review candidates. This screen never deletes, renames, or moves Google Drive files."
      />

      <section className="memory-summary">
        {cleanupOrder.map((reason) => (
          <article key={reason}>
            <strong>{groups[reason]?.length ?? 0}</strong>
            <span>{cleanupReasonLabels[reason]}</span>
          </article>
        ))}
      </section>

      {cleanupOrder.map((reason) => {
        const photos = groups[reason] ?? [];
        if (photos.length === 0) return null;

        return (
          <section className="cleanup-section" key={reason}>
            <SectionHeader title={cleanupReasonLabels[reason]} description={`${photos.length} photos need a quick family review.`} />
            <div className="photo-grid photo-grid--three">
              {photos.map((photo) => (
                <div className="cleanup-card" key={`${reason}-${photo.id}`}>
                  <PhotoCard photo={photo} />
                  <div className="cleanup-card__reasons">
                    {photo.cleanupReasons.map((photoReason) => (
                      <span key={photoReason}>{cleanupReasonLabels[photoReason]}</span>
                    ))}
                  </div>
                  <div className="cleanup-card__actions">
                    <button type="button">Keep</button>
                    <button type="button" className="secondary-button">
                      Hide
                    </button>
                    <button type="button" className="secondary-button">
                      Exclude
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
