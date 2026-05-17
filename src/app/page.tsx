import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getActivePhotos, getAlbumCover, memoryAlbums, mockPhotos } from "@/data/mockPhotos";

export default function HomePage() {
  const activePhotos = getActivePhotos();
  const featuredPhoto = activePhotos[3] ?? activePhotos[0];
  const recentPhotos = activePhotos.slice(0, 4);
  const lovedPhotos = [...activePhotos].sort((a, b) => b.reactionCount - a.reactionCount).slice(0, 3);

  return (
    <div className="page-stack">
      <section className="hero-album">
        <img src={featuredPhoto.imageUrl} alt={featuredPhoto.title} />
        <div className="hero-album__content">
          <span>Today's memory</span>
          <h1>{featuredPhoto.title}</h1>
          <p>{featuredPhoto.caption}</p>
        </div>
      </section>

      <section>
        <SectionHeader
          eyebrow={`${mockPhotos.length} mock photos`}
          title="Recent family photos"
          description="Large photo cards keep the first screen focused on memories, not files."
        />
        <div className="photo-grid">
          {recentPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Most loved" description="Photos with the warmest family reactions." />
        <div className="photo-grid photo-grid--three">
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
    </div>
  );
}
