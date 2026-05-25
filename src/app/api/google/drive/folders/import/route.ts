import { NextRequest, NextResponse } from "next/server";

import { DriveReconnectRequiredError } from "@/lib/drive/driveConnectionQueries";
import { DriveApiError } from "@/lib/drive/driveApi";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { runDriveFolderImport } from "@/lib/import/driveImportJob";

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function normalizeFolderId(value: string | null) {
  const rawValue = value?.trim();

  if (!rawValue) return null;

  try {
    const url = new URL(rawValue);
    const folderMatch = url.pathname.match(/\/folders\/([^/?]+)/);
    const idParam = url.searchParams.get("id");

    return folderMatch?.[1] ?? idParam ?? rawValue;
  } catch {
    return rawValue;
  }
}

function parsePageSize(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function readImportRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { folderId?: unknown; pageSize?: unknown };
    return {
      folderId: typeof body.folderId === "string" ? body.folderId : null,
      pageSize: typeof body.pageSize === "number" ? body.pageSize : typeof body.pageSize === "string" ? Number(body.pageSize) : undefined
    };
  }

  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) {
    return {
      folderId: null,
      pageSize: undefined
    };
  }

  const formData = await request.formData();
  return {
    folderId: formData.get("folderId")?.toString() ?? null,
    pageSize: parsePageSize(formData.get("pageSize"))
  };
}

export async function POST(request: NextRequest) {
  const body = await readImportRequest(request);
  const folderId = normalizeFolderId(body.folderId);
  const pageSize = Number.isFinite(body.pageSize) ? body.pageSize : undefined;

  if (!folderId) {
    return jsonError(400, "missing_folder_id", "folderId is required.");
  }

  try {
    const summary = await runDriveFolderImport({
      familyId: MOCK_FAMILY_ID,
      folderId,
      pageSize
    });

    return NextResponse.json({
      imported: true,
      storedOriginals: false,
      modifiedDriveFiles: false,
      message: "사진 정보 등록이 끝났습니다. Google Drive 원본 파일은 변경되지 않았습니다.",
      nextSteps: ["우리집 앨범에서 최근 사진을 확인하세요.", "시간별 보기에서 등록된 사진이 보이는지 확인하세요."],
      links: {
        home: "/",
        timeline: "/timeline",
        import: "/admin/import"
      },
      summary
    });
  } catch (error) {
    if (error instanceof DriveReconnectRequiredError) {
      return jsonError(401, "drive_reconnect_required", "Google Drive access expired. Reconnect Google Drive.");
    }

    if (error instanceof DriveApiError && (error.status === 401 || error.status === 403)) {
      return jsonError(401, "drive_tokens_invalid", "Google Drive access is unavailable. Reconnect Google Drive.");
    }

    if (error instanceof DriveApiError && (error.status === 400 || error.status === 404)) {
      return jsonError(404, "invalid_or_inaccessible_folder", "Google Drive folder was not found or is not accessible to the connected account.");
    }

    return jsonError(500, "drive_import_failed", "Drive folder import failed before any original files were downloaded or modified.");
  }
}
