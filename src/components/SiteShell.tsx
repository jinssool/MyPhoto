import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/timeline", label: "Timeline" },
  { href: "/places", label: "Places" },
  { href: "/people", label: "People" },
  { href: "/events", label: "Events" },
  { href: "/cleanup", label: "Cleanup" },
  { href: "/admin/import", label: "Import" },
  { href: "/settings", label: "Settings" }
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand__mark">FM</span>
          <span>
            <strong>Family Memory Gallery</strong>
            <small>Google Drive photo memories</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="site-main">{children}</main>
    </div>
  );
}
