import { getPlaceDisplayName, getPlaceGroups as getMockPlaceGroups } from "@/data/mockPhotos";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { mapPhotoRowsWithRelations } from "@/lib/photos/photoQueries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MemoryPhoto } from "@/types/photo";

export type PlacePhotoGroup = {
  id: string | null;
  name: string;
  displayName: string;
  photoCount: number;
  photos: MemoryPhoto[];
};

export async function getPlaces(familyId = MOCK_FAMILY_ID): Promise<PlacePhotoGroup[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getMockPlaceGroups().map((group) => ({
      id: null,
      name: group.name,
      displayName: getPlaceDisplayName(group.name),
      photoCount: group.photos.length,
      photos: group.photos
    }));
  }

  const { data: places, error } = await supabase
    .from("places")
    .select("*")
    .eq("family_id", familyId)
    .order("photo_count", { ascending: false })
    .order("display_name", { ascending: true });

  if (error) throw error;

  const placeIds = places?.map((place) => place.id) ?? [];
  const { data: photos, error: photoError } = placeIds.length
    ? await supabase
        .from("photos")
        .select("*")
        .eq("family_id", familyId)
        .eq("visibility_state", "active")
        .in("place_id", placeIds)
        .order("taken_at", { ascending: false, nullsFirst: false })
    : { data: [], error: null };

  if (photoError) throw photoError;

  const mappedPhotos = await mapPhotoRowsWithRelations(familyId, photos ?? []);
  const photosByPlace = mappedPhotos.reduce<Map<string, MemoryPhoto[]>>((groups, photo) => {
    const dbPhoto = photos?.find((row) => row.id === photo.id);
    if (!dbPhoto?.place_id) return groups;

    groups.set(dbPhoto.place_id, [...(groups.get(dbPhoto.place_id) ?? []), photo]);
    return groups;
  }, new Map());

  return (places ?? []).map((place) => ({
    id: place.id,
    name: place.name,
    displayName: place.display_name,
    photoCount: place.photo_count,
    photos: photosByPlace.get(place.id) ?? []
  }));
}
