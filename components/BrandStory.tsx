"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/lib/content";
import { useDict, useLang } from "@/lib/lang";
import { IntroTile, LetterTile } from "./Tiles";

gsap.registerPlugin(ScrollTrigger);

const GLOWS = [
  { filter: "brightness(1.25) saturate(1.12) drop-shadow(0 0 9px #ffc16bcc) drop-shadow(0 0 26px #ff9a3266)", ink: "#ffe3bd", shadow: "0 0 26px #ffab4140" },
  { filter: "brightness(1.25) saturate(1.12) drop-shadow(0 0 9px #81e6ffcc) drop-shadow(0 0 28px #40bfff77)", ink: "#d0f6ff", shadow: "0 0 26px #5acfff40" },
];

export default function BrandStory() {
  const t = useDict();
  const isEn = useLang() === "en";
  const root = useRef<HTMLElement>(null);
  const [qa, qb] = site.questionLetters;

  useEffect(() => {
    const section = root.current!;
    const q = <T extends Element = HTMLElement>(sel: string) => Array.from(section.querySelectorAll<T>(sel));
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      section.dataset.motionReady = "true";
      const stage = section.querySelector<HTMLElement>(".story-stage")!;
      const icons = q<HTMLElement>("[data-shared-icon]");
      const iconSlots = q<HTMLElement>("[data-icon-slot]");
      const letterSlots = q<HTMLElement>("[data-letter-slot]");
      const questionSlots = q<HTMLElement>("[data-question-slot]");
      const morphs = icons.map((el) => el.querySelector<HTMLElement>(".icon-morph")!);
      const pools = q<HTMLElement>(".emitter-pool");
      const definitions = q<HTMLElement>(".name-definition");
      const capCopy = q<HTMLElement>(".capability-copy");
      const rect = (el: Element) => el.getBoundingClientRect();
      const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

      const reveal = gsap.from(q("[data-intro-reveal]"), {
        opacity: 0,
        y: (_: number, el: Element) => (el.classList.contains("intro-tile-wrap") ? 42 : 26),
        scale: (_: number, el: Element) => (el.classList.contains("intro-tile-wrap") ? 0.55 : 1),
        rotation: (_: number, el: Element) => (el.classList.contains("intro-tile-wrap") ? -18 : 0),
        duration: 1.6,
        stagger: 0.18,
        ease: "power2.out",
        scrollTrigger: { trigger: section.querySelector(".intro-statement"), start: "top 88%", once: true },
      });

      // 1. Inline icons fly into the capability cards.
      let toSlots: { x: number; y: number; scale: number }[] = [];
      const measureSlots = () => {
        toSlots = icons.map((icon, i) => {
          const from = center(rect(icon));
          const to = center(rect(iconSlots[i]));
          return {
            x: to.x - (from.x - Number(gsap.getProperty(icon, "x"))),
            y: to.y - (from.y - Number(gsap.getProperty(icon, "y"))),
            scale: rect(iconSlots[i]).width / icon.offsetWidth,
          };
        });
      };
      measureSlots();
      const toCapabilities = gsap.timeline();
      toCapabilities.to(q("[data-intro-copy]"), { opacity: 0, duration: 0.35, ease: "power1.out" }, 0);
      icons.forEach((icon, i) =>
        toCapabilities.to(
          icon,
          { x: () => toSlots[i].x, y: () => toSlots[i].y, scale: () => toSlots[i].scale, duration: 1, ease: "power2.inOut" },
          0.08 + 0.035 * i,
        ),
      );
      gsap.set(capCopy, { opacity: 0, y: 28 });
      toCapabilities.to(capCopy, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, 1.2);

      // 2. Cards collapse into the brand-letter column and flip to letter faces.
      const toLetters = gsap.timeline();
      toLetters.to(capCopy, { opacity: 0, y: -12, duration: 0.16 }, 0);
      morphs.forEach((morph, i) => {
        const offset = (axis: "x" | "y") => {
          const a = rect(iconSlots[i]);
          const b = rect(letterSlots[i]);
          const s = a.width / icons[i].offsetWidth;
          return axis === "x" ? (center(b).x - center(a).x) / s : (center(b).y - center(a).y) / s;
        };
        const at = 0.12 + 0.075 * i;
        toLetters
          .fromTo(
            morph,
            { x: 0, y: 0, scale: 1 },
            {
              x: () => offset("x"),
              y: () => offset("y"),
              scale: () => rect(letterSlots[i]).width / rect(iconSlots[i]).width,
              duration: 0.65,
              ease: "back.out(1.15)",
              immediateRender: false,
            },
            at,
          )
          .fromTo(morph.querySelector(".icon-original"), { opacity: 1, rotationY: 0 }, { opacity: 0, rotationY: -85, duration: 0.22, ease: "power2.in", immediateRender: false }, at + 0.18)
          .fromTo(morph.querySelector(".icon-letter"), { opacity: 0, rotationY: 85 }, { opacity: 1, rotationY: 0, duration: 0.32, ease: "power3.out", immediateRender: false }, at + 0.34);
      });
      toLetters
        .fromTo(".last-letter", { opacity: 0, scale: 0.3, y: -35 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)", immediateRender: false }, 0.69)
        .fromTo(definitions, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.075, ease: "power3.out", immediateRender: false }, 0.58);

      // 3. Lights out: the two question letters start to glow.
      const placePools = () => {
        const s = rect(stage);
        [qa, qb].forEach((li, p) => {
          const c = center(rect(letterSlots[li]));
          pools[p].style.left = `${c.x - s.left}px`;
          pools[p].style.top = `${c.y - s.top}px`;
        });
      };
      placePools();
      const heads = definitions.map((d) => d.querySelector("h3")!);
      const dark = gsap.timeline();
      dark
        .to([section, stage], { backgroundColor: "#06090e", duration: 1.25, ease: "none" }, 0)
        .to(heads, { color: "#e7edf4", duration: 0.8, ease: "none" }, 0.1)
        .to(definitions.map((d) => d.querySelector("p")), { color: "#97a6b6", duration: 0.8, ease: "none" }, 0.1)
        .to(pools[0], { opacity: 0.6, duration: 0.8, ease: "power1.inOut" }, 0.3)
        .to(pools[1], { opacity: 0.65, duration: 0.7, ease: "power1.inOut" }, 0.5)
        .to(icons[qa].querySelector(".icon-letter"), { filter: GLOWS[0].filter, duration: 0.75, ease: "none" }, 0.35)
        .to(icons[qb].querySelector(".icon-letter"), { filter: GLOWS[1].filter, duration: 0.65, ease: "none" }, 0.55)
        .to(heads[qa], { color: GLOWS[0].ink, textShadow: GLOWS[0].shadow, duration: 0.6 }, 0.55)
        .to(heads[qb], { color: GLOWS[1].ink, textShadow: GLOWS[1].shadow, duration: 0.5 }, 0.7);

      // 4. The two glowing letters become "what?" and "how?".
      const bases = q<HTMLElement>(".question-base");
      const others = icons.filter((_, i) => i !== qa && i !== qb);
      const questions = gsap.timeline();
      questions
        .to([...others, section.querySelector(".name-row:last-child")], { opacity: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, 0)
        .to(definitions, { opacity: 0, duration: 0.3, immediateRender: false }, 0);
      [qa, qb].forEach((li, p) => {
        const offset = (axis: "x" | "y") => {
          const a = rect(letterSlots[li]);
          const b = rect(questionSlots[p]);
          const s = a.width / icons[li].offsetWidth;
          return axis === "x" ? (center(b).x - center(a).x) / s : (center(b).y - center(a).y) / s;
        };
        questions
          .fromTo(
            morphs[li].querySelector(".question-mover"),
            { x: 0, y: 0, scale: 1 },
            {
              x: () => offset("x"),
              y: () => offset("y"),
              scale: () => rect(questionSlots[p]).width / rect(letterSlots[li]).width,
              duration: 0.85,
              ease: "power2.inOut",
              immediateRender: false,
            },
            0.2 + 0.08 * p,
          )
          .to(
            pools[p],
            {
              left: () => center(rect(questionSlots[p])).x - rect(stage).left,
              top: () => center(rect(questionSlots[p])).y - rect(stage).top,
              duration: 0.85,
              ease: "power2.inOut",
            },
            0.2 + 0.08 * p,
          );
      });
      questions
        .set(bases, { opacity: 1 }, 0.85)
        .fromTo(
          bases,
          { clipPath: isEn ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, stagger: 0.25, ease: "none", immediateRender: false },
          0.85,
        )
        .fromTo([section, stage], { backgroundColor: "#06090e" }, { backgroundColor: "#fafafa", duration: 1.3, ease: "none", immediateRender: false }, 0.8)
        .fromTo(q(".question-word"), { color: "#f0f3f7" }, { color: "#1d1d1f", duration: 1.3, ease: "none", immediateRender: false }, 0.8)
        .to(pools, { opacity: 0, duration: 1, ease: "none" }, 1.1)
        .to(
          [icons[qa], icons[qb]].map((i) => i.querySelector(".icon-letter")),
          { filter: "brightness(1) saturate(1) drop-shadow(0 0 0px #0000) drop-shadow(0 0 0px #0000)", duration: 1, ease: "none" },
          1.1,
        );

      // 5. Prefixes slide open: "what?" → "let's build what?".
      const prefixes = gsap.timeline().fromTo(
        q(".question-prefix"),
        { width: 0, opacity: 0 },
        {
          width: (_: number, el: Element) => (el.firstElementChild as HTMLElement).getBoundingClientRect().width,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power1.inOut",
          immediateRender: false,
        },
      );

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(9.2 * stage.clientHeight)}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onRefreshInit: measureSlots,
          onRefresh: placePools,
        },
      });
      const fit = (tl: gsap.core.Timeline, d: number) => tl.timeScale(tl.duration() / d);
      master
        .add(fit(toCapabilities, 1.25), 0.3)
        .add(fit(toLetters, 0.9), 2.1)
        .add(fit(dark, 1.15), 3.9)
        .add(fit(questions, 1.8), 5.7)
        .add(fit(prefixes, 0.65), 8)
        .to({}, { duration: 0.55 }, 8.65);
      master.eventCallback("onUpdate", () => {
        if (master.time() > 0.3 && reveal.progress() < 1) reveal.progress(1);
      });
      document.fonts.ready.then(() => section.isConnected && ScrollTrigger.refresh());

      return () => {
        master.kill();
        delete section.dataset.motionReady;
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      section.dataset.reduced = "true";
      const icons = q<HTMLElement>("[data-shared-icon]");
      const homes = icons.map((el) => ({ parent: el.parentNode!, next: el.nextSibling }));
      const slots = q<HTMLElement>("[data-icon-slot]");
      icons.forEach((el, i) => slots[i].appendChild(el));
      return () => {
        icons.forEach((el, i) => homes[i].parent.insertBefore(el, homes[i].next));
        delete section.dataset.reduced;
      };
    });

    return () => mm.revert();
  }, [isEn, qa, qb]);

  const s = t.story;

  return (
    <section ref={root} id="identity" className="story" aria-labelledby="intro-title" dir={isEn ? "ltr" : "rtl"}>
      <span id="approach" className="story-anchor" aria-hidden="true" />
      <div className="story-stage">
        <div className="scene-light" aria-hidden="true">
          <div className="emitter-pool emitter-pool--warm" />
          <div className="emitter-pool emitter-pool--cool" />
        </div>

        <h2 id="intro-title" className="intro-statement">
          {s.intro.map((line, li) => (
            <span className="intro-line" key={li}>
              {line.map((token, ti) => {
                if (token.kind === "brand")
                  return (
                    <span data-intro-copy key={ti}>
                      <b className="intro-word" data-intro-reveal lang="en" dir="ltr">
                        {site.brand}
                      </b>{" "}
                    </span>
                  );
                if (token.kind === "tile")
                  return (
                    <Fragment key={ti}>
                      <SharedIcon index={token.index}>
                        <span className="intro-tile-wrap" data-intro-reveal>
                          <IntroTile index={token.index} name={s.tileNames[token.index]} />
                        </span>
                      </SharedIcon>{" "}
                    </Fragment>
                  );
                return token.value.split(" ").map((word, wi) => (
                  <span data-intro-copy key={`${ti}-${wi}`}>
                    <span className="intro-word" data-intro-reveal>
                      {word}
                    </span>{" "}
                  </span>
                ));
              })}
            </span>
          ))}
        </h2>

        <section className="capabilities" aria-label={s.capabilitiesLabel}>
          {s.capabilities.map((c) => (
            <article className="capability" key={c.title}>
              <div className="capability-slot" data-icon-slot />
              <div className="capability-copy">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="name-panel" aria-label={s.lettersLabel}>
          {site.letters.map((l, i) => (
            <div className="name-row" key={i}>
              <div className="name-slot" data-letter-slot>
                <span className={i === 4 ? "last-letter" : "reduced-letter"}>
                  <LetterTile letter={l.letter} tone={l.tone} />
                </span>
              </div>
              <div className="name-definition" dir={isEn ? "ltr" : "rtl"}>
                <h3>{s.letterWords[i].word}</h3>
                <p>{s.letterWords[i].note}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="questions-panel" aria-label={s.questionsLabel}>
          {[s.what, s.how].map((item, i) => (
            <div className="question-row" key={i}>
              <div className="question-slot" data-question-slot />
              <div className="question-copy">
                <h3 className={"question-word" + (i === 0 ? " question-what" : "")} dir={isEn ? "ltr" : "rtl"} aria-label={item.label}>
                  <span className="question-prefix">
                    <span>{item.prefix}</span>
                  </span>
                  <span className="question-base">{item.base}</span>
                </h3>
              </div>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}

function SharedIcon({ index, children }: { index: number; children: React.ReactNode }) {
  const l = site.letters[index];
  return (
    <span className="shared-icon" data-shared-icon>
      <span className="icon-morph">
        <span className="question-mover">
          <span className="icon-original">{children}</span>
          <span className="icon-letter" aria-hidden="true">
            <LetterTile letter={l.letter} tone={l.tone} />
          </span>
        </span>
      </span>
    </span>
  );
}
