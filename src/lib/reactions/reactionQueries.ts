import { getPhotoById } from "@/data/mockPhotos";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReactionRow, ReactionType } from "@/types/database";

export async function addReaction(
  familyId: string,
  photoId: string,
  reactionType: ReactionType
): Promise<ReactionRow | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    const photo = getPhotoById(photoId);
    if (!photo) return null;

    return {
      id: `mock-reaction-${photoId}-${reactionType}`,
      family_id: familyId,
      photo_id: photoId,
      reaction_type: reactionType,
      count: photo.reactionCount + 1,
      created_at: new Date(0).toISOString(),
      updated_at: new Date(0).toISOString()
    };
  }

  const { data: existing, error: selectError } = await supabase
    .from("reactions")
    .select("*")
    .eq("family_id", familyId)
    .eq("photo_id", photoId)
    .eq("reaction_type", reactionType)
    .maybeSingle();

  if (selectError) throw selectError;

  const nextCount = (existing?.count ?? 0) + 1;
  const mutation = existing
    ? supabase
        .from("reactions")
        .update({ count: nextCount })
        .eq("family_id", familyId)
        .eq("photo_id", photoId)
        .eq("reaction_type", reactionType)
        .select("*")
        .single()
    : supabase
        .from("reactions")
        .insert({ family_id: familyId, photo_id: photoId, reaction_type: reactionType, count: nextCount })
        .select("*")
        .single();

  const { data, error } = await mutation;
  if (error) throw error;

  const { data: photo, error: photoError } = await supabase
    .from("photos")
    .select("reaction_count")
    .eq("family_id", familyId)
    .eq("id", photoId)
    .maybeSingle();

  if (photoError) throw photoError;

  if (photo) {
    const { error: updatePhotoError } = await supabase
      .from("photos")
      .update({ reaction_count: photo.reaction_count + 1 })
      .eq("family_id", familyId)
      .eq("id", photoId);

    if (updatePhotoError) throw updatePhotoError;
  }

  return data;
}
