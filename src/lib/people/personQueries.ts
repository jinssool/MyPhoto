import { getPeopleGroups as getMockPeopleGroups, getPersonDisplayName } from "@/data/mockPhotos";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { mapPhotoRowsWithRelations } from "@/lib/photos/photoQueries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MemoryPhoto } from "@/types/photo";

export type PersonPhotoGroup = {
  id: string | null;
  name: string;
  displayName: string;
  relationLabel: string | null;
  photoCount: number;
  photos: MemoryPhoto[];
};

export async function getPeople(familyId = MOCK_FAMILY_ID): Promise<PersonPhotoGroup[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getMockPeopleGroups().map((group) => ({
      id: null,
      name: group.name,
      displayName: getPersonDisplayName(group.name),
      relationLabel: null,
      photoCount: group.photos.length,
      photos: group.photos
    }));
  }

  const { data: people, error } = await supabase
    .from("person_clusters")
    .select("*")
    .eq("family_id", familyId)
    .eq("is_hidden", false)
    .order("photo_count", { ascending: false })
    .order("display_name", { ascending: true });

  if (error) throw error;

  const personIds = people?.map((person) => person.id) ?? [];
  const { data: personPhotos, error: personPhotosError } = personIds.length
    ? await supabase
        .from("person_photos")
        .select("person_cluster_id,photo_id")
        .eq("family_id", familyId)
        .in("person_cluster_id", personIds)
    : { data: [], error: null };

  if (personPhotosError) throw personPhotosError;

  const photoIds = [...new Set(personPhotos?.map((link) => link.photo_id) ?? [])];
  const { data: photos, error: photoError } = photoIds.length
    ? await supabase
        .from("photos")
        .select("*")
        .eq("family_id", familyId)
        .eq("visibility_state", "active")
        .in("id", photoIds)
        .order("taken_at", { ascending: false, nullsFirst: false })
    : { data: [], error: null };

  if (photoError) throw photoError;

  const mappedPhotos = await mapPhotoRowsWithRelations(familyId, photos ?? []);
  const photosById = new Map(mappedPhotos.map((photo) => [photo.id, photo]));

  const photosByPerson = (personPhotos ?? []).reduce<Map<string, MemoryPhoto[]>>((groups, link) => {
    const photo = photosById.get(link.photo_id);
    if (!photo) return groups;

    groups.set(link.person_cluster_id, [...(groups.get(link.person_cluster_id) ?? []), photo]);
    return groups;
  }, new Map());

  return (people ?? []).map((person) => ({
    id: person.id,
    name: person.display_name,
    displayName: person.display_name,
    relationLabel: person.relation_label,
    photoCount: person.photo_count,
    photos: photosByPerson.get(person.id) ?? []
  }));
}
