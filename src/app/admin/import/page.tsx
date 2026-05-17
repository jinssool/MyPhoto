import { SectionHeader } from "@/components/SectionHeader";

export default function ImportPage() {
  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="사진 가져오기"
        title="사진 가져오기 준비 화면"
        description="아직 실제 연결은 하지 않습니다. Google Drive 연결, 사진 스캔, Supabase 저장은 다음 작업에서 다룹니다."
      />
      <section className="status-panel">
        <h2>현재 상태</h2>
        <ul>
          <li>원본 사진 보관 위치: Google Drive</li>
          <li>앱 역할: 사진을 보기 쉽게 보여주는 가족 앨범 UI</li>
          <li>Drive 삭제, 이동, 이름 변경 기능: 없음</li>
          <li>가져오기 상태: 샘플 화면만 준비됨</li>
        </ul>
      </section>
    </div>
  );
}
