import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getEventDisplayName, getEventGroups } from "@/data/mockPhotos";

export default function EventsPage() {
  const eventGroups = getEventGroups();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${eventGroups.length}개 묶음`}
        title="추억 모음"
        description="Drive 폴더가 아니라 여행, 생일, 가족행사 같은 추억 중심으로 사진을 모았습니다."
      />
      <div className="event-gallery">
        {eventGroups.map((event) => {
          const cover = event.photos[0];
          return (
            <section className="event-section" key={event.name}>
              <div className="event-cover">
                <img src={cover.thumbnailUrl} alt={getEventDisplayName(event.name)} loading="lazy" />
                <div>
                  <span>{event.dateLabel}</span>
                  <h2>{getEventDisplayName(event.name)}</h2>
                  <p>{event.photos.length}장</p>
                </div>
              </div>
              <div className="photo-grid photo-grid--four">
                {event.photos.slice(0, 8).map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
