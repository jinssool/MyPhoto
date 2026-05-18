import type { CleanupReason, PhotoDatePrecision, PhotoVisibilityState } from "@/types/photo";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type DateSource = "exif" | "filename" | "drive_created" | "manual" | "unknown";

export type LocationPrecision = "exact" | "approximate" | "hidden" | "unknown";

export type ImportJobStatus = "pending" | "running" | "completed" | "failed" | "canceled";

export type CleanupCandidateStatus = "pending" | "kept" | "hidden" | "excluded" | "review_later" | "resolved";

export type ReactionType = "like" | "heart" | "funny" | "miss" | "pretty" | "see_again";

type RowTimestamps = {
  created_at: string;
  updated_at?: string;
};

export type FamilyRow = RowTimestamps & {
  id: string;
  name: string;
};

export type DriveConnectionRow = RowTimestamps & {
  id: string;
  family_id: string;
  google_account_email: string | null;
  access_token_encrypted: string | null;
  refresh_token_encrypted: string | null;
  token_expires_at: string | null;
  drive_folder_id: string | null;
  drive_folder_name: string | null;
  status: "disconnected" | "active" | "error" | "revoked";
  last_synced_at: string | null;
};

export type ImportJobRow = {
  id: string;
  family_id: string;
  drive_connection_id: string | null;
  status: ImportJobStatus;
  source_folder_id: string | null;
  total_count: number;
  imported_count: number;
  skipped_count: number;
  failed_count: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type PlaceRow = RowTimestamps & {
  id: string;
  family_id: string;
  name: string;
  display_name: string;
  country: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  location_precision: LocationPrecision;
  is_sensitive: boolean;
  photo_count: number;
};

export type EventRow = RowTimestamps & {
  id: string;
  family_id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  date_precision: PhotoDatePrecision;
  cover_photo_id: string | null;
  place_id: string | null;
  event_type: string | null;
  photo_count: number;
};

export type PhotoRow = RowTimestamps & {
  id: string;
  family_id: string;
  source: "google_drive";
  drive_file_id: string;
  drive_folder_id: string | null;
  drive_web_view_link: string | null;
  drive_web_content_link: string | null;
  drive_thumbnail_link: string | null;
  title: string | null;
  caption: string | null;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  taken_at: string | null;
  date_source: DateSource;
  date_precision: PhotoDatePrecision;
  approximate_date_label: string | null;
  latitude: number | null;
  longitude: number | null;
  location_precision: LocationPrecision;
  place_id: string | null;
  event_id: string | null;
  visibility_state: PhotoVisibilityState;
  quality_score: number | null;
  blur_score: number | null;
  is_screenshot_candidate: boolean;
  is_document_candidate: boolean;
  perceptual_hash: string | null;
  duplicate_group_id: string | null;
  favorite_count: number;
  reaction_count: number;
};

export type PersonClusterRow = RowTimestamps & {
  id: string;
  family_id: string;
  display_name: string;
  relation_label: string | null;
  cover_photo_id: string | null;
  is_hidden: boolean;
  photo_count: number;
};

export type PersonPhotoRow = {
  id: string;
  family_id: string;
  person_cluster_id: string;
  photo_id: string;
  source: "manual" | "import";
  confidence: number | null;
  created_at: string;
};

export type ReactionRow = RowTimestamps & {
  id: string;
  family_id: string;
  photo_id: string;
  reaction_type: ReactionType;
  count: number;
};

export type CleanupCandidateRow = RowTimestamps & {
  id: string;
  family_id: string;
  photo_id: string;
  candidate_type: CleanupReason;
  reason: string | null;
  confidence: number | null;
  status: CleanupCandidateStatus;
};

export type Database = {
  public: {
    Tables: {
      families: {
        Row: FamilyRow;
        Insert: Omit<Partial<FamilyRow>, "created_at" | "updated_at"> & Pick<FamilyRow, "name">;
        Update: Partial<Omit<FamilyRow, "id" | "created_at">>;
        Relationships: [];
      };
      drive_connections: {
        Row: DriveConnectionRow;
        Insert: Omit<Partial<DriveConnectionRow>, "created_at" | "updated_at"> & Pick<DriveConnectionRow, "family_id">;
        Update: Partial<Omit<DriveConnectionRow, "id" | "family_id" | "created_at">>;
        Relationships: [];
      };
      import_jobs: {
        Row: ImportJobRow;
        Insert: Omit<Partial<ImportJobRow>, "created_at"> & Pick<ImportJobRow, "family_id">;
        Update: Partial<Omit<ImportJobRow, "id" | "family_id" | "created_at">>;
        Relationships: [];
      };
      places: {
        Row: PlaceRow;
        Insert: Omit<Partial<PlaceRow>, "created_at" | "updated_at"> & Pick<PlaceRow, "family_id" | "name" | "display_name">;
        Update: Partial<Omit<PlaceRow, "id" | "family_id" | "created_at">>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Omit<Partial<EventRow>, "created_at" | "updated_at"> & Pick<EventRow, "family_id" | "title">;
        Update: Partial<Omit<EventRow, "id" | "family_id" | "created_at">>;
        Relationships: [];
      };
      photos: {
        Row: PhotoRow;
        Insert: Omit<Partial<PhotoRow>, "created_at" | "updated_at"> & Pick<PhotoRow, "family_id" | "drive_file_id" | "filename">;
        Update: Partial<Omit<PhotoRow, "id" | "family_id" | "created_at">>;
        Relationships: [];
      };
      person_clusters: {
        Row: PersonClusterRow;
        Insert: Omit<Partial<PersonClusterRow>, "created_at" | "updated_at"> & Pick<PersonClusterRow, "family_id" | "display_name">;
        Update: Partial<Omit<PersonClusterRow, "id" | "family_id" | "created_at">>;
        Relationships: [];
      };
      person_photos: {
        Row: PersonPhotoRow;
        Insert: Omit<Partial<PersonPhotoRow>, "created_at"> & Pick<PersonPhotoRow, "family_id" | "person_cluster_id" | "photo_id">;
        Update: Partial<Omit<PersonPhotoRow, "id" | "family_id" | "created_at">>;
        Relationships: [];
      };
      reactions: {
        Row: ReactionRow;
        Insert: Omit<Partial<ReactionRow>, "created_at" | "updated_at"> & Pick<ReactionRow, "family_id" | "photo_id" | "reaction_type">;
        Update: Partial<Omit<ReactionRow, "id" | "family_id" | "photo_id" | "reaction_type" | "created_at">>;
        Relationships: [];
      };
      cleanup_candidates: {
        Row: CleanupCandidateRow;
        Insert: Omit<Partial<CleanupCandidateRow>, "created_at" | "updated_at"> &
          Pick<CleanupCandidateRow, "family_id" | "photo_id" | "candidate_type">;
        Update: Partial<Omit<CleanupCandidateRow, "id" | "family_id" | "photo_id" | "candidate_type" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
