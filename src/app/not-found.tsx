import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-stack">
      <section className="status-panel">
        <h1>Photo not found</h1>
        <p>This memory is not available in the mock gallery.</p>
        <Link className="text-link" href="/">
          Return home
        </Link>
      </section>
    </div>
  );
}
