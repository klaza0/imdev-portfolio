import type { Metadata } from "next";
import { dictionaries } from "@/lib/content";
import { fontVars } from "@/lib/fonts";
import { LangProvider } from "@/lib/lang";
import "../globals.css";

const t = dictionaries.en;

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: { languages: { ar: "/" } },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={fontVars}>
        <LangProvider lang="en">{children}</LangProvider>
      </body>
    </html>
  );
}
