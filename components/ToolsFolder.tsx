"use client";

import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/lib/content";
import { useDict } from "@/lib/lang";
import { folderPath } from "./folderShape";
import TechIcon from "./TechIcon";

const EASE = "cubic-bezier(.2,.8,.2,1)";

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export default function ToolsFolder() {
  const t = useDict();
  const id = useId().replace(/:/g, "");
  const [rootRef, root] = useSize<HTMLDivElement>();
  const [backRef, back] = useSize<HTMLDivElement>();
  const [frontRef, front] = useSize<HTMLDivElement>();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [rootRef]);

  const tech = site.technologies;
  const n = tech.length;
  const spreadOut = open || hover;
  const width = root.w || 420;
  const tileSize = Math.min(101, Math.max(44, width * 0.26));
  const gap = Math.min(56 * (spreadOut ? 1.15 : 1), Math.max(0, (width - tileSize * 1.5 - 16) / Math.max(1, n - 1)));
  const fan = n > 1 ? 25 / (n - 1) : 0;

  const backD = back.w ? folderPath(back.w, back.h, back.w - Math.round(back.w * 0.4), back.w, 24, 24, 46) : "";
  const frontD = front.w ? folderPath(front.w, front.h, 0, Math.round(front.w * 0.42), 24, 24, 46) : "";
  const toggle = () => setOpen((v) => !v);

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${t.folders.toolsTitle}: ${tech.map((x) => x.label).join(", ")}`}
      className="tools-folder"
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        setFocused(null);
      }}
      style={{
        zIndex: spreadOut ? 2 : undefined,
        opacity: visible ? 1 : 0,
        transform: visible ? (spreadOut ? "translateY(-6px) scale(1.02)" : "none") : "translateY(34px) scale(.92)",
        transition: `transform .9s ${EASE}, opacity .6s ease`,
      }}
    >
      <div className="tools-glow" aria-hidden="true" />
      <div ref={backRef} className="tools-back" style={{ clipPath: backD ? `path('${backD}')` : undefined }}>
        <svg className="tools-edge" aria-hidden="true">
          <path d={backD} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="2" />
        </svg>
      </div>
      <div className="tools-tiles" aria-hidden="true">
        {tech.map((item, i) => {
          const r = i - (n - 1) / 2;
          const angle = r * fan * (spreadOut ? 1.2 : 1);
          return (
            <div
              key={item.label}
              className="tools-tile-slot"
              style={{
                width: tileSize,
                height: tileSize,
                marginLeft: -tileSize / 2,
                zIndex: focused === i ? 5 : undefined,
                opacity: visible ? 1 : 0,
                transform: visible
                  ? `translate3d(${r * gap}px, ${r * r * (n > 4 ? 3 : 9) - (spreadOut ? 4 : 0)}px, 0) rotate(${angle}deg)`
                  : `translate3d(${r * gap * 0.6}px, 80px, 0)`,
                transition: `transform ${spreadOut ? 0.6 : 0.9}s ${EASE}, opacity .5s`,
                transitionDelay: spreadOut ? `${0.04 * i}s` : `${0.35 + 0.08 * i}s`,
              }}
            >
              <div
                className="tools-tile"
                onPointerEnter={(e) => e.pointerType === "mouse" && setFocused(i)}
                onPointerLeave={() => setFocused((f) => (f === i ? null : f))}
                style={{
                  transform:
                    focused === i ? `translateY(-26px) rotate(${-angle}deg) scale(1.1)` : focused !== null ? "scale(.96)" : "none",
                  filter: focused !== null && focused !== i ? "saturate(.75) brightness(.85)" : "none",
                }}
              >
                <TechFace color={item.color} fg={item.fg} icon={item.icon} />
                <span className="tools-tile-label" style={{ opacity: focused === i ? 1 : 0, transform: `translateX(-50%) translateY(${focused === i ? 0 : 6}px)` }}>
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div
        ref={frontRef}
        className="tools-front"
        style={{ clipPath: frontD ? `path('${frontD}')` : undefined, transform: spreadOut ? "translateY(6px)" : "none" }}
      >
        <svg className="tools-edge" aria-hidden="true">
          <defs>
            <linearGradient id={`edge-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,.38)" />
              <stop offset=".35" stopColor="rgba(255,255,255,.1)" />
              <stop offset="1" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path d={frontD} fill="none" stroke={`url(#edge-${id})`} strokeWidth="2" />
        </svg>
        <h3>{t.folders.toolsTitle}</h3>
        <div className="tools-tags">
          {tech.map((item, i) => (
            <span key={item.label} dir="ltr" className={"tools-tag" + (focused === i ? " is-active" : "")}>
              {item.label}
            </span>
          ))}
        </div>
        <span className="tools-pill" aria-hidden="true">
          {tech.map((item) => (
            <span key={item.label} className="tools-pill-icon" style={{ background: item.color }}>
              <TechIcon path={item.icon} color={item.fg} />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function TechFace({ color, fg, icon }: { color: string; fg: string; icon: string }) {
  return (
    <div className="tools-face" style={{ background: `linear-gradient(150deg, color-mix(in srgb, ${color} 70%, white) -20%, ${color} 55%, color-mix(in srgb, ${color} 70%, black) 120%)` }}>
      <TechIcon path={icon} color={fg} />
    </div>
  );
}
