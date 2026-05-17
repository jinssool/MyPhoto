import { SectionHeader } from "@/components/SectionHeader";

export default function SettingsPage() {
  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Settings"
        title="Simple family album settings"
        description="Only lightweight placeholder settings are shown in the scaffold."
      />
      <section className="status-panel">
        <h2>Family account</h2>
        <p>MVP assumes one shared family account. Complex permissions are intentionally not included.</p>
      </section>
    </div>
  );
}
