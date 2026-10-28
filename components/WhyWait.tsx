"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone } from "lucide-react";
import { site } from "@/lib/content";
import { useDict, useLang } from "@/lib/lang";
import { createSfx, type Sfx } from "@/lib/sfx";
import Contact from "./Contact";
import TechIcon from "./TechIcon";

gsap.registerPlugin(ScrollTrigger);

const FLOATERS = [
  { x: 8, y: 15, size: 1.1, angle: -15 },
  { x: 28, y: 10, size: 0.75, angle: 12 },
  { x: 54, y: 13, size: 0.85, angle: -10 },
  { x: 82, y: 15, size: 1.15, angle: 16 },
  { x: 95, y: 40, size: 0.8, angle: -12 },
  { x: 5, y: 43, size: 0.85, angle: 10 },
  { x: 9, y: 76, size: 0.9, angle: -18 },
  { x: 29, y: 89, size: 1, angle: 16 },
  { x: 53, y: 87, size: 0.7, angle: -10 },
  { x: 77, y: 84, size: 1.15, angle: 12 },
  { x: 93, y: 74, size: 0.95, angle: -12 },
  { x: 95, y: 13, size: 0.55, angle: -20 },
];

export default function WhyWait() {
  const t = useDict();
  const isEn = useLang() === "en";
  const [ringing, setRinging] = useState(false);
  const root = useRef<HTMLElement>(null);
  const sfx = useRef<Sfx | null>(null);
  const buzzRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const section = root.current!;
    const mm = gsap.matchMedia();
    sfx.current = createSfx();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      section.dataset.animated = "true";
      const stage = section.querySelector<HTMLElement>(".why-stage")!;
      const statement = section.querySelector<HTMLElement>(".why-statement")!;
      let inStatement = false;

      const floats = Array.from(section.querySelectorAll<HTMLElement>("[data-floater]")).flatMap((el, i) => [
        gsap.fromTo(el, { x: -14 - (i % 3) * 5 }, { x: 18 + (i % 4) * 6, duration: 5.5 + (i % 4), ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }),
        gsap.fromTo(el, { y: 18, rotation: -7 }, { y: -22 - (i % 3) * 8, rotation: 9, duration: 4.2 + (i % 5) * 0.7, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }),
      ]);
      const floatAll = (on: boolean) => floats.forEach((tw) => (on ? tw.resume() : tw.pause()));

      const phone = section.querySelector<HTMLElement>(".why-phone")!;
      const waves = section.querySelectorAll(".why-vibration path");
      // One buzz per phrase of the ringtone in lib/sfx.ts (3 phrases of 0.51s).
      const buzz = gsap.timeline({ paused: true, repeat: 2, repeatDelay: 0.11 });
      buzzRef.current = buzz;
      buzz
        .to(phone, { rotation: 8, x: 1.5, duration: 0.05, ease: "sine.inOut" }, 0)
        .to(phone, { rotation: -30, x: -1.5, duration: 0.07, repeat: 4, yoyo: true, ease: "sine.inOut" }, 0.05)
        .to(phone, { rotation: -12, x: 0, duration: 0.16, ease: "power2.out" }, 0.4)
        .fromTo(waves, { opacity: 0, x: 0, scaleY: 0.6 }, { opacity: 0.75, x: (i: number) => (i < 2 ? -3 : 3), scaleY: 1, duration: 0.12, stagger: 0.035, ease: "power2.out", immediateRender: false }, 0.01)
        .to(waves, { opacity: 0, x: (i: number) => (i < 2 ? -7 : 7), duration: 0.23, stagger: 0.025, ease: "power1.out" }, 0.25);

      const toStatement = gsap.timeline({ paused: true });
      toStatement.eventCallback("onReverseComplete", () => {
        buzz.pause(0);
        floatAll(false);
      });
      toStatement
        .fromTo(statement, { opacity: 0, scale: 0.92, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power4.out", immediateRender: false }, 0)
        .call(() => inStatement && floatAll(true), [], 0.05)
        .fromTo(section.querySelectorAll(".floater"), { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 0.85, stagger: 0.055, ease: "power3.out", immediateRender: false }, 0.1)
        .to(phone, { color: "#22b866", duration: 0.5, ease: "power1.inOut" }, 0.75);

      ScrollTrigger.create({
        trigger: section,
        start: "top 35%",
        end: "bottom top",
        onEnter: () => {
          inStatement = true;
          toStatement.play();
        },
        onLeave: () => {
          buzz.pause(0);
          floatAll(false);
          setRinging(false);
        },
        onEnterBack: () => {
          if (toStatement.progress() > 0.9) floatAll(true);
        },
        onLeaveBack: () => {
          inStatement = false;
          buzz.pause(0);
          floatAll(false);
          toStatement.reverse();
          setRinging(false);
        },
      });

      // The phone icon and its ringtone only appear on the contact panel, next to the number.
      const panel = section.querySelector<HTMLElement>(".contact-panel")!;
      const target = section.querySelector<HTMLElement>(".contact-phone-target")!;
      const phoneBtn = section.querySelector<HTMLElement>(".why-phone-button")!;
      const fading = section.querySelectorAll(".why-call-label, .why-now, .why-dots, .floaters");
      panel.inert = true;
      const flight = () => {
        if (!target.offsetWidth) return { x: 0, y: 0, scale: 1 };
        const a = target.getBoundingClientRect();
        const b = phoneBtn.getBoundingClientRect();
        return {
          x: a.left - b.left + Number(gsap.getProperty(phoneBtn, "x")),
          y: a.top - b.top + Number(gsap.getProperty(phoneBtn, "y")),
          scale: a.width / phoneBtn.offsetWidth,
        };
      };
      const toContact = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => `top top-=${Math.round(stage.clientHeight * 0.6)}`,
          end: () => `top top-=${Math.round(stage.clientHeight * 1.45)}`,
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const shown = self.progress >= 0.85;
            panel.inert = !shown;
            if (!shown) panel.scrollTop = 0;
            if (!shown) buzz.pause(0);
            setRinging(shown && target.offsetWidth > 0);
          },
        },
      });
      toContact
        .to(fading, { autoAlpha: 0, y: -35, duration: 0.35 }, 0)
        .fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.2)
        .fromTo(panel.querySelectorAll(".contact-details > :not(.contact-phone-row), .contact-form"), { y: 35 }, { y: 0, duration: 0.65, stagger: 0.04, ease: "power2.out" }, 0.2)
        .fromTo(
          phoneBtn,
          { x: () => flight().x, y: () => flight().y, scale: () => flight().scale * 0.6, autoAlpha: 0, transformOrigin: "top left" },
          { x: () => flight().x, y: () => flight().y, scale: () => flight().scale, autoAlpha: () => (target.offsetWidth ? 1 : 0), duration: 0.4, ease: "back.out(2)" },
          0.6,
        );

      // The flight above is measured once; this keeps the phone on its spot when the panel scrolls or reflows.
      let off = { x: 0, y: 0 };
      let frame = 0;
      const follow = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (!target.offsetWidth) return;
          const a = target.getBoundingClientRect();
          const b = phoneBtn.getBoundingClientRect();
          off = { x: off.x + a.left - b.left, y: off.y + a.top - b.top };
          phoneBtn.style.translate = `${off.x}px ${off.y}px`;
        });
      };
      const ro = new ResizeObserver(follow);
      panel.querySelectorAll(".contact-details, .contact-form").forEach((el) => ro.observe(el));
      panel.addEventListener("scroll", follow, { passive: true });

      return () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        panel.removeEventListener("scroll", follow);
        phoneBtn.style.translate = "";
        buzzRef.current = null;
        delete section.dataset.animated;
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const st = ScrollTrigger.create({
        trigger: section.querySelector(".why-statement"),
        start: "top 85%",
        end: "bottom 15%",
        onToggle: ({ isActive }) => setRinging(isActive),
      });
      return () => st.kill();
    });

    return () => {
      mm.revert();
      sfx.current?.dispose();
      sfx.current = null;
    };
  }, [isEn]);

  const w = t.whyWait;

  return (
    <section ref={root} id="why-wait" className="why-wait" aria-label={w.label} dir={isEn ? "ltr" : "rtl"}>
      <div className="why-stage">
        <div className="why-statement">
          <Floaters />
          <h3 aria-label={w.label}>
            <span className="why-call">
              <span className="why-call-word">
                <span className="why-call-label">{w.call}</span>
                <PhoneButton active={ringing} sfx={sfx} onRing={() => buzzRef.current?.restart()} />
              </span>{" "}
              <span className="why-now">{w.now}</span>
            </span>
            <span className="why-dots">{w.dots}</span>
          </h3>
        </div>
        <Contact />
      </div>
    </section>
  );
}

