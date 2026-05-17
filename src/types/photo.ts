export type PhotoVisibilityState = "active" | "hidden" | "excluded" | "trash_candidate";

export type PhotoDatePrecision = "exact" | "day" | "month" | "year" | "decade" | "unknown";

export type CleanupReason =
  | "blurry_candidate"
  | "duplicate_candidate"
  | "screenshot_candidate"
  | "document_candidate"
  | "unknown_date"
  | "unknown_place"
  | "unknown_person";

export type MemoryPhoto = {
  id: string;
  title: string;
  caption: string;
  filename: string;
  thumbnailUrl: string;
  imageUrl: string;
  originalUrl?: string;
  downloadUrl?: string;
  takenAt: string | null;
  approximateDateLabel?: string;
  datePrecision: PhotoDatePrecision;
  placeName: string;
  people: string[];
  eventName?: string;
  eventDateLabel?: string;
  year: number | null;
  month: number | null;
  reactionCount: number;
  visibilityState: PhotoVisibilityState;
  cleanupReasons: CleanupReason[];
  duplicateGroupId?: string;
  isFeatured?: boolean;
};

export type MemoryAlbum = {
  id: string;
  title: string;
  subtitle: string;
  coverPhotoId: string;
  photoCount: number;
};
