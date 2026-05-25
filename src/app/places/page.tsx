import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { getPlaces } from "@/lib/places/placeQueries";

export default async function PlacesPage() {
  const placeGroups = await getPlaces(MOCK_FAMILY_ID);
  const visiblePlaceGroups = placeGroups.filter((group) => group.photos.length > 0);

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${visiblePlaceGroups.length}곳`}
        title="장소별로 보기"
        description="가족에게 익숙한 장소 이름으로 사진을 둘러봅니다. 정확한 지도나 민감한 좌표는 보여주지 않습니다."
      />
      {visiblePlaceGroups.length > 0 ? (
        <div className="browse-card-grid">
          {visiblePlaceGroups.map((group) => {
            const cover = group.photos[0];

            return (
              <article className="browse-card" key={group.name}>
                <img src={cover.thumbnailUrl} alt={group.displayName} loading="lazy" />
                <div className="browse-card__body">
                  <span>{group.photoCount}장</span>
                  <h2>{group.displayName}</h2>
                  <p>{group.name === "Place unknown" ? "장소를 나중에 확인할 사진입니다" : `대표 사진: ${cover.title}`}</p>
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
          <h2>장소별로 보여줄 사진이 아직 없어요</h2>
          <p>사진에 장소 정보가 들어오면 이곳에서 가족 여행지나 자주 가던 장소별로 볼 수 있습니다.</p>
          <div className="hero-actions">
            <a href="/admin/import">사진 가져오기</a>
          </div>
        </section>
      )}
    </div>
  );
}
