import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getPlaceDisplayName, getPlaceGroups } from "@/data/mockPhotos";

export default function PlacesPage() {
  const placeGroups = getPlaceGroups();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${placeGroups.length}곳`}
        title="장소별로 보기"
        description="가족에게 익숙한 장소 이름으로 사진을 둘러봅니다. 정확한 지도나 민감한 좌표는 이 샘플 화면에 넣지 않습니다."
      />
      <div className="browse-card-grid">
        {placeGroups.map((group) => {
          const cover = group.photos[0];
          return (
            <article className="browse-card" key={group.name}>
              <img src={cover.thumbnailUrl} alt={getPlaceDisplayName(group.name)} loading="lazy" />
              <div className="browse-card__body">
                <span>{group.photos.length}장</span>
                <h2>{getPlaceDisplayName(group.name)}</h2>
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
    </div>
  );
}
