import Link from "next/link";

import type { MemoryPhoto } from "@/types/photo";
import { getDisplayDate, getPlaceDisplayName } from "@/data/mockPhotos";

type PhotoCardProps = {
  photo: MemoryPhoto;
  size?: "standard" | "large" | "compact";
  showCaption?: boolean;
};

export function PhotoCard({ photo, size = "standard", showCaption = false }: PhotoCardProps) {
  const description = showCaption && photo.caption ? photo.caption : getPlaceDisplayName(photo.placeName);

  return (
    <Link className={`photo-card photo-card--${size}`} href={`/photos/${photo.id}`}>
      <img src={photo.thumbnailUrl} alt={photo.title} loading="lazy" />
      <div className="photo-card__body">
        <span className="photo-card__eyebrow">{getDisplayDate(photo)}</span>
        <h3>{photo.title}</h3>
        <p>{description}</p>
        <span className="photo-card__meta">가족 반응 {photo.reactionCount}개</span>
      </div>
    </Link>
  );
}
