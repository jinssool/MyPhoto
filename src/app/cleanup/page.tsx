import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cleanupReasonLabels } from "@/data/mockPhotos";
import { updateCleanupCandidateStatusAction } from "@/app/actions/photoActions";
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
        description="가족 앨범에서 한 번 확인하면 좋은 사진만 모았습니다. 여기서 눌러도 Google Drive 원본은 삭제, 이동, 이름 변경되지 않습니다."
      />

      <section className="memory-summary">
        {cleanupOrder.map((reason) => (
          <article key={reason}>
            <strong>{groups[reason]?.length ?? 0}</strong>
            <span>{cleanupReasonLabels[reason]}</span>
          </article>
        ))}
      </section>

      {candidateCount === 0 ? (
        <section className="empty-panel">
          <h2>지금 정리할 사진이 없어요</h2>
          <p>숨기거나 제외할 후보가 생기면 이곳에서 가볍게 확인할 수 있습니다. 원본 파일은 늘 Google Drive에 그대로 남습니다.</p>
          <div className="hero-actions">
            <a href="/">앨범으로 돌아가기</a>
            <a href="/timeline">시간별로 보기</a>
          </div>
        </section>
      ) : null}

      {cleanupOrder.map((reason) => {
        const photos = groups[reason] ?? [];
        if (photos.length === 0) return null;

        return (
          <section className="cleanup-section" key={reason}>
            <SectionHeader title={cleanupReasonLabels[reason]} description={`${photos.length}장을 앨범에 계속 보이게 둘지 가볍게 확인해 보세요.`} />
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
                    <form action={updateCleanupCandidateStatusAction.bind(null, photo.id, reason, "kept")}>
                      <button type="submit">앨범에 두기</button>
                    </form>
                    <form action={updateCleanupCandidateStatusAction.bind(null, photo.id, reason, "hidden")}>
                      <button type="submit" className="secondary-button">
                        숨기기
                      </button>
                    </form>
                    <form action={updateCleanupCandidateStatusAction.bind(null, photo.id, reason, "excluded")}>
                      <button type="submit" className="secondary-button">
                        제외하기
                      </button>
                    </form>
                    <form action={updateCleanupCandidateStatusAction.bind(null, photo.id, reason, "review_later")}>
                      <button type="submit" className="secondary-button">
                        나중에 보기
                      </button>
                    </form>
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
