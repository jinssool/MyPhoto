import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getAlbumCover,
  getCleanupCandidates,
  getFeaturedPhotos,
  getLovedPhotos,
  getRecentPhotos,
  memoryAlbums,
  mockPhotos
} from "@/data/mockPhotos";

export default function HomePage() {
  const featuredPhotos = getFeaturedPhotos();
  const featuredPhoto = featuredPhotos[0] ?? getRecentPhotos(1)[0];
  const recentPhotos = getRecentPhotos(8);
  const lovedPhotos = getLovedPhotos(4);
  const cleanupCount = getCleanupCandidates().length;

  return (
    <div className="page-stack">
      <section className="hero-album">
        <img src={featuredPhoto.imageUrl} alt={featuredPhoto.title} />
        <div className="hero-album__content">
          <span>Family album</span>
          <h1>Photos worth seeing again</h1>
          <p>{featuredPhoto.caption}</p>
          <div className="hero-actions">
            <a href="/timeline">Browse by year</a>
            <a href="/events">See family events</a>
          </div>
        </div>
      </section>

      <section className="memory-summary">
        <article>
          <strong>{mockPhotos.length}</strong>
          <span>mock family photos</span>
        </article>
        <article>
          <strong>{memoryAlbums.length}</strong>
          <span>album entry points</span>
        </article>
        <article>
          <strong>{cleanupCount}</strong>
          <span>photos to review safely</span>
        </article>
      </section>

      <section>
        <SectionHeader
          eyebrow={`${mockPhotos.length} mock photos`}
          title="Recently added memories"
          description="Large photo cards keep the first screen focused on memories, not filenames."
        />
        <div className="photo-grid">
          {recentPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} showCaption />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Most loved" description="Photos with the warmest family reactions." />
        <div className="photo-grid photo-grid--four">
          {lovedPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} size="large" />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Family albums" description="Simple entry points by year, trip, and memory theme." />
        <div className="album-grid">
          {memoryAlbums.map((album) => {
            const cover = getAlbumCover(album);
            return (
              <article className="album-card" key={album.id}>
                <img src={cover.thumbnailUrl} alt={album.title} loading="lazy" />
                <div>
                  <h3>{album.title}</h3>
                  <p>{album.subtitle}</p>
                  <span>{album.photoCount} photos</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title="Featured memories" description="A few bigger moments for quick family browsing." />
        <div className="feature-strip">
          {featuredPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} size="large" showCaption />
          ))}
        </div>
      </section>
    </div>
  );
}
