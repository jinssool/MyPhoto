import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getPhotoCountLabel } from "@/data/mockPhotos";
import { getEvents } from "@/lib/events/eventQueries";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { getHomeHighlights } from "@/lib/photos/photoQueries";

export default async function HomePage() {
  const [{ featuredPhotos, featuredPhoto, recentPhotos, lovedPhotos, cleanupCount, totalPhotoCount }, eventGroups] = await Promise.all([
    getHomeHighlights(MOCK_FAMILY_ID),
    getEvents(MOCK_FAMILY_ID)
  ]);
  const heroPhoto = featuredPhoto ?? recentPhotos[0] ?? lovedPhotos[0];
  const albumGroups = eventGroups.filter((event) => event.photos.length > 0).slice(0, 5);

  return (
    <div className="page-stack">
      {heroPhoto ? (
        <section className="hero-album">
          <img src={heroPhoto.imageUrl} alt={heroPhoto.title} />
          <div className="hero-album__content">
            <span>우리집 앨범</span>
            <h1>다시 보고 싶은 가족사진</h1>
            <p>{heroPhoto.caption}</p>
            <div className="hero-actions">
              <a href="/timeline">시간별로 보기</a>
              <a href="/events">추억 모음 보기</a>
            </div>
          </div>
        </section>
      ) : null}

      <section className="memory-summary">
        <article>
          <strong>{totalPhotoCount}</strong>
          <span>샘플 가족사진</span>
        </article>
        <article>
          <strong>{eventGroups.length}</strong>
          <span>추억 묶음</span>
        </article>
        <article>
          <strong>{cleanupCount}</strong>
          <span>정리할 사진</span>
        </article>
      </section>

      <section>
        <SectionHeader
          eyebrow={`${totalPhotoCount}장의 샘플 사진`}
          title="최근에 담긴 추억"
          description="파일명이 아니라 사진과 추억이 먼저 보이도록 크게 보여줍니다."
        />
        <div className="photo-grid">
          {recentPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} showCaption />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="가족들이 좋아한 사진" description="반응이 많이 모인 따뜻한 사진들입니다." />
        <div className="photo-grid photo-grid--four">
          {lovedPhotos.slice(0, 4).map((photo) => (
            <PhotoCard key={photo.id} photo={photo} size="large" />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="추억 묶음" description="연도, 여행, 가족행사별로 쉽게 들어갈 수 있게 모았습니다." />
        <div className="album-grid">
          {albumGroups.map((album) => {
            const cover = album.photos[0];
            return (
              <article className="album-card" key={album.id ?? album.name}>
                <img src={cover.thumbnailUrl} alt={album.displayName} loading="lazy" />
                <div>
                  <h3>{album.displayName}</h3>
                  <p>{album.dateLabel}</p>
                  <span>{getPhotoCountLabel(album.photoCount)}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title="크게 보고 싶은 장면" description="가족이 바로 알아볼 만한 대표 장면을 더 크게 보여줍니다." />
        <div className="feature-strip">
          {featuredPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} size="large" showCaption />
          ))}
        </div>
      </section>
    </div>
  );
}
