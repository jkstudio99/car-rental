import { create } from "zustand";
import type { Locale } from "@/lib/i18n";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: (localStorage.getItem("locale") as Locale) || "th",
  setLocale: (locale) => {
    localStorage.setItem("locale", locale);
    set({ locale });
  },
}));
