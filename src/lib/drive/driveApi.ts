import "server-only";

const DRIVE_FILES_URL = "https://www.googleapis.com/drive/v3/files";
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

type DriveImageLocation = {
  latitude?: number;
  longitude?: number;
};

type DriveImageMediaMetadata = {
  width?: number;
  height?: number;
  time?: string;
  location?: DriveImageLocation;
};

export type DriveImageFile = {
  id?: string;
  name?: string;
  mimeType?: string;
  size?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  imageMediaMetadata?: DriveImageMediaMetadata;
  createdTime?: string;
  modifiedTime?: string;
  parents?: string[];
};

export type ImportCandidate = {
  driveFileId: string;
  filename: string;
  mimeType: string | null;
  sizeBytes: number | null;
  thumbnailLink: string | null;
  webViewLink: string | null;
  webContentLink: string | null;
  width: number | null;
  height: number | null;
  takenAtCandidate: string | null;
  dateSource: "exif" | "drive_created" | "unknown";
  latitude: number | null;
  longitude: number | null;
};

export type DriveImageFilesPage = {
  candidates: ImportCandidate[];
  nextPageToken: string | null;
};

type DriveFilesResponse = {
  files?: DriveImageFile[];
  nextPageToken?: string;
  error?: {
    code?: number;
    message?: string;
  };
};

export class DriveApiError extends Error {
  status: number;

  constructor(status: number) {
    super(`Google Drive folder preview failed with status ${status}`);
    this.name = "DriveApiError";
    this.status = status;
  }
}

type ListDriveImageFilesParams = {
  accessToken: string;
  folderId: string;
  pageToken?: string | null;
  pageSize?: number;
};

function quoteDriveQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function getSafePageSize(pageSize: number | undefined) {
  if (!pageSize || Number.isNaN(pageSize)) return DEFAULT_PAGE_SIZE;

  return Math.min(Math.max(Math.trunc(pageSize), 1), MAX_PAGE_SIZE);
}

function parseSize(size: string | undefined) {
  if (!size) return null;

  const parsed = Number(size);
  return Number.isFinite(parsed) ? parsed : null;
}

function getTakenAtCandidate(file: DriveImageFile) {
  if (file.imageMediaMetadata?.time) {
    return {
      takenAtCandidate: file.imageMediaMetadata.time,
      dateSource: "exif" as const
    };
  }

  if (file.createdTime) {
    return {
      takenAtCandidate: file.createdTime,
      dateSource: "drive_created" as const
    };
  }

  return {
    takenAtCandidate: null,
    dateSource: "unknown" as const
  };
}

export function normalizeDriveFileToImportCandidate(file: DriveImageFile): ImportCandidate | null {
  if (!file.id || !file.name) return null;

  const { takenAtCandidate, dateSource } = getTakenAtCandidate(file);

  return {
    driveFileId: file.id,
    filename: file.name,
    mimeType: file.mimeType ?? null,
    sizeBytes: parseSize(file.size),
    thumbnailLink: file.thumbnailLink ?? null,
    webViewLink: file.webViewLink ?? null,
    webContentLink: file.webContentLink ?? null,
    width: file.imageMediaMetadata?.width ?? null,
    height: file.imageMediaMetadata?.height ?? null,
    takenAtCandidate,
    dateSource,
    latitude: file.imageMediaMetadata?.location?.latitude ?? null,
    longitude: file.imageMediaMetadata?.location?.longitude ?? null
  };
}

export async function listDriveImageFiles({
  accessToken,
  folderId,
  pageToken,
  pageSize
}: ListDriveImageFilesParams): Promise<DriveImageFilesPage> {
  const url = new URL(DRIVE_FILES_URL);
  const quotedFolderId = quoteDriveQueryValue(folderId);

  url.searchParams.set("q", `'${quotedFolderId}' in parents and mimeType contains 'image/' and trashed = false`);
  url.searchParams.set(
    "fields",
    "nextPageToken,files(id,name,mimeType,size,thumbnailLink,webViewLink,webContentLink,imageMediaMetadata,createdTime,modifiedTime,parents)"
  );
  url.searchParams.set("pageSize", String(getSafePageSize(pageSize)));
  url.searchParams.set("supportsAllDrives", "true");
  url.searchParams.set("includeItemsFromAllDrives", "true");

  if (pageToken) {
    url.searchParams.set("pageToken", pageToken);
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: "application/json"
    }
  });
  const body = (await response.json()) as DriveFilesResponse;

  if (!response.ok) {
    throw new DriveApiError(response.status);
  }

  return {
    candidates: (body.files ?? []).flatMap((file) => {
      const candidate = normalizeDriveFileToImportCandidate(file);
      return candidate ? [candidate] : [];
    }),
    nextPageToken: body.nextPageToken ?? null
  };
}
