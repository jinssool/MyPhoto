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
  const heroCaption = heroPhoto?.caption || "Google Drive 원본은 그대로 두고, 가족이 보기 좋게 앨범에서만 모아봅니다.";

  return (
    <div className="page-stack">
      {heroPhoto ? (
        <section className="hero-album">
          <img src={heroPhoto.imageUrl} alt={heroPhoto.title} />
          <div className="hero-album__content">
            <span>우리집 앨범</span>
            <h1>다시 보고 싶은 가족사진</h1>
            <p>{heroCaption}</p>
            <div className="hero-actions">
              <a href="/timeline">시간별로 보기</a>
              <a href="/events">추억 모음 보기</a>
            </div>
          </div>
        </section>
      ) : (
        <section className="empty-panel">
          <h1>아직 앨범에 보이는 사진이 없어요</h1>
          <p>Google Drive 원본은 그대로 두고, 먼저 폴더의 사진 정보를 앨범에 등록해 주세요.</p>
          <div className="hero-actions">
            <a href="/admin/import">사진 가져오기</a>
          </div>
        </section>
      )}

      <section className="memory-summary">
        <article>
          <strong>{totalPhotoCount}</strong>
          <span>앨범 사진</span>
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
          eyebrow={`${totalPhotoCount}장의 사진`}
          title="최근에 담긴 추억"
          description="파일 목록보다 사진이 먼저 보이도록, 최근 사진을 크게 모아 보여줍니다."
        />
        {recentPhotos.length > 0 ? (
          <div className="photo-grid">
            {recentPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} showCaption />
            ))}
          </div>
        ) : (
          <div className="empty-panel empty-panel--compact">
            <h3>최근 사진이 아직 없어요</h3>
            <p>Drive 폴더를 등록하면 이곳에 가족사진이 나타납니다. 원본 파일은 삭제되거나 옮겨지지 않습니다.</p>
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="가족들이 좋아한 사진" description="좋아요가 모인 사진을 다시 보기 쉽게 모았습니다." />
        {lovedPhotos.length > 0 ? (
          <div className="photo-grid photo-grid--four">
            {lovedPhotos.slice(0, 4).map((photo) => (
              <PhotoCard key={photo.id} photo={photo} size="large" />
            ))}
          </div>
        ) : (
          <div className="empty-panel empty-panel--compact">
            <h3>아직 좋아요가 없어요</h3>
            <p>사진을 보다가 마음에 드는 장면에 좋아요를 남기면 이곳에 모입니다.</p>
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="추억 묶음" description="여행, 생일, 가족행사처럼 기억하기 쉬운 묶음으로 둘러봅니다." />
        {albumGroups.length > 0 ? (
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
        ) : (
          <div className="empty-panel empty-panel--compact">
            <h3>아직 추억 묶음이 없어요</h3>
            <p>사진이 쌓이면 가족행사나 여행별로 보기 좋은 묶음을 만들 수 있습니다.</p>
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="크게 보고 싶은 장면" description="가족이 바로 알아볼 만한 대표 장면을 더 크게 보여줍니다." />
        {featuredPhotos.length > 0 ? (
          <div className="feature-strip">
            {featuredPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} size="large" showCaption />
            ))}
          </div>
        ) : (
          <div className="empty-panel empty-panel--compact">
            <h3>대표 장면을 고르는 중이에요</h3>
            <p>좋아요가 더 모이면 가족이 자주 찾는 사진을 이곳에 크게 보여줍니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}
