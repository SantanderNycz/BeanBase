import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
    en: "Feed",
    fr: "Flux",
    es: "Feed",
  },
  discoverShops: {
    "pt-PT": "Descobrir Cafés",
    "pt-BR": "Descobrir Cafés",
    en: "Discover Shops",
    fr: "Découvrir des Cafés",
    es: "Descubrir Cafeterías",
  },
  profile: {
    "pt-PT": "Perfil",
    "pt-BR": "Perfil",
    en: "Profile",
    fr: "Profil",
    es: "Perfil",
  },
  logout: {
    "pt-PT": "Sair",
    "pt-BR": "Sair",
    en: "Log out",
    fr: "Déconnexion",
    es: "Cerrar sesión",
  },
  signIn: {
    "pt-PT": "Entrar",
    "pt-BR": "Entrar",
    en: "Sign In",
    fr: "Se connecter",
    es: "Iniciar sesión",
  },
  language: {
    "pt-PT": "Idioma",
    "pt-BR": "Idioma",
    en: "Language",
    fr: "Langue",
    es: "Idioma",
  },
  theme: {
    "pt-PT": "Tema",
    "pt-BR": "Tema",
    en: "Theme",
    fr: "Thème",
    es: "Tema",
  },
  dark: {
    "pt-PT": "Escuro",
    "pt-BR": "Escuro",
    en: "Dark",
    fr: "Sombre",
    es: "Oscuro",
  },
  light: {
    "pt-PT": "Claro",
    "pt-BR": "Claro",
    en: "Light",
    fr: "Clair",
    es: "Claro",
  },
  coffeeFeed: {
    "pt-PT": "Feed de Café",
    "pt-BR": "Feed de Café",
    en: "Coffee Feed",
    fr: "Fil Café",
    es: "Feed de Café",
  },
  feedSubtitle: {
    "pt-PT": "Vê o que a comunidade está a beber.",
    "pt-BR": "Veja o que a comunidade está bebendo.",
    en: "See what the community is drinking.",
    fr: "Voyez ce que la communauté boit.",
    es: "Ve lo que la comunidad está bebiendo.",
  },
  sharePost: {
    "pt-PT": "Partilhar Post",
    "pt-BR": "Compartilhar Post",
    en: "Share Post",
    fr: "Partager",
    es: "Compartir",
  },
  createPost: {
    "pt-PT": "Criar Post",
    "pt-BR": "Criar Post",
    en: "Create a Post",
    fr: "Créer un post",
    es: "Crear post",
  },
  brewingFeed: {
    "pt-PT": "A preparar feed...",
    "pt-BR": "Carregando feed...",
    en: "Brewing feed...",
    fr: "Chargement...",
    es: "Cargando...",
  },
  quietHere: {
    "pt-PT": "Está silencioso aqui",
    "pt-BR": "Está silencioso aqui",
    en: "It's quiet here",
    fr: "C'est calme ici",
    es: "Está tranquilo aquí",
  },
  noPostsYet: {
    "pt-PT": "Ninguém partilhou ainda. Sê o primeiro!",
    "pt-BR": "Ninguém compartilhou ainda. Seja o primeiro!",
    en: "No one has shared their coffee experience yet. Be the first!",
    fr: "Personne n'a encore partagé. Soyez le premier!",
    es: "Nadie ha compartido aún. ¡Sé el primero!",
  },
  createFirstPost: {
    "pt-PT": "Criar Primeiro Post",
    "pt-BR": "Criar Primeiro Post",
    en: "Create First Post",
    fr: "Créer le premier post",
    es: "Crear primer post",
  },
  // Shops Directory
  coffeeShops: {
    "pt-PT": "Cafés",
    "pt-BR": "Cafés",
    en: "Coffee Shops",
    fr: "Cafés",
    es: "Cafeterías",
  },
  discoverShopsSubtitle: {
    "pt-PT": "Descobre e favorita cafés locais.",
    "pt-BR": "Descubra e favorite cafés locais.",
    en: "Discover and favorite local roasters and cafes.",
    fr: "Découvrez et ajoutez des cafés locaux.",
    es: "Descubre y marca cafeterías locales.",
  },
  addShop: {
    "pt-PT": "Adicionar Café",
    "pt-BR": "Adicionar Café",
    en: "Add Shop",
    fr: "Ajouter un café",
    es: "Agregar cafetería",
  },
  addNewCoffeeShop: {
    "pt-PT": "Adicionar novo Café",
    "pt-BR": "Adicionar novo Café",
    en: "Add a new Coffee Shop",
    fr: "Ajouter un nouveau café",
    es: "Agregar nueva cafetería",
  },
  noShopsFound: {
    "pt-PT": "Nenhum café encontrado",
    "pt-BR": "Nenhum café encontrado",
    en: "No shops found",
    fr: "Aucun café trouvé",
    es: "No se encontraron cafeterías",
  },
  noShopsSubtitle: {
    "pt-PT": "Ajuda a comunidade adicionando os teus favoritos.",
    "pt-BR": "Ajude a comunidade adicionando seus favoritos.",
    en: "Help the community by adding your local favorites.",
    fr: "Aidez la communauté en ajoutant vos favoris.",
    es: "Ayuda a la comunidad añadiendo tus favoritos.",
  },
  // CreatePostForm
  whereAreYou: {
    "pt-PT": "Onde estás?",
    "pt-BR": "Onde você está?",
    en: "Where are you?",
    fr: "Où êtes-vous?",
    es: "¿Dónde estás?",
  },
  selectCoffeeShop: {
    "pt-PT": "Seleciona um café",
    "pt-BR": "Selecione um café",
    en: "Select a coffee shop",
    fr: "Sélectionnez un café",
    es: "Selecciona una cafetería",
  },
  yourThoughts: {
    "pt-PT": "Os teus pensamentos",
    "pt-BR": "Seus pensamentos",
    en: "Your thoughts",
    fr: "Vos pensées",
    es: "Tus pensamientos",
  },
  howsTheBrew: {
    "pt-PT": "Como está o café? E o ambiente?",
    "pt-BR": "Como está o café? E o ambiente?",
    en: "How's the brew? The atmosphere?",
    fr: "Comment est le café? L'ambiance?",
    es: "¿Cómo está el café? ¿El ambiente?",
  },
  photos: {
    "pt-PT": "Fotos (máx. 4)",
    "pt-BR": "Fotos (máx. 4)",
    en: "Photos (up to 4)",
    fr: "Photos (jusqu'à 4)",
    es: "Fotos (hasta 4)",
  },
  pasteImageUrl: {
    "pt-PT": "Cola o URL da imagem aqui...",
    "pt-BR": "Cole o URL da imagem aqui...",
    en: "Paste image URL here...",
    fr: "Collez l'URL de l'image ici...",
    es: "Pega la URL de la imagen aquí...",
  },
  add: {
    "pt-PT": "Adicionar",
    "pt-BR": "Adicionar",
    en: "Add",
    fr: "Ajouter",
    es: "Agregar",
  },
  publishing: {
    "pt-PT": "A publicar...",
    "pt-BR": "Publicando...",
    en: "Publishing...",
    fr: "Publication...",
    es: "Publicando...",
  },
  limitReached: {
    "pt-PT": "Limite atingido",
    "pt-BR": "Limite atingido",
    en: "Limit reached",
    fr: "Limite atteinte",
    es: "Límite alcanzado",
  },
  maxPhotos: {
    "pt-PT": "Máximo 4 fotos permitidas",
    "pt-BR": "Máximo 4 fotos permitidas",
    en: "Maximum 4 photos allowed",
    fr: "Maximum 4 photos autorisées",
    es: "Máximo 4 fotos permitidas",
  },
  invalidUrl: {
    "pt-PT": "URL inválido",
    "pt-BR": "URL inválido",
    en: "Invalid URL",
    fr: "URL invalide",
    es: "URL inválido",
  },
  invalidUrlDesc: {
    "pt-PT": "Insere um URL de imagem válido",
    "pt-BR": "Insira um URL de imagem válido",
    en: "Please enter a valid image URL",
    fr: "Veuillez entrer une URL d'image valide",
    es: "Por favor ingresa una URL de imagen válida",
  },
  postCreated: {
    "pt-PT": "Post criado!",
    "pt-BR": "Post criado!",
    en: "Post created!",
    fr: "Publication créée!",
    es: "¡Publicación creada!",
  },
  // CreateShopForm
  shopName: {
    "pt-PT": "Nome do Café",
    "pt-BR": "Nome do Café",
    en: "Shop Name",
    fr: "Nom du café",
    es: "Nombre de la cafetería",
  },
  shopNamePlaceholder: {
    "pt-PT": "ex: O Moinho Diário",
    "pt-BR": "ex: O Moinho Diário",
    en: "e.g. The Daily Grind",
    fr: "ex: Le Moulin Quotidien",
    es: "ej: El Molino Diario",
  },
  location: {
    "pt-PT": "Localização",
    "pt-BR": "Localização",
    en: "Location",
    fr: "Emplacement",
    es: "Ubicación",
  },
  fullAddress: {
    "pt-PT": "Morada completa",
    "pt-BR": "Endereço completo",
    en: "Full street address",
    fr: "Adresse complète",
    es: "Dirección completa",
  },
  description: {
    "pt-PT": "Descrição",
    "pt-BR": "Descrição",
    en: "Description",
    fr: "Description",
    es: "Descripción",
  },
  shopDescPlaceholder: {
    "pt-PT": "O que torna este lugar especial? Ambiente, café...",
    "pt-BR": "O que torna este lugar especial? Ambiente, café...",
    en: "What makes this place special? Vibe, coffee beans, seating...",
    fr: "Qu'est-ce qui rend cet endroit spécial?",
    es: "¿Qué hace especial este lugar?",
  },
  coverImageUrl: {
    "pt-PT": "URL da Imagem de Capa (Opcional)",
    "pt-BR": "URL da Imagem de Capa (Opcional)",
    en: "Cover Image URL (Optional)",
    fr: "URL de l'image de couverture (Optionnel)",
    es: "URL de imagen de portada (Opcional)",
  },
  addingShop: {
    "pt-PT": "A adicionar...",
    "pt-BR": "Adicionando...",
    en: "Adding Shop...",
    fr: "Ajout en cours...",
    es: "Agregando...",
  },
  addCoffeeShop: {
    "pt-PT": "Adicionar Café",
    "pt-BR": "Adicionar Café",
    en: "Add Coffee Shop",
    fr: "Ajouter le café",
    es: "Agregar cafetería",
  },
  shopAdded: {
    "pt-PT": "Café adicionado!",
    "pt-BR": "Café adicionado!",
    en: "Coffee Shop added!",
    fr: "Café ajouté!",
    es: "¡Cafetería agregada!",
  },
  loading: {
    "pt-PT": "A carregar...",
    "pt-BR": "Carregando...",
    en: "Loading...",
    fr: "Chargement...",
    es: "Cargando...",
  },
  shopNotFound: {
    "pt-PT": "Café não encontrado",
    "pt-BR": "Café não encontrado",
    en: "Shop not found",
    fr: "Café introuvable",
    es: "Cafetería no encontrada",
  },
  backToDirectory: {
    "pt-PT": "Voltar ao Directório",
    "pt-BR": "Voltar ao Diretório",
    en: "Back to Directory",
    fr: "Retour à l'annuaire",
    es: "Volver al directorio",
  },
  directory: {
    "pt-PT": "Directório",
    "pt-BR": "Diretório",
    en: "Directory",
    fr: "Annuaire",
    es: "Directorio",
  },
  saved: {
    "pt-PT": "Guardado",
    "pt-BR": "Salvo",
    en: "Saved",
    fr: "Sauvegardé",
    es: "Guardado",
  },
  favorite: {
    "pt-PT": "Favoritar",
    "pt-BR": "Favoritar",
    en: "Favorite",
    fr: "Favori",
    es: "Favorito",
  },
  directions: {
    "pt-PT": "Direções",
    "pt-BR": "Direções",
    en: "Directions",
    fr: "Itinéraire",
    es: "Direcciones",
  },
  communityReviews: {
    "pt-PT": "Fotos & Avaliações da Comunidade",
    "pt-BR": "Fotos & Avaliações da Comunidade",
    en: "Community Photos & Reviews",
    fr: "Photos & Avis de la communauté",
    es: "Fotos y reseñas de la comunidad",
  },
  posts: {
    "pt-PT": "Posts",
    "pt-BR": "Posts",
    en: "Posts",
    fr: "Publications",
    es: "Publicaciones",
  },
  noReviewsYet: {
    "pt-PT": "Ainda sem avaliações para",
    "pt-BR": "Ainda sem avaliações para",
    en: "No reviews yet for",
    fr: "Pas encore d'avis pour",
    es: "Sin reseñas aún para",
  },
  beFirstToPost: {
    "pt-PT": "Sê o primeiro a publicar",
    "pt-BR": "Seja o primeiro a publicar",
    en: "Be the first to post",
    fr: "Soyez le premier à publier",
    es: "Sé el primero en publicar",
  },
  pageNotFound: {
    "pt-PT": "Página não encontrada",
    "pt-BR": "Página não encontrada",
    en: "Page Not Found",
    fr: "Page introuvable",
    es: "Página no encontrada",
  },
  pageNotFoundDesc: {
    "pt-PT": "A página que procuras não existe.",
    "pt-BR": "A página que você procura não existe.",
    en: "The page you're looking for doesn't exist.",
    fr: "La page que vous cherchez n'existe pas.",
    es: "La página que buscas no existe.",
  },
  backToHome: {
    "pt-PT": "Voltar ao início",
    "pt-BR": "Voltar ao início",
    en: "Back to Home",
    fr: "Retour à l'accueil",
    es: "Volver al inicio",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

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
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
