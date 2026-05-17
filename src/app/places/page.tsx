import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getPlaceGroups } from "@/data/mockPhotos";

export default function PlacesPage() {
  const placeGroups = getPlaceGroups();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow={`${placeGroups.length} places`}
        title="Memories by place"
        description="Browse by familiar place names. Exact maps and sensitive coordinates stay out of this mock UI."
      />
      <div className="browse-card-grid">
        {placeGroups.map((group) => {
          const cover = group.photos[0];
          return (
            <article className="browse-card" key={group.name}>
              <img src={cover.thumbnailUrl} alt={group.name} loading="lazy" />
              <div className="browse-card__body">
                <span>{group.photos.length} photos</span>
                <h2>{group.name}</h2>
                <p>{group.name === "Place unknown" ? "Ready for gentle cleanup review" : `Recent memory: ${cover.title}`}</p>
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
