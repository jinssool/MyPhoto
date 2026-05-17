import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getEventGroups } from "@/data/mockPhotos";

export default function EventsPage() {
  const eventGroups = getEventGroups();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${eventGroups.length} memory groups`}
        title="Trips, birthdays, and family days"
        description="Event cards group photos around family memories instead of Drive folders."
      />
      <div className="event-gallery">
        {eventGroups.map((event) => {
          const cover = event.photos[0];
          return (
            <section className="event-section" key={event.name}>
              <div className="event-cover">
                <img src={cover.thumbnailUrl} alt={event.name} loading="lazy" />
                <div>
                  <span>{event.dateLabel}</span>
                  <h2>{event.name}</h2>
                  <p>{event.photos.length} photos</p>
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
