"use client";

import { useDict } from "@/lib/lang";
import GlassFolder from "./GlassFolder";
import ToolsFolder from "./ToolsFolder";

export default function HeroFolders() {
  const t = useDict();
  return (
    <section id="tools" className="folder-row" aria-label={t.folders.region}>
      <div className="tools-slot">
        <ToolsFolder />
      </div>
      {t.folders.items.map((folder, i) => (
        <GlassFolder key={folder.label} label={folder.label} meta={folder.meta} files={folder.files} variant={i} />
      ))}
    </section>
  );
}
