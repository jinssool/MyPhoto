import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getEventDisplayName, getPeopleGroups, getPersonDisplayName } from "@/data/mockPhotos";

export default function PeoplePage() {
  const peopleGroups = getPeopleGroups();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="수동 샘플 그룹"
        title="사람별로 보기"
        description="사람별 보기는 샘플 이름표만 사용합니다. 자동 얼굴인식은 아직 넣지 않습니다."
      />
      <div className="browse-card-grid">
        {peopleGroups.map((group) => {
          const cover = group.photos[0];
          return (
            <article className="browse-card" key={group.name}>
              <img src={cover.thumbnailUrl} alt={`${getPersonDisplayName(group.name)} 대표 사진`} loading="lazy" />
              <div className="browse-card__body">
                <span>{group.photos.length}장</span>
                <h2>{getPersonDisplayName(group.name)}</h2>
                <p>{group.name === "People unknown" ? "누가 나왔는지 나중에 확인할 사진입니다" : `${getEventDisplayName(cover.eventName)}에서 자주 보입니다`}</p>
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
