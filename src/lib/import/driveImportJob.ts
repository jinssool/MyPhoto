import "server-only";

import { getValidDriveAccessToken } from "@/lib/drive/driveConnectionQueries";
import { type ImportCandidate, listDriveImageFiles } from "@/lib/drive/driveApi";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { CleanupCandidateInsert, DriveImportJobSummary, DriveImportParams, PhotoImportUpsert } from "./driveImportTypes";

function getCandidateTakenAt(candidate: ImportCandidate) {
  if (!candidate.takenAtCandidate) return null;

  const parsed = Date.parse(candidate.takenAtCandidate);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

function isScreenshotCandidate(candidate: ImportCandidate) {
  const filename = candidate.filename.toLowerCase();

  return filename.includes("screenshot") || filename.includes("screen shot");
}

function isDocumentCandidate(candidate: ImportCandidate) {
  const filename = candidate.filename.toLowerCase();

  return filename.includes("receipt") || filename.includes("document") || filename.includes("scan") || filename.includes("ticket");
}

export function mapImportCandidateToPhotoUpsert(
  candidate: ImportCandidate,
  familyId: string,
  folderId: string
): PhotoImportUpsert {
  const takenAt = getCandidateTakenAt(candidate);
  const dateSource = takenAt ? candidate.dateSource : "unknown";

  return {
    family_id: familyId,
    source: "google_drive",
    drive_file_id: candidate.driveFileId,
    drive_folder_id: folderId,
    drive_web_view_link: candidate.webViewLink,
    drive_web_content_link: candidate.webContentLink,
    drive_thumbnail_link: candidate.thumbnailLink,
    filename: candidate.filename,
    mime_type: candidate.mimeType,
    size_bytes: candidate.sizeBytes,
    width: candidate.width,
    height: candidate.height,
    taken_at: takenAt,
    date_source: dateSource,
    date_precision: takenAt ? "exact" : "unknown",
    latitude: candidate.latitude,
    longitude: candidate.longitude,
    location_precision: candidate.latitude != null && candidate.longitude != null ? "exact" : "unknown",
    visibility_state: "active",
    is_screenshot_candidate: isScreenshotCandidate(candidate),
    is_document_candidate: isDocumentCandidate(candidate)
  };
}

function getCleanupReasons(candidate: ImportCandidate): Array<{ type: CleanupCandidateInsert["candidate_type"]; reason: string }> {
  const reasons: Array<{ type: CleanupCandidateInsert["candidate_type"]; reason: string }> = [];

  if (isScreenshotCandidate(candidate)) {
    reasons.push({
      type: "screenshot_candidate",
      reason: "Filename or MIME type looks like a screenshot."
    });
  }

  if (!getCandidateTakenAt(candidate)) {
    reasons.push({
      type: "unknown_date",
      reason: "Drive metadata did not include a usable taken date."
    });
  }

  return reasons;
}

export async function createDriveImportJob(familyId: string, folderId: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const connection = await supabase
    .from("drive_connections")
    .select("id")
    .eq("family_id", familyId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (connection.error) throw connection.error;

  const { data, error } = await supabase
    .from("import_jobs")
    .insert({
      family_id: familyId,
      drive_connection_id: connection.data?.id ?? null,
      status: "running",
      source_folder_id: folderId,
      total_count: 0,
      imported_count: 0,
      skipped_count: 0,
      failed_count: 0,
      started_at: new Date().toISOString()
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

async function completeDriveImportJob(
  jobId: string,
  familyId: string,
  summary: Omit<DriveImportJobSummary, "jobId" | "familyId" | "folderId" | "status">
) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("import_jobs")
    .update({
      status: "completed",
      total_count: summary.totalCount,
      imported_count: summary.importedCount,
      skipped_count: summary.skippedCount,
      failed_count: summary.failedCount,
      completed_at: new Date().toISOString()
    })
    .eq("family_id", familyId)
    .eq("id", jobId);

  if (error) throw error;
}

async function failDriveImportJob(jobId: string, familyId: string, message: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) return;

  await supabase
    .from("import_jobs")
    .update({
      status: "failed",
      failed_count: 1,
      error_message: message,
      completed_at: new Date().toISOString()
    })
    .eq("family_id", familyId)
    .eq("id", jobId);
}

async function upsertPhotosFromCandidates(familyId: string, folderId: string, candidates: ImportCandidate[]) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  if (candidates.length === 0) {
    return [];
  }

  const upserts = candidates.map((candidate) => mapImportCandidateToPhotoUpsert(candidate, familyId, folderId));
  const { data, error } = await supabase
    .from("photos")
    .upsert(upserts, { onConflict: "family_id,drive_file_id" })
    .select("id, drive_file_id");

  if (error) throw error;

  return data ?? [];
}

async function createCleanupCandidates(familyId: string, importedPhotos: Array<{ id: string; drive_file_id: string }>, candidates: ImportCandidate[]) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const candidatesByDriveId = new Map(candidates.map((candidate) => [candidate.driveFileId, candidate]));
  const cleanupInserts = importedPhotos.flatMap((photo) => {
    const candidate = candidatesByDriveId.get(photo.drive_file_id);
    if (!candidate) return [];

    return getCleanupReasons(candidate).map((reason): CleanupCandidateInsert => ({
      family_id: familyId,
      photo_id: photo.id,
      candidate_type: reason.type,
      reason: reason.reason,
      confidence: null,
      status: "pending"
    }));
  });

  if (cleanupInserts.length === 0) {
    return 0;
  }

  const { error } = await supabase
    .from("cleanup_candidates")
    .upsert(cleanupInserts, { onConflict: "family_id,photo_id,candidate_type" });

  if (error) throw error;

  return cleanupInserts.length;
}

export async function runDriveFolderImport({ familyId, folderId, pageSize }: DriveImportParams): Promise<DriveImportJobSummary> {
  const job = await createDriveImportJob(familyId, folderId);

  try {
    const accessToken = await getValidDriveAccessToken(familyId);

    if (!accessToken) {
      throw new Error("Google Drive is not connected.");
    }

    const preview = await listDriveImageFiles({
      accessToken,
      folderId,
      pageSize
    });
    const importedPhotos = await upsertPhotosFromCandidates(familyId, folderId, preview.candidates);
    await createCleanupCandidates(familyId, importedPhotos, preview.candidates);

    const summary = {
      totalCount: preview.candidates.length,
      importedCount: importedPhotos.length,
      skippedCount: Math.max(preview.candidates.length - importedPhotos.length, 0),
      failedCount: 0
    };

    await completeDriveImportJob(job.id, familyId, summary);

    return {
      jobId: job.id,
      familyId,
      folderId,
      status: "completed",
      ...summary
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Drive import failed.";
    await failDriveImportJob(job.id, familyId, message);
    throw error;
  }
}
