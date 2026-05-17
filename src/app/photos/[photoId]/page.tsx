import Link from "next/link";
import { notFound } from "next/navigation";

import { getPhotoById, mockPhotos } from "@/data/mockPhotos";

type PhotoDetailPageProps = {
  params: Promise<{
    photoId: string;
  }>;
};

export function generateStaticParams() {
  return mockPhotos.map((photo) => ({ photoId: photo.id }));
}

export default async function PhotoDetailPage({ params }: PhotoDetailPageProps) {
  const { photoId } = await params;
  const photo = getPhotoById(photoId);

  if (!photo) {
    notFound();
  }

  return (
    <article className="photo-detail">
      <div className="photo-detail__image">
        <img src={photo.imageUrl} alt={photo.title} />
      </div>
      <div className="photo-detail__panel">
        <Link href="/" className="text-link">
          Back to home
        </Link>
        <span className="photo-card__eyebrow">{photo.approximateDateLabel ?? photo.takenAt ?? "Date unknown"}</span>
        <h1>{photo.title}</h1>
        <p>{photo.caption}</p>
        <dl>
          <div>
            <dt>Place</dt>
            <dd>{photo.placeName}</dd>
          </div>
          <div>
            <dt>People</dt>
            <dd>{photo.people.join(", ")}</dd>
          </div>
          <div>
            <dt>Event</dt>
            <dd>{photo.eventName ?? "Not grouped yet"}</dd>
          </div>
          <div>
            <dt>Family reactions</dt>
            <dd>{photo.reactionCount}</dd>
          </div>
        </dl>
        <div className="button-row">
          <button type="button">Add reaction</button>
          <button type="button">Download</button>
          <button type="button">Open original</button>
        </div>
        <p className="quiet-note">Original Google Drive files are not changed by this mock UI.</p>
      </div>
    </article>
  );
}
