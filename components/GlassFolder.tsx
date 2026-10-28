"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDict } from "@/lib/lang";
import { folderPath } from "./folderShape";

type FileItem = { name: string; meta: string; href: string; image?: string };

const BACK = folderPath(340, 272, 198, 340, 34);
const FRONT = folderPath(340, 198, 0, 120, 32);

function jitter(seed: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 0x1000193);
  const a = ((h >>> 0) % 1000) / 1000;
  const b = (((h >>> 10) >>> 0) % 1000) / 1000;
  return { x: (a - 0.5) * 10, r: (b - 0.5) * 3.2 };
}

export default function GlassFolder({ label, meta, files, variant }: { label: string; meta: string; files: FileItem[]; variant: number }) {
  const t = useDict();
  const uid = useId().replace(/:/g, "");
  const slot = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const hit = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(340);
  const [open, setOpen] = useState(false);
  const scale = width / 340;

  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(180, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    let px = 0;
    let py = 0;
    const flush = () => {
      frame = 0;
      el.style.setProperty("--gf-px", px.toFixed(3));
      el.style.setProperty("--gf-py", py.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const b = el.getBoundingClientRect();
      px = ((e.clientX - b.left) / b.width) * 2 - 1;
      py = ((e.clientY - b.top) / b.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const leave = () => {
      px = 0;
      py = 0;
      if (!frame) frame = requestAnimationFrame(flush);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        hit.current?.focus();
      }
    };
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", down);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", down);
    };
  }, [open]);

  const shown = files.slice(-4);

  return (
    <div className="glass-slot" ref={slot}>
      <div ref={root} className="gf-root" data-open={open || undefined} style={{ width, height: 300 * scale }}>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <clipPath id={`gf-back-${uid}`} clipPathUnits="objectBoundingBox">
              <path d={BACK} transform={`scale(${1 / 340} ${1 / 272})`} />
            </clipPath>
            <clipPath id={`gf-front-${uid}`} clipPathUnits="objectBoundingBox">
              <path d={FRONT} transform={`scale(${1 / 340} ${1 / 198})`} />
            </clipPath>
            <linearGradient id={`gf-rim-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".95" />
              <stop offset=".35" stopColor="#fff" stopOpacity=".35" />
              <stop offset="1" stopColor="#fff" stopOpacity=".12" />
            </linearGradient>
          </defs>
        </svg>
        <div className="gf-stage" style={{ transform: `translateY(${28 * scale}px) scale(${scale})` }}>
          <div className="gf-tilt">
            <div className="gf-shadow" aria-hidden="true" />
            <div className="gf-back" style={{ clipPath: `url(#gf-back-${uid})` }} aria-hidden="true">
              <div className={`gf-art gf-art-${variant}`} />
              <div className="gf-back-sheen" />
            </div>
            <svg className="gf-rim gf-back-rim" viewBox="0 0 340 272" preserveAspectRatio="none" aria-hidden="true">
              <path d={BACK} />
            </svg>
            <div className="gf-files" role="list" aria-label={`${t.folders.contents} ${label}`} inert={!open}>
              {shown.map((file, i) => {
                const n = shown.length;
                const j = jitter(file.name + i);
                const external = file.href.startsWith("http");
                return (
                  <div role="listitem" className="gf-sheet-slot" key={file.name}>
                    <a
                      href={file.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className={"gf-sheet" + (file.image ? " gf-sheet--art" : "")}
                      onClick={() => setOpen(false)}
                      style={
                        {
                          "--gf-slot": n <= 1 ? 0 : (i / (n - 1)) * 2 - 1,
                          "--gf-depth": n - 1 - i,
                          "--gf-jx": `${j.x.toFixed(2)}px`,
                          "--gf-jr": `${j.r.toFixed(2)}deg`,
                          zIndex: i + 1,
                        } as React.CSSProperties
                      }
                    >
                      {file.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="gf-sheet-img" src={file.image} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span className="gf-lines" aria-hidden="true">
                          <i style={{ width: "86%" }} />
                          <i style={{ width: "92%" }} />
                          <i style={{ width: "64%" }} />
                          <i style={{ width: "88%" }} />
                          <i style={{ width: "42%" }} />
                        </span>
                      )}
                      <span className="gf-sheet-head">
                        <span className="gf-sheet-name">{file.name}</span>
                        <span className="gf-sheet-meta">{file.meta}</span>
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
            <div className="gf-front" style={{ clipPath: `url(#gf-front-${uid})` }}>
              <div className="gf-tint" aria-hidden="true" />
              <div className="gf-spec" aria-hidden="true" />
              <svg className="gf-rim gf-front-rim" viewBox="0 0 340 198" preserveAspectRatio="none" aria-hidden="true">
                <path d={FRONT} stroke={`url(#gf-rim-${uid})`} />
              </svg>
              <button
                ref={hit}
                type="button"
                className="gf-hit"
                aria-expanded={open}
                aria-label={`${open ? t.folders.close : t.folders.open} ${label}، ${files.length} ${t.folders.files}`}
                onClick={() => setOpen((v) => !v)}
              />
              <div className="gf-label">
                <span className="gf-title">{label}</span>
                <span className="gf-meta">{meta}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
