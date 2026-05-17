import Link from "next/link";

const navItems = [
  { href: "/", label: "우리집 앨범" },
  { href: "/timeline", label: "시간별" },
  { href: "/places", label: "장소별" },
  { href: "/people", label: "사람별" },
  { href: "/events", label: "추억 모음" },
  { href: "/cleanup", label: "정리함" },
  { href: "/admin/import", label: "사진 가져오기" },
  { href: "/settings", label: "설정" }
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand__mark">FM</span>
          <span>
            <strong>우리집 앨범</strong>
            <small>가족사진을 보기 쉽게 모아보는 곳</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
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
