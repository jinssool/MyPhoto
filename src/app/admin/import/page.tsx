import { SectionHeader } from "@/components/SectionHeader";
import { getDriveConnection } from "@/lib/drive/driveConnectionQueries";
import { MOCK_FAMILY_ID } from "@/lib/family/constants";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type ImportPageProps = {
  searchParams?: Promise<{
    drive?: string;
  }>;
};

const driveStatusMessages: Record<string, string> = {
  connected: "Google Drive 읽기 전용 연결 정보가 저장되었습니다.",
  oauth_denied: "Google Drive 연결이 취소되었습니다.",
  missing_code: "Google 연결 응답에 필요한 코드가 없습니다. 다시 연결해 주세요.",
  invalid_state: "Google 연결 확인 값이 맞지 않습니다. 다시 연결해 주세요.",
  oauth_not_configured: "Google OAuth 환경변수가 아직 설정되지 않았습니다.",
  token_encryption_not_configured: "TOKEN_ENCRYPTION_KEY가 없어 Drive 토큰을 안전하게 저장하지 못했습니다.",
  supabase_not_configured: "Supabase 환경변수가 없어 연결 정보를 저장하지 못했습니다.",
  oauth_failed: "Google Drive 연결 정보를 저장하지 못했습니다. 설정을 확인한 뒤 다시 시도해 주세요."
};

function formatConnectionStatus(status: string | null | undefined) {
  if (status === "active") return "연결됨";
  if (status === "error") return "오류";
  if (status === "revoked") return "해제됨";
  return "연결 안 됨";
}

export default async function ImportPage({ searchParams }: ImportPageProps) {
  const params = await searchParams;
  const driveConnection = await getDriveConnection(MOCK_FAMILY_ID);
  const supabaseConfigured = isSupabaseConfigured();
  const statusMessage = params?.drive ? driveStatusMessages[params.drive] : null;

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="사진 가져오기"
        title="Google Drive 사진을 앨범에 연결하기"
        description="원본은 Google Drive에 그대로 두고, 우리집 앨범에는 사진을 찾고 보여주는 데 필요한 정보만 등록합니다."
      />
      {statusMessage ? (
        <section className="status-panel">
          <h2>연결 결과</h2>
          <p>{statusMessage}</p>
        </section>
      ) : null}
      <section className="status-panel">
        <h2>현재 상태</h2>
        <ul>
          <li>원본 사진 보관 위치: Google Drive</li>
          <li>우리집 앨범 역할: 가족이 사진을 보기 쉽게 정리해서 보여주기</li>
          <li>Drive 삭제, 이동, 이름 변경 기능: 없음</li>
          <li>Drive 접근 범위: 읽기 전용</li>
          <li>앨범 DB 연결: {supabaseConfigured ? "연결됨" : "연결 없음, 샘플 화면 사용 중"}</li>
          <li>Google Drive 연결 상태: {formatConnectionStatus(driveConnection?.status)}</li>
          <li>연결 계정: {driveConnection?.google_account_email ?? "아직 확인되지 않음"}</li>
          <li>토큰 만료 시각: {driveConnection?.token_expires_at ?? "아직 없음"}</li>
          <li>토큰 저장 방식: 서버에서 암호화 후 저장, 화면에는 표시하지 않음</li>
          <li>사진 가져오기 방식: 미리보기 후 메타데이터만 등록, 원본 저장 없음</li>
        </ul>
      </section>
      <section className="status-panel">
        <h2>1. Google Drive 연결</h2>
        <p>먼저 읽기 전용으로 Drive를 연결합니다. 이 단계에서는 폴더를 읽거나 사진 정보를 등록하지 않습니다.</p>
        <a href="/api/google/drive/oauth/start">Google Drive 연결하기</a>
      </section>
      <section className="status-panel">
        <h2>2. 폴더 미리보기</h2>
        <p>등록 전에 폴더 안의 이미지 정보를 먼저 확인합니다. 미리보기는 앨범 DB에 저장하지 않고, Drive 원본도 건드리지 않습니다.</p>
        <form action="/api/google/drive/folders/preview" method="get">
          <label htmlFor="folderId">미리볼 Google Drive 폴더 ID 또는 URL</label>
          <input id="folderId" name="folderId" placeholder="예: https://drive.google.com/drive/folders/1AbC..." required />
          <button type="submit">폴더 미리보기</button>
        </form>
        <p className="quiet-note">결과는 JSON으로 열립니다. 확인이 끝나면 브라우저의 뒤로 가기로 돌아와 등록을 진행하면 됩니다.</p>
      </section>
      <section className="status-panel">
        <h2>3. 앨범에 등록하기</h2>
        <p>미리본 폴더가 맞다면 사진 메타데이터만 앨범에 등록합니다. Google Drive 원본 파일은 다운로드, 이동, 삭제하지 않습니다.</p>
        <form action="/api/google/drive/folders/import" method="post">
          <label htmlFor="importFolderId">등록할 Google Drive 폴더 ID 또는 URL</label>
          <input id="importFolderId" name="folderId" placeholder="예: https://drive.google.com/drive/folders/1AbC..." required />
          <button type="submit">앨범에 사진 정보 등록</button>
        </form>
        <p className="quiet-note">등록 결과도 JSON으로 열립니다. 성공하면 <a href="/">우리집 앨범</a> 또는 <a href="/timeline">시간별 보기</a>에서 사진을 확인하세요.</p>
      </section>
    </div>
  );
}
