import type { CleanupReason, PhotoDatePrecision } from "@/types/photo";

export type DriveImportParams = {
  familyId: string;
  folderId: string;
  pageSize?: number;
};

export type DriveImportJobSummary = {
  jobId: string;
  familyId: string;
  folderId: string;
  status: "completed" | "failed";
  totalCount: number;
  importedCount: number;
  skippedCount: number;
  failedCount: number;
};

export type PhotoImportUpsert = {
  family_id: string;
  source: "google_drive";
  drive_file_id: string;
  drive_folder_id: string;
  drive_web_view_link: string | null;
  drive_web_content_link: string | null;
  drive_thumbnail_link: string | null;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  taken_at: string | null;
  date_source: "exif" | "drive_created" | "unknown";
  date_precision: PhotoDatePrecision;
  latitude: number | null;
  longitude: number | null;
  location_precision: "exact" | "unknown";
  visibility_state: "active";
  is_screenshot_candidate: boolean;
  is_document_candidate: boolean;
};

export type CleanupCandidateInsert = {
  family_id: string;
  photo_id: string;
  candidate_type: CleanupReason;
  reason: string;
  confidence: number | null;
  status: "pending";
};
