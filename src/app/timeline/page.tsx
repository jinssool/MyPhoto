import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getTimelineGroups } from "@/data/mockPhotos";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function TimelinePage() {
  const { years, unknownDate } = getTimelineGroups();

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Timeline"
        title="Browse by year and month"
        description="Photos are grouped by taken date, with unknown dates kept safely separate for later review."
      />

      {years.map((yearGroup) => (
        <section className="timeline-year" key={yearGroup.year}>
          <div className="timeline-year__heading">
            <h2>{yearGroup.year}</h2>
            <span>{yearGroup.months.reduce((count, month) => count + month.photos.length, 0)} photos</span>
          </div>
          <div className="timeline-months">
            {yearGroup.months.map((monthGroup) => {
              const [cover, ...rest] = monthGroup.photos;
              return (
                <article className="timeline-month" key={`${yearGroup.year}-${monthGroup.month}`}>
                  <div className="timeline-month__heading">
                    <strong>{monthNames[monthGroup.month - 1]}</strong>
                    <span>{monthGroup.photos.length} photos</span>
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
            <h2>Date unknown</h2>
            <span>{unknownDate.length} photos to review</span>
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
