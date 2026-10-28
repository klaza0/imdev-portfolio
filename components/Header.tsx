"use client";

import { Folder, LayoutGrid, MessageCircle, Spline, Users } from "lucide-react";
import { site } from "@/lib/content";
import { useDict } from "@/lib/lang";

const apps = {
  services: { Icon: LayoutGrid, bg: "linear-gradient(160deg,#4fb2ff,#1471ff)" },
  work: { Icon: Folder, bg: "linear-gradient(160deg,#5b49ff,#2a1ab8)" },
  process: { Icon: Spline, bg: "linear-gradient(160deg,#ff9a3c,#ff5a1f)" },
  about: { Icon: Users, bg: "linear-gradient(160deg,#ff6b81,#e8243f)" },
  contact: { Icon: MessageCircle, bg: "linear-gradient(160deg,#5ee27a,#1bb544)" },
} as const;

export default function Header() {
  const t = useDict();
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" aria-label={t.home} href={t.switchHref === "/" ? "/en" : "/"}>
          <BrandMark />
        </a>
        <nav className="dock" aria-label={t.mainNav}>
          {t.nav.map((item) => {
            const { Icon, bg } = apps[item.key as keyof typeof apps];
            return (
              <a key={item.key} className="dock-app" href={item.href} aria-label={item.label}>
                <span className="dock-tile" style={{ background: bg }}>
                  <Icon size={20} strokeWidth={2.4} color="#fff" fill={item.key === "contact" || item.key === "work" ? "#fff" : "none"} aria-hidden />
                </span>
                <span className="dock-tooltip" aria-hidden="true">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>
        <a className="dock-language" href={t.switchHref} aria-label={t.switchLabel}>
          {t.switchShort}
        </a>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 32" width="34" height="23">
        <path d="M5 4h7v24H5zM16 4h7l6 12 6-12h7v24h-7V16l-6 11-6-11v12h-7z" fill="#fff" />
      </svg>
      <span className="sr-only">{site.brand}</span>
    </span>
  );
}
