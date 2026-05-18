import { getEventDisplayName, getEventGroups as getMockEventGroups } from "@/data/mockPhotos";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { mapPhotoRowsWithRelations } from "@/lib/photos/photoQueries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PhotoDatePrecision, MemoryPhoto } from "@/types/photo";

export type EventPhotoGroup = {
  id: string | null;
  name: string;
  displayName: string;
  dateLabel: string;
  datePrecision: PhotoDatePrecision | null;
  photoCount: number;
  photos: MemoryPhoto[];
};

function formatEventDateLabel(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "날짜 확인 필요";
  if (!endDate || startDate === endDate) return startDate ?? endDate ?? "날짜 확인 필요";
  return `${startDate} - ${endDate}`;
}

export async function getEvents(familyId = MOCK_FAMILY_ID): Promise<EventPhotoGroup[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getMockEventGroups().map((group) => ({
      id: null,
      name: group.name,
      displayName: getEventDisplayName(group.name),
      dateLabel: group.dateLabel,
      datePrecision: null,
      photoCount: group.photos.length,
      photos: group.photos
    }));
  }

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("family_id", familyId)
    .order("start_date", { ascending: false, nullsFirst: false })
    .order("photo_count", { ascending: false });

  if (error) throw error;

  const eventIds = events?.map((event) => event.id) ?? [];
  const { data: photos, error: photoError } = eventIds.length
    ? await supabase
        .from("photos")
        .select("*")
        .eq("family_id", familyId)
        .eq("visibility_state", "active")
        .in("event_id", eventIds)
        .order("taken_at", { ascending: false, nullsFirst: false })
    : { data: [], error: null };

  if (photoError) throw photoError;

  const mappedPhotos = await mapPhotoRowsWithRelations(familyId, photos ?? []);
  const photosByEvent = mappedPhotos.reduce<Map<string, MemoryPhoto[]>>((groups, photo) => {
    const dbPhoto = photos?.find((row) => row.id === photo.id);
    if (!dbPhoto?.event_id) return groups;

    groups.set(dbPhoto.event_id, [...(groups.get(dbPhoto.event_id) ?? []), photo]);
    return groups;
  }, new Map());

  return (events ?? []).map((event) => ({
    id: event.id,
    name: event.title,
    displayName: getEventDisplayName(event.title),
    dateLabel: formatEventDateLabel(event.start_date, event.end_date),
    datePrecision: event.date_precision,
    photoCount: event.photo_count,
    photos: photosByEvent.get(event.id) ?? []
  }));
}
