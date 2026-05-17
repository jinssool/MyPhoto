import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getActivePhotos } from "@/data/mockPhotos";

export default function PeoplePage() {
  const people = ["Mom", "Dad", "Grandma", "Jisoo", "Min"];

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="People"
        title="Family faces"
        description="Manual people groups only. Automatic face recognition is intentionally out of scope for this scaffold."
      />
      <div className="people-grid">
        {people.map((person) => {
          const photos = getActivePhotos().filter((photo) => photo.people.includes(person));
          const cover = photos[0] ?? getActivePhotos()[0];
          return (
            <article className="person-card" key={person}>
              <img src={cover.thumbnailUrl} alt={`${person} cover`} loading="lazy" />
              <div>
                <h2>{person}</h2>
                <p>{photos.length} photos</p>
              </div>
            </article>
          );
        })}
      </div>
      <section>
        <SectionHeader title="Sample people photos" />
        <div className="photo-grid">
          {getActivePhotos()
            .slice(0, 4)
            .map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
        </div>
      </section>
    </div>
  );
}
