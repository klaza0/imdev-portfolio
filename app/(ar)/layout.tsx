import type { Metadata } from "next";
import { dictionaries } from "@/lib/content";
import { fontVars } from "@/lib/fonts";
import { LangProvider } from "@/lib/lang";
import "../globals.css";

const t = dictionaries.ar;

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: { languages: { en: "/en" } },
};

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={fontVars}>
        <LangProvider lang="ar">{children}</LangProvider>
      </body>
    </html>
  );
}
