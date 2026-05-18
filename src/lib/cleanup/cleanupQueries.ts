import { getCleanupGroups as getMockCleanupGroups } from "@/data/mockPhotos";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { mapCleanupReasonLabel } from "@/lib/photos/photoMappers";
import { mapPhotoRowsWithRelations } from "@/lib/photos/photoQueries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CleanupCandidateStatus } from "@/types/database";
import type { CleanupReason, MemoryPhoto } from "@/types/photo";

export type CleanupCandidateGroup = {
  reason: CleanupReason;
  label: string;
  photos: MemoryPhoto[];
};

export async function getCleanupCandidates(familyId = MOCK_FAMILY_ID): Promise<CleanupCandidateGroup[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return Object.entries(getMockCleanupGroups()).map(([reason, photos]) => ({
      reason: reason as CleanupReason,
      label: mapCleanupReasonLabel(reason as CleanupReason),
      photos
    }));
  }

  const { data: candidates, error } = await supabase
    .from("cleanup_candidates")
    .select("*")
    .eq("family_id", familyId)
    .in("status", ["pending", "review_later"]);

  if (error) throw error;

  const photoIds = [...new Set(candidates?.map((candidate) => candidate.photo_id) ?? [])];
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

  const groups = (candidates ?? []).reduce<Map<CleanupReason, MemoryPhoto[]>>((accumulator, candidate) => {
    const photo = photosById.get(candidate.photo_id);
    if (!photo) return accumulator;

    const reason = candidate.candidate_type;
    accumulator.set(reason, [...(accumulator.get(reason) ?? []), photo]);
    return accumulator;
  }, new Map());

  return [...groups.entries()].map(([reason, groupPhotos]) => ({
    reason,
    label: mapCleanupReasonLabel(reason),
    photos: groupPhotos
  }));
}

export async function updateCleanupCandidateStatus(
  familyId: string,
  photoId: string,
  candidateType: CleanupReason,
  status: CleanupCandidateStatus
): Promise<boolean> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return true;
  }

  const { error } = await supabase
    .from("cleanup_candidates")
    .update({ status })
    .eq("family_id", familyId)
    .eq("photo_id", photoId)
    .eq("candidate_type", candidateType);

  if (error) throw error;

  return true;
}
