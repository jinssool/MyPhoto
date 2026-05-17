import Link from "next/link";
import { notFound } from "next/navigation";

import { cleanupReasonLabels, getAdjacentPhotos, getDisplayDate, getPhotoById, mockPhotos } from "@/data/mockPhotos";

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

  const { previousPhoto, nextPhoto } = getAdjacentPhotos(photo.id);

  return (
    <article className="photo-detail">
      <div className="photo-detail__image">
        <img src={photo.imageUrl} alt={photo.title} />
      </div>
      <div className="photo-detail__panel">
        <div className="detail-top-links">
          <Link href="/" className="text-link">
            Home
          </Link>
          <Link href="/timeline" className="text-link">
            Timeline
          </Link>
        </div>
        <span className="photo-card__eyebrow">{getDisplayDate(photo)}</span>
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
          <div>
            <dt>Filename</dt>
            <dd>{photo.filename}</dd>
          </div>
        </dl>
        {photo.cleanupReasons.length > 0 ? (
          <div className="detail-review-list">
            {photo.cleanupReasons.map((reason) => (
              <span key={reason}>{cleanupReasonLabels[reason]}</span>
            ))}
          </div>
        ) : null}
        <div className="button-row detail-actions">
          <button type="button">Add reaction</button>
          <a href={photo.downloadUrl ?? "#"}>Download</a>
          <a href={photo.originalUrl ?? "#"}>Open original</a>
          <button type="button" className="secondary-button">
            Hide in album
          </button>
          <button type="button" className="secondary-button">
            Exclude from browsing
          </button>
        </div>
        <nav className="adjacent-photos" aria-label="Photo navigation">
          {previousPhoto ? <Link href={`/photos/${previousPhoto.id}`}>Previous: {previousPhoto.title}</Link> : <span>First photo</span>}
          {nextPhoto ? <Link href={`/photos/${nextPhoto.id}`}>Next: {nextPhoto.title}</Link> : <span>Last photo</span>}
        </nav>
        <p className="quiet-note">Original Google Drive files are not changed by this mock UI.</p>
      </div>
    </article>
  );
}
