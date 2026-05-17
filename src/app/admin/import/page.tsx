import { SectionHeader } from "@/components/SectionHeader";

export default function ImportPage() {
  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Import"
        title="Google Drive import preview"
        description="Task 0 keeps this as a placeholder. OAuth, Drive scanning, and Supabase imports come later."
      />
      <section className="status-panel">
        <h2>Current setup</h2>
        <ul>
          <li>Original storage: Google Drive</li>
          <li>App role: image-centered browsing UI</li>
          <li>Drive write actions: not available</li>
          <li>Import status: mock scaffold only</li>
        </ul>
      </section>
    </div>
  );
}
