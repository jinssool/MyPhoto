import { NextRequest, NextResponse } from "next/server";

import { getDecryptedDriveTokens } from "@/lib/drive/driveConnectionQueries";
import { DriveApiError, listDriveImageFiles } from "@/lib/drive/driveApi";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function parsePageSize(value: string | null) {
  if (!value) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  const folderId = request.nextUrl.searchParams.get("folderId")?.trim();
  const pageToken = request.nextUrl.searchParams.get("pageToken");
  const pageSize = parsePageSize(request.nextUrl.searchParams.get("pageSize"));

  if (!folderId) {
    return jsonError(400, "missing_folder_id", "folderId query parameter is required.");
  }

  try {
    const tokens = await getDecryptedDriveTokens(MOCK_FAMILY_ID);

    if (!tokens?.accessToken) {
      return jsonError(401, "drive_tokens_missing", "Connect Google Drive again after configuring token encryption.");
    }

    const preview = await listDriveImageFiles({
      accessToken: tokens.accessToken,
      folderId,
      pageToken,
      pageSize
    });

    return NextResponse.json({
      folderId,
      previewOnly: true,
      imported: false,
      count: preview.candidates.length,
      nextPageToken: preview.nextPageToken,
      candidates: preview.candidates
    });
  } catch (error) {
    if (error instanceof DriveApiError && (error.status === 401 || error.status === 403)) {
      return jsonError(401, "drive_tokens_invalid", "Google Drive access is unavailable. Reconnect Google Drive.");
    }

    if (!(error instanceof DriveApiError)) {
      return jsonError(401, "drive_tokens_invalid", "Stored Drive tokens could not be used. Reconnect Google Drive.");
    }

    return jsonError(502, "drive_preview_failed", "Could not preview this Drive folder.");
  }
}
