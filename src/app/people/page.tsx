import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getEventDisplayName } from "@/data/mockPhotos";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { getPeople } from "@/lib/people/personQueries";

export default async function PeoplePage() {
  const peopleGroups = await getPeople(MOCK_FAMILY_ID);
  const visiblePeopleGroups = peopleGroups.filter((group) => group.photos.length > 0);

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${visiblePeopleGroups.length}개 이름표`}
        title="사람별로 보기"
        description="가족이 알아보기 쉬운 이름표로 사진을 둘러봅니다. 자동 얼굴인식은 사용하지 않습니다."
      />
      {visiblePeopleGroups.length > 0 ? (
        <div className="browse-card-grid">
          {visiblePeopleGroups.map((group) => {
            const cover = group.photos[0];

            return (
              <article className="browse-card" key={group.name}>
                <img src={cover.thumbnailUrl} alt={`${group.displayName} 대표 사진`} loading="lazy" />
                <div className="browse-card__body">
                  <span>{group.photoCount}장</span>
                  <h2>{group.displayName}</h2>
                  <p>{group.displayName === "사람 확인 필요" ? "누가 나왔는지 나중에 확인할 사진입니다" : `${getEventDisplayName(cover.eventName)}에서 자주 보입니다`}</p>
                </div>
                <div className="mini-photo-grid">
                  {group.photos.slice(0, 4).map((photo) => (
                    <PhotoCard key={photo.id} photo={photo} size="compact" />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="empty-panel">
          <h2>사람별로 보여줄 사진이 아직 없어요</h2>
          <p>나중에 가족 이름표가 붙으면 이곳에서 사람별로 사진을 찾을 수 있습니다. 얼굴인식 기능은 아직 사용하지 않습니다.</p>
          <div className="hero-actions">
            <a href="/">앨범으로 돌아가기</a>
          </div>
        </section>
      )}
    </div>
  );
}
