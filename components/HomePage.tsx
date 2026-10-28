"use client";

import { site } from "@/lib/content";
import { useDict } from "@/lib/lang";
import BrandStory from "./BrandStory";
import Header from "./Header";
import Hero from "./Hero";
import HeroFolders from "./HeroFolders";
import WhyWait from "./WhyWait";

export default function HomePage() {
  const t = useDict();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Header />
      <main id="main">
        <div className="opening-flow">
          <Hero />
          <HeroFolders />
        </div>
        <BrandStory />
        <WhyWait />
      </main>
      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} <b lang="en">{site.brand}</b> — {t.footer.owner}. {t.footer.rights}
        </p>
      </footer>
    </>
  );
}
