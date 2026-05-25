import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { getTimelinePhotos } from "@/lib/photos/photoQueries";

const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export default async function TimelinePage() {
  const { years, unknownDate } = await getTimelinePhotos(MOCK_FAMILY_ID);
  const hasPhotos = years.length > 0 || unknownDate.length > 0;

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="시간별"
        title="사진을 시간순으로 보기"
        description="촬영일이 있는 사진은 연도와 월별로 모으고, 날짜가 애매한 사진은 따로 모아 확인합니다."
      />

      {!hasPhotos ? (
        <section className="empty-panel">
          <h2>시간별로 보여줄 사진이 아직 없어요</h2>
          <p>Drive 폴더를 앨범에 등록하면 촬영일이 있는 사진부터 차례대로 정리됩니다. Google Drive 원본은 그대로 남아 있습니다.</p>
          <div className="hero-actions">
            <a href="/admin/import">사진 가져오기</a>
          </div>
        </section>
      ) : null}

      {years.map((yearGroup) => (
        <section className="timeline-year" key={yearGroup.year}>
          <div className="timeline-year__heading">
            <h2>{yearGroup.year}</h2>
            <span>{yearGroup.months.reduce((count, month) => count + month.photos.length, 0)}장</span>
          </div>
          <div className="timeline-months">
            {yearGroup.months.map((monthGroup) => {
              const [cover, ...rest] = monthGroup.photos;
              return (
                <article className="timeline-month" key={`${yearGroup.year}-${monthGroup.month}`}>
                  <div className="timeline-month__heading">
                    <strong>{monthNames[monthGroup.month - 1]}</strong>
                    <span>{monthGroup.photos.length}장</span>
                  </div>
                  <PhotoCard photo={cover} size="large" showCaption />
                  {rest.length > 0 ? (
                    <div className="mini-photo-grid">
                      {rest.slice(0, 5).map((photo) => (
                        <PhotoCard key={photo.id} photo={photo} size="compact" />
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {unknownDate.length > 0 ? (
        <section className="timeline-year timeline-year--unknown">
          <div className="timeline-year__heading">
            <h2>날짜 확인 필요</h2>
            <span>{unknownDate.length}장</span>
          </div>
          <div className="photo-grid">
            {unknownDate.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
