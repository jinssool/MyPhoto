import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getActivePhotos } from "@/data/mockPhotos";

export default function EventsPage() {
  const eventGroups = getActivePhotos().reduce<Record<string, ReturnType<typeof getActivePhotos>>>((groups, photo) => {
    const key = photo.eventName ?? "Everyday memories";
    groups[key] = groups[key] ?? [];
    groups[key].push(photo);
    return groups;
  }, {});

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Events"
        title="Trips, birthdays, and family days"
        description="Event cards group photos around memories instead of folder names."
      />
      {Object.entries(eventGroups).map(([eventName, photos]) => (
        <section className="event-section" key={eventName}>
          <div>
            <h2>{eventName}</h2>
            <p>{photos.length} photos</p>
          </div>
          <div className="photo-grid photo-grid--three">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
