import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getActivePhotos } from "@/data/mockPhotos";

export default function PlacesPage() {
  const photos = getActivePhotos();
  const placeGroups = photos.reduce<Record<string, typeof photos>>((groups, photo) => {
    groups[photo.placeName] = groups[photo.placeName] ?? [];
    groups[photo.placeName].push(photo);
    return groups;
  }, {});

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Places"
        title="Memories by place"
        description="A first pass at place browsing without map APIs or exact sensitive coordinates."
      />
      <div className="place-list">
        {Object.entries(placeGroups).map(([place, group]) => (
          <section className="place-row" key={place}>
            <div>
              <h2>{place}</h2>
              <p>{group.length} photos</p>
            </div>
            <div className="photo-strip">
              {group.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
