"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { site } from "@/lib/content";
import { useDict, useLang } from "@/lib/lang";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const t = useDict();
  const isEn = useLang() === "en";
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>(".hero-stage")!;
    const art = section.querySelector<HTMLElement>(".hero-art-inner")!;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline();
      intro
        .from(".hero-light", { opacity: 0, duration: 1.8, ease: "power2.out" }, 0)
        .from(".hero-word", { y: 40, opacity: 0, duration: 1.15, stagger: 0.13, ease: "power3.out" }, 0.15)
        .from(".hero-art", { y: 95, opacity: 0, rotation: -4, duration: 1.7, ease: "power3.out" }, 0.12)
        .from(".hero-cta", { opacity: 0, y: 18, scale: 0.94, duration: 0.7, ease: "power3.out", clearProps: "transform,opacity" }, 0.8)
        .from(".folder-row > *", { opacity: 0, y: 36, duration: 0.9, stagger: 0.12, ease: "power3.out", clearProps: "transform,opacity" }, 0.65)
        .from(".site-header .header-inner", { opacity: 0, y: -14, duration: 0.75, ease: "power3.out", clearProps: "transform,opacity" }, 0.25)
        .from(".site-header .dock-tile", { opacity: 0, scale: 0.75, duration: 0.55, stagger: 0.065, ease: "power3.out", clearProps: "transform,opacity" }, 0.45);

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.min(420, stage.clientHeight * 0.45)}`,
            scrub: 0.18,
            invalidateOnRefresh: true,
          },
        })
        .to(".hero-art-scroll", { scale: () => (innerWidth < 768 ? 1.02 : 1.035), duration: 1 }, 0)
        .to(".hero-word-scroll", { y: () => Math.min(60, stage.clientHeight * 0.07), opacity: 0, duration: 0.7 }, 0);

      if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      // Damped springs: x, y, rotation for the portrait, then x, y for the title.
      const springs = Array.from({ length: 5 }, () => ({ value: 0, velocity: 0, target: 0 }));
      let frame = 0;
      let last = 0;
      const tick = (now: number) => {
        const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
        last = now;
        let moving = false;
        springs.forEach((s, i) => {
          const omega = (2 * Math.PI) / (i >= 3 ? 0.65 : 0.4);
          const offset = s.value - s.target;
          const v = s.velocity + omega * offset;
          const decay = Math.exp(-omega * dt);
          s.value = s.target + (offset + v * dt) * decay;
          s.velocity = (s.velocity - omega * v * dt) * decay;
          moving ||= Math.abs(s.value - s.target) > 0.001 || Math.abs(s.velocity) > 0.001;
        });
        gsap.set(art, {
          x: springs[0].value,
          y: springs[1].value,
          rotation: springs[2].value,
          rotationY: springs[0].value * 0.38,
          rotationX: -springs[1].value * 0.32,
          transformPerspective: 1300,
        });
        art.style.setProperty("--light-x", `${40 + springs[0].value * 2.3}%`);
        art.style.setProperty("--light-y", `${24 + springs[1].value * 2}%`);
        stage.style.setProperty("--title-x", `${springs[3].value}px`);
        stage.style.setProperty("--title-y", `${springs[4].value}px`);
        frame = moving ? requestAnimationFrame(tick) : 0;
        if (!moving) last = 0;
      };
      const aim = (x: number, y: number, r: number) => {
        springs[0].target = x;
        springs[1].target = y;
        springs[2].target = r;
        springs[3].target = -x * 1.8;
        springs[4].target = -y * 1.4;
        if (!frame) frame = requestAnimationFrame(tick);
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const box = stage.getBoundingClientRect();
        const px = (e.clientX - box.left) / box.width - 0.5;
        const py = (e.clientY - box.top) / box.height - 0.5;
        aim(px * 14, py * 10, px * 1.1);
      };
      const onLeave = () => aim(0, 0, 0);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
      return () => {
        cancelAnimationFrame(frame);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => mm.revert();
  }, []);

  const Arrow = isEn ? ArrowRight : ArrowLeft;

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero-stage">
        <div className="hero-light" aria-hidden="true" />
        <h1 id="hero-title" className="hero-title" aria-label={t.hero.label}>
          <span className="hero-title-top">
            <span className="hero-word-scroll">
              <span className="hero-word">{t.hero.top}</span>
            </span>
          </span>
          <span className="hero-title-bottom">
            <span className="hero-word-scroll">
              <span className="hero-word">{t.hero.bottom}</span>
            </span>
          </span>
        </h1>
        <div className="hero-art">
          <div className="hero-art-scroll">
            <div className="hero-art-inner">
              <span className="portrait-shadow" aria-hidden="true" />
              {site.portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="portrait-image" src={site.portrait} alt={t.hero.portraitAlt} />
              ) : (
                <PortraitPlaceholder label={t.hero.portraitAlt} />
              )}
              <span className="portrait-light" aria-hidden="true" />
            </div>
          </div>
        </div>
        <a className="hero-cta" href="#why-wait" aria-label={t.hero.cta}>
          <span>{t.hero.cta}</span>
          <span className="hero-cta-icon" aria-hidden="true">
            <Arrow size={16} strokeWidth={2.4} />
          </span>
        </a>
      </div>
    </section>
  );
}

function PortraitPlaceholder({ label }: { label: string }) {
  return (
    <svg className="portrait-image portrait-placeholder" viewBox="0 0 600 620" role="img" aria-label={label}>
      <defs>
        <linearGradient id="pp-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cdb9a6" />
          <stop offset="1" stopColor="#8d7563" />
        </linearGradient>
        <linearGradient id="pp-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f4f2" />
          <stop offset="1" stopColor="#c9c9c6" />
        </linearGradient>
        <linearGradient id="pp-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3d44" />
          <stop offset=".45" stopColor="#0d0e11" />
          <stop offset="1" stopColor="#2b2e35" />
        </linearGradient>
        <linearGradient id="pp-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f2f3f5" />
          <stop offset="1" stopColor="#a9adb5" />
        </linearGradient>
      </defs>
      <path d="M90 620c10-120 70-190 210-205 140 15 200 85 210 205z" fill="url(#pp-cloth)" />
      <path d="M232 470c0-50 10-80 14-110h108c4 30 14 60 14 110-30 22-106 22-136 0z" fill="#e9e9e6" />
      <path d="M248 380c-6 40-4 70 4 92h96c8-22 10-52 4-92z" fill="url(#pp-skin)" />
      <ellipse cx="300" cy="245" rx="132" ry="158" fill="url(#pp-skin)" />
      <path d="M168 210c-10-110 70-160 132-160s146 40 134 160c-24-44-70-64-134-64s-108 20-132 64z" fill="#2a211c" />
      <path d="M150 232c0-26 30-44 70-46l160-4c40 0 72 20 72 48v28c0 30-26 48-60 48H214c-36 0-64-20-64-50z" fill="url(#pp-visor)" />
      <path d="M148 236l-22 6v30l24 4zM452 236l22 6v30l-24 4z" fill="url(#pp-band)" />
      <path d="M182 214c40-10 160-14 236-4" stroke="#ffffff" strokeOpacity=".28" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
