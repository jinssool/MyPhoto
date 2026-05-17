import { SectionHeader } from "@/components/SectionHeader";

export default function SettingsPage() {
  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="설정"
        title="가족 앨범 설정"
        description="지금은 샘플 설정만 보여줍니다. 복잡한 권한이나 초대 기능은 아직 넣지 않습니다."
      />
      <section className="status-panel">
        <h2>가족 공동 계정</h2>
        <p>MVP는 가족이 하나의 계정을 함께 쓰는 방식으로 가정합니다. 복잡한 권한 관리는 포함하지 않습니다.</p>
      </section>
    </div>
  );
}
