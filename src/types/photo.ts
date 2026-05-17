export type PhotoVisibilityState = "active" | "hidden" | "excluded" | "trash_candidate";

export type PhotoDatePrecision = "exact" | "day" | "month" | "year" | "decade" | "unknown";

export type MemoryPhoto = {
  id: string;
  title: string;
  caption: string;
  filename: string;
  thumbnailUrl: string;
  imageUrl: string;
  takenAt: string | null;
  approximateDateLabel?: string;
  datePrecision: PhotoDatePrecision;
  placeName: string;
  people: string[];
  eventName?: string;
  year: number | null;
  month: number | null;
  reactionCount: number;
  visibilityState: PhotoVisibilityState;
  cleanupReasons: string[];
};

export type MemoryAlbum = {
  id: string;
  title: string;
  subtitle: string;
  coverPhotoId: string;
  photoCount: number;
};
