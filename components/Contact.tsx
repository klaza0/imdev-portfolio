"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/content";
import { useDict } from "@/lib/lang";

export default function Contact() {
  const c = useDict().contact;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    const el = root.current;
    if (!vv || !el) return;
    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--contact-height", el.contains(document.activeElement) ? `${vv.height}px` : "100dvh");
      });
    };
    vv.addEventListener("resize", sync);
    el.addEventListener("focusin", sync);
    el.addEventListener("focusout", sync);
    return () => {
      cancelAnimationFrame(frame);
      vv.removeEventListener("resize", sync);
      el.removeEventListener("focusin", sync);
      el.removeEventListener("focusout", sync);
    };
  }, []);

  return (
    <section ref={root} id="contact" className="contact-panel" aria-labelledby="contact-title">
      <div className="contact-details">
        <p className="contact-eyebrow">{c.eyebrow}</p>
        <h2 id="contact-title">
          {c.title[0]}
          <br />
          {c.title[1]}
        </h2>
        <div className="contact-phone-row" dir="ltr">
          <span className="contact-phone-target" aria-hidden="true" />
          <a className="contact-number" href={site.contact.phoneHref}>
            {site.contact.phoneDisplay}
          </a>
          <a className="contact-whatsapp" href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={c.whatsapp}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
            </svg>
          </a>
        </div>
        <a className="contact-email" href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
      </div>
      <form
        className="contact-form"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const subject = encodeURIComponent(`${c.subject} — ${data.get("name")}`);
          const body = encodeURIComponent(`${data.get("name")}\n${data.get("email")}\n\n${data.get("message")}`);
          window.location.href = `mailto:${site.contact.email}?subject=${subject}&body=${body}`;
        }}
      >
        <label>
          {c.name}
          <input name="name" autoComplete="name" required maxLength={100} placeholder={c.namePh} />
        </label>
        <label>
          {c.email}
          <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" dir="ltr" />
        </label>
        <label>
          {c.message}
          <textarea name="message" required rows={3} maxLength={4000} placeholder={c.messagePh} />
        </label>
        <button type="submit">
          {c.submit}
          <ArrowUpRight size={20} aria-hidden />
        </button>
        <p className="contact-form-note">{c.note}</p>
      </form>
    </section>
  );
}
