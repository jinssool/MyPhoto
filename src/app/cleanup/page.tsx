import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cleanupReasonLabels } from "@/data/mockPhotos";
import { getCleanupCandidates } from "@/lib/cleanup/cleanupQueries";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
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

export default async function CleanupPage() {
  const cleanupGroups = await getCleanupCandidates(MOCK_FAMILY_ID);
  const groups = cleanupGroups.reduce<Partial<Record<CleanupReason, (typeof cleanupGroups)[number]["photos"]>>>((accumulator, group) => {
    accumulator[group.reason] = group.photos;
    return accumulator;
  }, {});
  const candidateCount = new Set(cleanupGroups.flatMap((group) => group.photos.map((photo) => photo.id))).size;

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${candidateCount}장`}
        title="정리함"
        description="나중에 확인하면 좋은 샘플 후보입니다. 이 화면은 Google Drive 원본을 삭제, 이동, 이름 변경하지 않습니다."
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
            <SectionHeader title={cleanupReasonLabels[reason]} description={`${photos.length}장을 가족 앨범에 남길지 가볍게 확인해 보세요.`} />
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
                    <button type="button">포함</button>
                    <button type="button" className="secondary-button">
                      숨김
                    </button>
                    <button type="button" className="secondary-button">
                      제외
                    </button>
                    <button type="button" className="secondary-button">
                      나중에 보기
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
