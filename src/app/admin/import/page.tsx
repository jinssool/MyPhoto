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
  missing_code: "Google OAuth callback에 authorization code가 없습니다.",
  invalid_state: "Google OAuth state 값이 예상과 다릅니다.",
  oauth_not_configured: "Google OAuth 환경변수가 아직 설정되지 않았습니다.",
  supabase_not_configured: "Supabase 환경변수가 없어 연결 정보를 저장하지 못했습니다.",
  oauth_failed: "Google OAuth token 교환 또는 연결 정보 저장에 실패했습니다."
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
        title="Google Drive 연결 준비"
        description="이번 단계는 Google Drive 읽기 전용 OAuth 연결만 준비합니다. 폴더 스캔과 사진 가져오기는 아직 실행하지 않습니다."
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
          <li>앱 역할: 사진을 보기 쉽게 보여주는 가족 앨범 UI</li>
          <li>Drive 삭제, 이동, 이름 변경 기능: 없음</li>
          <li>Drive 접근 범위: 읽기 전용</li>
          <li>Supabase 연결: {supabaseConfigured ? "환경변수 설정됨" : "환경변수 없음, mock fallback"}</li>
          <li>Google Drive 연결 상태: {formatConnectionStatus(driveConnection?.status)}</li>
          <li>연결 계정: {driveConnection?.google_account_email ?? "아직 확인되지 않음"}</li>
          <li>토큰 만료 시각: {driveConnection?.token_expires_at ?? "아직 없음"}</li>
          <li>가져오기 상태: OAuth skeleton만 준비됨</li>
        </ul>
      </section>
      <section className="status-panel">
        <h2>Google Drive 연결</h2>
        <p>이 버튼은 Drive 파일 목록을 읽거나 사진을 가져오지 않습니다. OAuth 동의 후 연결 메타데이터만 저장합니다.</p>
        <a href="/api/google/drive/oauth/start">Google Drive 연결하기</a>
      </section>
    </div>
  );
}
