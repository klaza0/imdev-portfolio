import { Amiri, Bricolage_Grotesque, Readex_Pro } from "next/font/google";

export const sans = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const serif = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const latin = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

export const fontVars = `${sans.variable} ${serif.variable} ${latin.variable}`;
