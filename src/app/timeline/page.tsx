import { PhotoCard } from "@/components/PhotoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getPhotosByYear } from "@/data/mockPhotos";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function TimelinePage() {
  const groups = getPhotosByYear();
  const orderedYears = Object.keys(groups).sort((a, b) => {
    if (a === "Date unknown") return 1;
    if (b === "Date unknown") return -1;
    return Number(b) - Number(a);
  });

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Timeline"
        title="Browse by year and month"
        description="Mock photos are grouped by taken date, with unknown dates kept separate."
      />
      {orderedYears.map((year) => (
        <section className="timeline-year" key={year}>
          <h2>{year}</h2>
          <div className="timeline-months">
            {groups[year].map((photo) => (
              <div className="timeline-month" key={photo.id}>
                <strong>{photo.month ? monthNames[photo.month - 1] : "Unknown"}</strong>
                <PhotoCard photo={photo} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
