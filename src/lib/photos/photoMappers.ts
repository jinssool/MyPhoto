import {
  cleanupReasonLabels,
  getEventDisplayName,
  getPersonDisplayName,
  getPlaceDisplayName
} from "@/data/mockPhotos";
import type {
  CleanupCandidateRow,
  EventRow,
  PersonClusterRow,
  PhotoRow,
  PlaceRow
} from "@/types/database";
import type { CleanupReason, MemoryPhoto } from "@/types/photo";

export type PhotoRelations = {
  place?: Pick<PlaceRow, "name" | "display_name"> | null;
  event?: Pick<EventRow, "title"> | null;
  people?: Array<Pick<PersonClusterRow, "display_name">>;
  cleanupCandidates?: Array<Pick<CleanupCandidateRow, "candidate_type">>;
};

function toDateParts(takenAt: string | null) {
  if (!takenAt) {
    return { year: null, month: null };
  }

  const date = new Date(takenAt);
  if (Number.isNaN(date.getTime())) {
    return { year: null, month: null };
  }

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1
  };
}

export function mapPhotoRowToMemoryPhoto(photo: PhotoRow, relations: PhotoRelations = {}): MemoryPhoto {
  const { year, month } = toDateParts(photo.taken_at);
  const placeName = relations.place?.display_name ?? relations.place?.name ?? "Place unknown";
  const eventName = relations.event?.title;
  const people = relations.people?.map((person) => person.display_name) ?? [];
  const cleanupReasons = relations.cleanupCandidates?.map((candidate) => candidate.candidate_type as CleanupReason) ?? [];
  const thumbnailUrl = photo.drive_thumbnail_link ?? "https://picsum.photos/seed/family-memory-placeholder/900/700";

  return {
    id: photo.id,
    title: photo.title ?? photo.filename,
    caption: photo.caption ?? "",
    filename: photo.filename,
    thumbnailUrl,
    imageUrl: thumbnailUrl,
    originalUrl: photo.drive_web_view_link ?? undefined,
    downloadUrl: photo.drive_web_content_link ?? undefined,
    takenAt: photo.taken_at,
    approximateDateLabel: photo.approximate_date_label ?? undefined,
    datePrecision: photo.date_precision,
    placeName,
    people: people.length > 0 ? people.map(getPersonDisplayName) : ["사람 확인 필요"],
    eventName: eventName ? getEventDisplayName(eventName) : undefined,
    year,
    month,
    reactionCount: photo.reaction_count,
    visibilityState: photo.visibility_state,
    cleanupReasons,
    duplicateGroupId: photo.duplicate_group_id ?? undefined,
    isFeatured: photo.reaction_count >= 40
  };
}

export function mapPlaceLabel(name: string) {
  return getPlaceDisplayName(name);
}

export function mapEventLabel(title: string) {
  return getEventDisplayName(title);
}

export function mapCleanupReasonLabel(reason: CleanupReason) {
  return cleanupReasonLabels[reason];
}
