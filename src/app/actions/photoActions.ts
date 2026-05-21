"use server";

import { revalidatePath } from "next/cache";

import { updateCleanupCandidateStatus } from "@/lib/cleanup/cleanupQueries";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { updatePhotoVisibility } from "@/lib/photos/photoQueries";
import { addReaction } from "@/lib/reactions/reactionQueries";
import type { CleanupCandidateStatus, ReactionType } from "@/types/database";
import type { CleanupReason } from "@/types/photo";

const reactionTypes = ["like", "heart", "funny", "miss", "pretty", "see_again"] satisfies ReactionType[];
const cleanupStatuses = ["pending", "kept", "hidden", "excluded", "review_later", "resolved"] satisfies CleanupCandidateStatus[];

function assertReactionType(value: ReactionType) {
  if (!reactionTypes.includes(value)) {
    throw new Error("Unsupported reaction type.");
  }
}

function assertCleanupStatus(value: CleanupCandidateStatus) {
  if (!cleanupStatuses.includes(value)) {
    throw new Error("Unsupported cleanup status.");
  }
}

function revalidatePhotoViews(photoId: string) {
  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/cleanup");
  revalidatePath(`/photos/${photoId}`);
}

export async function addReactionAction(photoId: string, reactionType: ReactionType) {
  assertReactionType(reactionType);

  await addReaction(MOCK_FAMILY_ID, photoId, reactionType);
  revalidatePhotoViews(photoId);
}

export async function hidePhotoAction(photoId: string) {
  await updatePhotoVisibility(MOCK_FAMILY_ID, photoId, "hidden");
  revalidatePhotoViews(photoId);
}

export async function excludePhotoAction(photoId: string) {
  await updatePhotoVisibility(MOCK_FAMILY_ID, photoId, "excluded");
  revalidatePhotoViews(photoId);
}

export async function restorePhotoAction(photoId: string) {
  await updatePhotoVisibility(MOCK_FAMILY_ID, photoId, "active");
  revalidatePhotoViews(photoId);
}

export async function updateCleanupCandidateStatusAction(
  photoId: string,
  candidateType: CleanupReason,
  status: CleanupCandidateStatus
) {
  assertCleanupStatus(status);

  await updateCleanupCandidateStatus(MOCK_FAMILY_ID, photoId, candidateType, status);

  if (status === "hidden") {
    await updatePhotoVisibility(MOCK_FAMILY_ID, photoId, "hidden");
  }

  if (status === "excluded") {
    await updatePhotoVisibility(MOCK_FAMILY_ID, photoId, "excluded");
  }

  revalidatePhotoViews(photoId);
}
