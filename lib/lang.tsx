"use client";

import { createContext, useContext } from "react";
import { dictionaries, type Dict, type Lang } from "./content";

const LangContext = createContext<Lang>("ar");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function useDict(): Dict {
  return dictionaries[useContext(LangContext)];
}
