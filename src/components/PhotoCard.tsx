import Link from "next/link";

import type { MemoryPhoto } from "@/types/photo";

type PhotoCardProps = {
  photo: MemoryPhoto;
  size?: "standard" | "large";
};

export function PhotoCard({ photo, size = "standard" }: PhotoCardProps) {
  return (
    <Link className={`photo-card photo-card--${size}`} href={`/photos/${photo.id}`}>
      <img src={photo.thumbnailUrl} alt={photo.title} loading="lazy" />
      <div className="photo-card__body">
        <span className="photo-card__eyebrow">{photo.approximateDateLabel ?? photo.takenAt ?? "Date unknown"}</span>
        <h3>{photo.title}</h3>
        <p>{photo.placeName}</p>
        <span className="photo-card__meta">{photo.reactionCount} family reactions</span>
      </div>
    </Link>
  );
}
