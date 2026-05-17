import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getPeopleGroups } from "@/data/mockPhotos";

export default function PeoplePage() {
  const peopleGroups = getPeopleGroups();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Manual groups"
        title="Family faces"
        description="Mock people browsing uses manual labels only. Automatic face recognition is intentionally out of scope."
      />
      <div className="browse-card-grid">
        {peopleGroups.map((group) => {
          const cover = group.photos[0];
          return (
            <article className="browse-card" key={group.name}>
              <img src={cover.thumbnailUrl} alt={`${group.name} cover`} loading="lazy" />
              <div className="browse-card__body">
                <span>{group.photos.length} photos</span>
                <h2>{group.name}</h2>
                <p>{group.name === "People unknown" ? "Photos that still need a person label" : `Often seen in ${cover.eventName ?? "family memories"}`}</p>
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