function PhoneButton({ active, sfx, onRing }: { active: boolean; sfx: React.RefObject<Sfx | null>; onRing: () => void }) {
  const w = useDict().whyWait;
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const silent = muted || blocked;
  const ringRef = useRef(onRing);
  useEffect(() => {
    ringRef.current = onRing;
  });

  useEffect(() => {
    if (!active) return;
    const ring = () => {
      if (document.hidden) return;
      if (!muted) setBlocked(!sfx.current?.ring());
      ringRef.current();
    };
    ring();
    const id = window.setInterval(ring, 5000);
    return () => window.clearInterval(id);
  }, [active, muted, sfx]);

  const label = silent ? w.ringOn : w.ringOff;
  return (
    <button
      type="button"
      className="why-phone-button"
      onClick={() => {
        if (silent) {
          setMuted(false);
          setBlocked(!sfx.current?.ring());
          onRing();
        } else setMuted(true);
      }}
      aria-label={label}
      title={label}
      aria-pressed={!silent}
      tabIndex={active ? 0 : -1}
      data-silent={silent}
    >
      <Phone className="why-phone" aria-hidden strokeWidth={2.2} />
      <svg className="why-vibration" viewBox="0 0 48 32" fill="none" aria-hidden="true">
        <path d="M12 9Q6 16 12 23" />
        <path d="M6 5Q-2 16 6 27" />
        <path d="M36 9Q42 16 36 23" />
        <path d="M42 5Q50 16 42 27" />
      </svg>
      <span className="ringtone-muted-mark" aria-hidden="true" />
    </button>
  );
}

function Floaters() {
  const tech = site.technologies;
  return (
    <div className="floaters" aria-hidden="true">
      {FLOATERS.map((f, i) => {
        const item = tech[i % tech.length];
        return (
          <span
            key={i}
            className="floater"
            style={{ left: `${f.x}%`, top: `${f.y}%`, "--float-size": f.size, "--float-angle": `${f.angle}deg` } as React.CSSProperties}
          >
            <span className="floater-motion" data-floater>
              <span className="floater-tile" style={{ "--tile": item.color } as React.CSSProperties}>
                <TechIcon path={item.icon} color={item.fg} />
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
