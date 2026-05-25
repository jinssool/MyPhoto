import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { getEvents } from "@/lib/events/eventQueries";

export default async function EventsPage() {
  const eventGroups = await getEvents(MOCK_FAMILY_ID);
  const visibleEventGroups = eventGroups.filter((event) => event.photos.length > 0);

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${visibleEventGroups.length}개 묶음`}
        title="추억 모음"
        description="Drive 폴더가 아니라 여행, 생일, 가족행사 같은 추억 중심으로 사진을 모았습니다."
      />
      {visibleEventGroups.length > 0 ? (
        <div className="event-gallery">
          {visibleEventGroups.map((event) => {
            const cover = event.photos[0];

            return (
              <section className="event-section" key={event.name}>
                <div className="event-cover">
                  <img src={cover.thumbnailUrl} alt={event.displayName} loading="lazy" />
                  <div>
                    <span>{event.dateLabel}</span>
                    <h2>{event.displayName}</h2>
                    <p>{event.photoCount}장</p>
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
      ) : (
        <section className="empty-panel">
          <h2>아직 추억 묶음이 없어요</h2>
          <p>사진이 더 모이면 여행, 생일, 가족행사처럼 기억하기 쉬운 묶음으로 둘러볼 수 있습니다.</p>
          <div className="hero-actions">
            <a href="/timeline">시간별로 보기</a>
          </div>
        </section>
      )}
    </div>
  );
}
