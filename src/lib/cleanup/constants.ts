import type { CleanupCandidateStatus } from "@/types/database";

export const REVIEWABLE_CLEANUP_STATUSES = ["pending", "review_later"] satisfies CleanupCandidateStatus[];
