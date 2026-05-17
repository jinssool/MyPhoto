import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { mockPhotos } from "@/data/mockPhotos";

const reasonLabels: Record<string, string> = {
  unknown_date: "Needs a date",
  blurry_candidate: "May be blurry",
  duplicate_candidate: "Possible duplicate",
  screenshot_candidate: "May be a screenshot"
};

export default function CleanupPage() {
  const candidates = mockPhotos.filter((photo) => photo.cleanupReasons.length > 0);

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Cleanup"
        title="Review photos safely"
        description="This page only marks app-level candidates. It does not delete, rename, or move Google Drive files."
      />
      {candidates.length === 0 ? (
        <p className="empty-state">No cleanup candidates in the current mock data.</p>
      ) : (
        <div className="photo-grid">
          {candidates.map((photo) => (
            <div className="cleanup-card" key={photo.id}>
              <PhotoCard photo={photo} />
              <div className="cleanup-card__reasons">
                {photo.cleanupReasons.map((reason) => (
                  <span key={reason}>{reasonLabels[reason] ?? reason}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
