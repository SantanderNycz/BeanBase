import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "pt-PT" | "pt-BR" | "en" | "fr" | "es";

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  feed: {
    "pt-PT": "Feed",
    "pt-BR": "Feed",
    "en": "Feed",
    "fr": "Flux",
    "es": "Feed",
  },
  discoverShops: {
    "pt-PT": "Descobrir Cafés",
    "pt-BR": "Descobrir Cafés",
    "en": "Discover Shops",
    "fr": "Découvrir des Cafés",
    "es": "Descubrir Cafeterías",
  },
  profile: {
    "pt-PT": "Perfil",
    "pt-BR": "Perfil",
    "en": "Profile",
    "fr": "Profil",
    "es": "Perfil",
  },
  logout: {
    "pt-PT": "Sair",
    "pt-BR": "Sair",
    "en": "Log out",
    "fr": "Déconnexion",
    "es": "Cerrar sesión",
  },
  signIn: {
    "pt-PT": "Entrar",
    "pt-BR": "Entrar",
    "en": "Sign In",
    "fr": "Se connecter",
    "es": "Iniciar sesión",
  },
  language: {
    "pt-PT": "Idioma",
    "pt-BR": "Idioma",
    "en": "Language",
    "fr": "Langue",
    "es": "Idioma",
  },
  theme: {
    "pt-PT": "Tema",
    "pt-BR": "Tema",
    "en": "Theme",
    "fr": "Thème",
    "es": "Tema",
  },
  dark: {
    "pt-PT": "Escuro",
    "pt-BR": "Escuro",
    "en": "Dark",
    "fr": "Sombre",
    "es": "Oscuro",
  },
  light: {
    "pt-PT": "Claro",
    "pt-BR": "Claro",
    "en": "Light",
    "fr": "Clair",
    "es": "Claro",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "pt-BR";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
