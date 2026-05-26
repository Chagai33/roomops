import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dictionaries } from '../i18n/dictionaries';
import type { Language, Dictionary } from '../i18n/dictionaries';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  isRtl: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'he',
      t: dictionaries['he'],
      isRtl: true,
      setLanguage: (lang: Language) => {
        set({
          language: lang,
          t: dictionaries[lang],
          isRtl: lang === 'he',
        });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
      },
    }),
    {
      name: 'roomops-app-storage',
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Re-apply document level attributes upon load
          document.documentElement.lang = state.language;
          document.documentElement.dir = state.language === 'he' ? 'rtl' : 'ltr';
          state.t = dictionaries[state.language];
          state.isRtl = state.language === 'he';
        }
      }
    }
  )
);
