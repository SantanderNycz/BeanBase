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
    "pt-BR": "Coffeed",
    "pt-PT": "Coffeed",
    en: "Coffeed",
    fr: "Coffeed",
    es: "Coffeed",
  },
  discoverShops: {
    "pt-BR": "Descobrir Cafés",
    "pt-PT": "Descobrir Cafés",
    en: "Discover Shops",
    fr: "Découvrir des Cafés",
    es: "Descubrir Cafeterías",
  },
  profile: {
    "pt-BR": "Perfil",
    "pt-PT": "Perfil",
    en: "Profile",
    fr: "Profil",
    es: "Perfil",
  },
  logout: {
    "pt-BR": "Sair",
    "pt-PT": "Sair",
    en: "Log out",
    fr: "Déconnexion",
    es: "Cerrar sesión",
  },
  signIn: {
    "pt-BR": "Entrar",
    "pt-PT": "Entrar",
    en: "Sign In",
    fr: "Se connecter",
    es: "Iniciar sesión",
  },
  language: {
    "pt-BR": "Idioma",
    "pt-PT": "Idioma",
    en: "Language",
    fr: "Langue",
    es: "Idioma",
  },
  theme: {
    "pt-BR": "Tema",
    "pt-PT": "Tema",
    en: "Theme",
    fr: "Thème",
    es: "Tema",
  },
  dark: {
    "pt-BR": "Escuro",
    "pt-PT": "Escuro",
    en: "Dark",
    fr: "Sombre",
    es: "Oscuro",
  },
  light: {
    "pt-BR": "Claro",
    "pt-PT": "Claro",
    en: "Light",
    fr: "Clair",
    es: "Claro",
  },
  coffeeFeed: {
    "pt-BR": "Feed de Café",
    "pt-PT": "Feed de Café",
    en: "Coffee Feed",
    fr: "Fil Café",
    es: "Feed de Café",
  },
  feedSubtitle: {
    "pt-BR": "Veja o que a comunidade está bebendo.",
    "pt-PT": "Vê o que a comunidade está a beber.",
    en: "See what the community is drinking.",
    fr: "Voyez ce que la communauté boit.",
    es: "Ve lo que la comunidad está bebiendo.",
  },
  sharePost: {
    "pt-BR": "Compartilhar Post",
    "pt-PT": "Partilhar Post",
    en: "Share Post",
    fr: "Partager",
    es: "Compartir",
  },
  createPost: {
    "pt-BR": "Criar Post",
    "pt-PT": "Criar Post",
    en: "Create a Post",
    fr: "Créer un post",
    es: "Crear post",
  },
  brewingFeed: {
    "pt-BR": "Carregando feed...",
    "pt-PT": "A preparar feed...",
    en: "Brewing feed...",
    fr: "Chargement...",
    es: "Cargando...",
  },
  quietHere: {
    "pt-BR": "Está silencioso aqui",
    "pt-PT": "Está silencioso aqui",
    en: "It's quiet here",
    fr: "C'est calme ici",
    es: "Está tranquilo aquí",
  },
  noPostsYet: {
    "pt-BR": "Ninguém compartilhou ainda. Seja o primeiro!",
    "pt-PT": "Ninguém partilhou ainda. Sê o primeiro!",
    en: "No one has shared their coffee experience yet. Be the first!",
    fr: "Personne n'a encore partagé. Soyez le premier!",
    es: "Nadie ha compartido aún. ¡Sé el primero!",
  },
  createFirstPost: {
    "pt-BR": "Criar Primeiro Post",
    "pt-PT": "Criar Primeiro Post",
    en: "Create First Post",
    fr: "Créer le premier post",
    es: "Crear primer post",
  },
  // Shops Directory
  coffeeShops: {
    "pt-BR": "Cafés",
    "pt-PT": "Cafés",
    en: "Coffee Shops",
    fr: "Cafés",
    es: "Cafeterías",
  },
  discoverShopsSubtitle: {
    "pt-BR": "Descubra e favorite cafés locais.",
    "pt-PT": "Descobre e favorita cafés locais.",
    en: "Discover and favorite local roasters and cafes.",
    fr: "Découvrez et ajoutez des cafés locaux.",
    es: "Descubre y marca cafeterías locales.",
  },
  addShop: {
    "pt-BR": "Adicionar Café",
    "pt-PT": "Adicionar Café",
    en: "Add Shop",
    fr: "Ajouter un café",
    es: "Agregar cafetería",
  },
  addNewCoffeeShop: {
    "pt-BR": "Adicionar novo Café",
    "pt-PT": "Adicionar novo Café",
    en: "Add a new Coffee Shop",
    fr: "Ajouter un nouveau café",
    es: "Agregar nueva cafetería",
  },
  noShopsFound: {
    "pt-BR": "Nenhum café encontrado",
    "pt-PT": "Nenhum café encontrado",
    en: "No shops found",
    fr: "Aucun café trouvé",
    es: "No se encontraron cafeterías",
  },
  noShopsSubtitle: {
    "pt-BR": "Ajude a comunidade adicionando seus favoritos.",
    "pt-PT": "Ajuda a comunidade adicionando os teus favoritos.",
    en: "Help the community by adding your local favorites.",
    fr: "Aidez la communauté en ajoutant vos favoris.",
    es: "Ayuda a la comunidad añadiendo tus favoritos.",
  },
  // CreatePostForm
  whereAreYou: {
    "pt-BR": "Onde você está?",
    "pt-PT": "Onde estás?",
    en: "Where are you?",
    fr: "Où êtes-vous?",
    es: "¿Dónde estás?",
  },
  selectCoffeeShop: {
    "pt-BR": "Selecione um café",
    "pt-PT": "Seleciona um café",
    en: "Select a coffee shop",
    fr: "Sélectionnez un café",
    es: "Selecciona una cafetería",
  },
  yourThoughts: {
    "pt-BR": "Seus pensamentos",
    "pt-PT": "Os teus pensamentos",
    en: "Your thoughts",
    fr: "Vos pensées",
    es: "Tus pensamientos",
  },
  howsTheBrew: {
    "pt-BR": "Como está o café? E o ambiente?",
    "pt-PT": "Como está o café? E o ambiente?",
    en: "How's the brew? The atmosphere?",
    fr: "Comment est le café? L'ambiance?",
    es: "¿Cómo está el café? ¿El ambiente?",
  },
  photos: {
    "pt-BR": "Fotos (máx. 4)",
    "pt-PT": "Fotos (máx. 4)",
    en: "Photos (up to 4)",
    fr: "Photos (jusqu'à 4)",
    es: "Fotos (hasta 4)",
  },
  pasteImageUrl: {
    "pt-BR": "Cole o URL da imagem aqui...",
    "pt-PT": "Cola o URL da imagem aqui...",
    en: "Paste image URL here...",
    fr: "Collez l'URL de l'image ici...",
    es: "Pega la URL de la imagen aquí...",
  },
  add: {
    "pt-BR": "Adicionar",
    "pt-PT": "Adicionar",
    en: "Add",
    fr: "Ajouter",
    es: "Agregar",
  },
  publishing: {
    "pt-BR": "Publicando...",
    "pt-PT": "A publicar...",
    en: "Publishing...",
    fr: "Publication...",
    es: "Publicando...",
  },
  limitReached: {
    "pt-BR": "Limite atingido",
    "pt-PT": "Limite atingido",
    en: "Limit reached",
    fr: "Limite atteinte",
    es: "Límite alcanzado",
  },
  maxPhotos: {
    "pt-BR": "Máximo 4 fotos permitidas",
    "pt-PT": "Máximo 4 fotos permitidas",
    en: "Maximum 4 photos allowed",
    fr: "Maximum 4 photos autorisées",
    es: "Máximo 4 fotos permitidas",
  },
  invalidUrl: {
    "pt-BR": "URL inválido",
    "pt-PT": "URL inválido",
    en: "Invalid URL",
    fr: "URL invalide",
    es: "URL inválido",
  },
  invalidUrlDesc: {
    "pt-BR": "Insira um URL de imagem válido",
    "pt-PT": "Insere um URL de imagem válido",
    en: "Please enter a valid image URL",
    fr: "Veuillez entrer une URL d'image valide",
    es: "Por favor ingresa una URL de imagen válida",
  },
  postCreated: {
    "pt-BR": "Post criado!",
    "pt-PT": "Post criado!",
    en: "Post created!",
    fr: "Publication créée!",
    es: "¡Publicación creada!",
  },
  // CreateShopForm
  shopName: {
    "pt-BR": "Nome do Café",
    "pt-PT": "Nome do Café",
    en: "Shop Name",
    fr: "Nom du café",
    es: "Nombre de la cafetería",
  },
  shopNamePlaceholder: {
    "pt-BR": "ex: O Moinho Diário",
    "pt-PT": "ex: O Moinho Diário",
    en: "e.g. The Daily Grind",
    fr: "ex: Le Moulin Quotidien",
    es: "ej: El Molino Diario",
  },
  location: {
    "pt-BR": "Localização",
    "pt-PT": "Localização",
    en: "Location",
    fr: "Emplacement",
    es: "Ubicación",
  },
  fullAddress: {
    "pt-BR": "Endereço completo",
    "pt-PT": "Morada completa",
    en: "Full street address",
    fr: "Adresse complète",
    es: "Dirección completa",
  },
  description: {
    "pt-BR": "Descrição",
    "pt-PT": "Descrição",
    en: "Description",
    fr: "Description",
    es: "Descripción",
  },
  shopDescPlaceholder: {
    "pt-BR": "O que torna este lugar especial? Ambiente, café...",
    "pt-PT": "O que torna este lugar especial? Ambiente, café...",
    en: "What makes this place special? Vibe, coffee beans, seating...",
    fr: "Qu'est-ce qui rend cet endroit spécial?",
    es: "¿Qué hace especial este lugar?",
  },
  coverImageUrl: {
    "pt-BR": "URL da Imagem de Capa (Opcional)",
    "pt-PT": "URL da Imagem de Capa (Opcional)",
    en: "Cover Image URL (Optional)",
    fr: "URL de l'image de couverture (Optionnel)",
    es: "URL de imagen de portada (Opcional)",
  },
  addingShop: {
    "pt-BR": "Adicionando...",
    "pt-PT": "A adicionar...",
    en: "Adding Shop...",
    fr: "Ajout en cours...",
    es: "Agregando...",
  },
  addCoffeeShop: {
    "pt-BR": "Adicionar Café",
    "pt-PT": "Adicionar Café",
    en: "Add Coffee Shop",
    fr: "Ajouter le café",
    es: "Agregar cafetería",
  },
  shopAdded: {
    "pt-BR": "Café adicionado!",
    "pt-PT": "Café adicionado!",
    en: "Coffee Shop added!",
    fr: "Café ajouté!",
    es: "¡Cafetería agregada!",
  },
  loading: {
    "pt-BR": "Carregando...",
    "pt-PT": "A carregar...",
    en: "Loading...",
    fr: "Chargement...",
    es: "Cargando...",
  },
  shopNotFound: {
    "pt-BR": "Café não encontrado",
    "pt-PT": "Café não encontrado",
    en: "Shop not found",
    fr: "Café introuvable",
    es: "Cafetería no encontrada",
  },
  backToDirectory: {
    "pt-BR": "Voltar ao Início",
    "pt-PT": "Voltar ao Início",
    en: "Back to Home",
    fr: "Retour au debut",
    es: "Volver al inicio",
  },
  directory: {
    "pt-BR": "Início",
    "pt-PT": "Início",
    en: "Home",
    fr: "Annuaire",
    es: "Home",
  },
  saved: {
    "pt-BR": "Salvo",
    "pt-PT": "Guardado",
    en: "Saved",
    fr: "Sauvegardé",
    es: "Guardado",
  },
  favorite: {
    "pt-BR": "Favoritar",
    "pt-PT": "Favoritar",
    en: "Favorite",
    fr: "Favori",
    es: "Favorito",
  },
  directions: {
    "pt-BR": "Direções",
    "pt-PT": "Direções",
    en: "Directions",
    fr: "Itinéraire",
    es: "Direcciones",
  },
  communityReviews: {
    "pt-BR": "Fotos & Avaliações da Comunidade",
    "pt-PT": "Fotos & Avaliações da Comunidade",
    en: "Community Photos & Reviews",
    fr: "Photos & Avis de la communauté",
    es: "Fotos y reseñas de la comunidad",
  },
  posts: {
    "pt-BR": "Posts",
    "pt-PT": "Posts",
    en: "Posts",
    fr: "Publications",
    es: "Publicaciones",
  },
  noReviewsYet: {
    "pt-BR": "Ainda sem avaliações para",
    "pt-PT": "Ainda sem avaliações para",
    en: "No reviews yet for",
    fr: "Pas encore d'avis pour",
    es: "Sin reseñas aún para",
  },
  beFirstToPost: {
    "pt-BR": "Seja o primeiro a publicar",
    "pt-PT": "Sê o primeiro a publicar",
    en: "Be the first to post",
    fr: "Soyez le premier à publier",
    es: "Sé el primero en publicar",
  },
  pageNotFound: {
    "pt-BR": "Página não encontrada",
    "pt-PT": "Página não encontrada",
    en: "Page Not Found",
    fr: "Page introuvable",
    es: "Página no encontrada",
  },
  pageNotFoundDesc: {
    "pt-BR": "A página que você procura não existe.",
    "pt-PT": "A página que procuras não existe.",
    en: "The page you're looking for doesn't exist.",
    fr: "La page que vous cherchez n'existe pas.",
    es: "La página que buscas no existe.",
  },
  backToHome: {
    "pt-BR": "Voltar ao início",
    "pt-PT": "Voltar ao início",
    en: "Back to Home",
    fr: "Retour à l'accueil",
    es: "Volver al inicio",
  },
  landingTagline: {
    "pt-BR": "Junte-se à comunidade de amantes de café",
    "pt-PT": "Junta-te à comunidade de amantes de café",
    en: "Join the community of coffee lovers",
    fr: "Rejoignez la communauté des amateurs de café",
    es: "Únete a la comunidad de amantes del café",
  },
  landingHeroLine1: {
    "pt-BR": "Descubra o seu próximo",
    "pt-PT": "Descobre o teu próximo",
    en: "Discover your next",
    fr: "Découvrez votre prochain",
    es: "Descubre tu próximo",
  },
  landingHeroHighlight: {
    "pt-BR": "café perfeito",
    "pt-PT": "café perfeito",
    en: "perfect cup",
    fr: "café parfait",
    es: "café perfecto",
  },
  landingSubtitle: {
    "pt-BR":
      "Compartilhe seus lugares favoritos, avalie os melhores cafés e explore um diretório de cafeterias.",
    "pt-PT":
      "Partilha os teus locais favoritos, avalia os melhores cafés e explora um directório de cafeterias.",
    en: "Share your favorite spots, review the best brews, and explore a curated directory of coffee shops.",
    fr: "Partagez vos endroits préférés, évaluez les meilleures préparations et explorez un répertoire de cafés.",
    es: "Comparte tus lugares favoritos, reseña las mejores infusiones y explora un directorio de cafeterías.",
  },
  getStarted: {
    "pt-BR": "Começar",
    "pt-PT": "Começar",
    en: "Get Started",
    fr: "Commencer",
    es: "Empezar",
  },
  exploreShops: {
    "pt-BR": "Explorar Cafés",
    "pt-PT": "Explorar Cafés",
    en: "Explore Shops",
    fr: "Explorer les cafés",
    es: "Explorar cafeterías",
  },
  featureDiscoverTitle: {
    "pt-BR": "Descubra o Local",
    "pt-PT": "Descobre o Local",
    en: "Discover Local",
    fr: "Découvrir Localement",
    es: "Descubrir Local",
  },
  featureDiscoverDesc: {
    "pt-BR": "Encontre joias escondidas e cafés bem avaliados perto de você.",
    "pt-PT": "Encontra joias escondidas e cafés bem avaliados perto de ti.",
    en: "Find hidden gems and highly rated coffee shops near you.",
    fr: "Trouvez des perles rares et des cafés bien notés près de chez vous.",
    es: "Encuentra joyas escondidas y cafeterías bien valoradas cerca de ti.",
  },
  featureShareTitle: {
    "pt-BR": "Compartilhe Avaliações",
    "pt-PT": "Partilha Avaliações",
    en: "Share Reviews",
    fr: "Partager des Avis",
    es: "Compartir Reseñas",
  },
  featureShareDesc: {
    "pt-BR":
      "Publique suas experiências, adicione fotos e participe de conversas.",
    "pt-PT":
      "Publica as tuas experiências, junta fotos e participa em conversas.",
    en: "Post your experiences, attach photos, and engage in conversations.",
    fr: "Publiez vos expériences, joignez des photos et engagez des conversations.",
    es: "Publica tus experiencias, adjunta fotos y participa en conversaciones.",
  },
  featureFavTitle: {
    "pt-BR": "Salve Favoritos",
    "pt-PT": "Guarda Favoritos",
    en: "Save Favorites",
    fr: "Sauvegarder les Favoris",
    es: "Guardar Favoritos",
  },
  featureFavDesc: {
    "pt-BR": "Mantenha uma coleção pessoal dos seus melhores cafés.",
    "pt-PT": "Mantém uma coleção pessoal dos teus melhores cafés.",
    en: "Keep a personal collection of your top-tier shops.",
    fr: "Gardez une collection personnelle de vos meilleurs cafés.",
    es: "Mantén una colección personal de tus mejores cafeterías.",
  },
  loginError: {
    "pt-BR": "Erro",
    "pt-PT": "Erro",
    en: "Error",
    fr: "Erreur",
    es: "Error",
  },
  loginErrorDesc: {
    "pt-BR": "Algo deu errado",
    "pt-PT": "Algo correu mal",
    en: "Something went wrong",
    fr: "Quelque chose s'est mal passé",
    es: "Algo salió mal",
  },
  createAccount: {
    "pt-BR": "Criar conta",
    "pt-PT": "Criar conta",
    en: "Create account",
    fr: "Créer un compte",
    es: "Crear cuenta",
  },
  welcomeBack: {
    "pt-BR": "Bem-vindo de volta",
    "pt-PT": "Bem-vindo de volta",
    en: "Welcome back",
    fr: "Bon retour",
    es: "Bienvenido de nuevo",
  },
  continueWithGoogle: {
    "pt-BR": "Continuar com Google",
    "pt-PT": "Continuar com Google",
    en: "Continue with Google",
    fr: "Continuer avec Google",
    es: "Continuar con Google",
  },
  or: { "pt-BR": "ou", "pt-PT": "ou", en: "or", fr: "ou", es: "o" },
  firstName: {
    "pt-BR": "Nome",
    "pt-PT": "Nome",
    en: "First Name",
    fr: "Prénom",
    es: "Nombre",
  },
  lastName: {
    "pt-BR": "Sobrenome",
    "pt-PT": "Apelido",
    en: "Last Name",
    fr: "Nom de famille",
    es: "Apellido",
  },
  processing: {
    "pt-BR": "Processando...",
    "pt-PT": "A processar...",
    en: "Processing...",
    fr: "Traitement...",
    es: "Procesando...",
  },
  alreadyHaveAccount: {
    "pt-BR": "Já tem conta?",
    "pt-PT": "Já tens conta?",
    en: "Already have an account?",
    fr: "Vous avez déjà un compte?",
    es: "¿Ya tienes cuenta?",
  },
  dontHaveAccount: {
    "pt-BR": "Ainda não tem conta?",
    "pt-PT": "Ainda não tens conta?",
    en: "Don't have an account?",
    fr: "Vous n'avez pas de compte?",
    es: "¿No tienes cuenta?",
  },
  register: {
    "pt-BR": "Registrar",
    "pt-PT": "Registar",
    en: "Register",
    fr: "S'inscrire",
    es: "Registrarse",
  },
  notSignedIn: {
    "pt-BR": "Não autenticado",
    "pt-PT": "Não autenticado",
    en: "Not Signed In",
    fr: "Non connecté",
    es: "No autenticado",
  },
  notSignedInDesc: {
    "pt-BR": "Você precisa entrar para ver seu perfil.",
    "pt-PT": "Precisas de entrar para ver o teu perfil.",
    en: "You need to sign in to view your profile.",
    fr: "Vous devez vous connecter pour voir votre profil.",
    es: "Necesitas iniciar sesión para ver tu perfil.",
  },
  editProfile: {
    "pt-BR": "Editar Perfil",
    "pt-PT": "Editar Perfil",
    en: "Edit Profile",
    fr: "Modifier le profil",
    es: "Editar perfil",
  },
  savedShops: {
    "pt-BR": "Cafés Salvos",
    "pt-PT": "Cafés Guardados",
    en: "Saved Shops",
    fr: "Cafés sauvegardés",
    es: "Cafeterías guardadas",
  },
  myPosts: {
    "pt-BR": "Meus Posts",
    "pt-PT": "Os meus Posts",
    en: "My Posts",
    fr: "Mes publications",
    es: "Mis publicaciones",
  },
  noPostsProfile: {
    "pt-BR": "Você ainda não compartilhou nenhuma experiência.",
    "pt-PT": "Ainda não partilhaste nenhuma experiência.",
    en: "You haven't shared any experiences yet.",
    fr: "Vous n'avez pas encore partagé d'expériences.",
    es: "Aún no has compartido ninguna experiencia.",
  },
  noFavoritesProfile: {
    "pt-BR": "Você ainda não salvou nenhum café.",
    "pt-PT": "Ainda não guardaste nenhum café.",
    en: "You haven't saved any coffee shops yet.",
    fr: "Vous n'avez pas encore sauvegardé de cafés.",
    es: "Aún no has guardado ninguna cafetería.",
  },
  notifications: {
    "pt-BR": "Notificações",
    "pt-PT": "Notificações",
    en: "Notifications",
    fr: "Notifications",
    es: "Notificaciones",
  },
  noNotifications: {
    "pt-BR": "Sem notificações",
    "pt-PT": "Sem notificações",
    en: "No notifications",
    fr: "Aucune notification",
    es: "Sin notificaciones",
  },
  notifLike: {
    "pt-BR": "alguém curtiu seu post",
    "pt-PT": "alguém gostou do teu post",
    en: "someone liked your post",
    fr: "quelqu'un a aimé votre post",
    es: "alguien le gustó tu post",
  },
  notifComment: {
    "pt-BR": "alguém comentou no seu post",
    "pt-PT": "alguém comentou no teu post",
    en: "someone commented on your post",
    fr: "quelqu'un a commenté votre post",
    es: "alguien comentó en tu post",
  },
  postNotFound: {
    "pt-BR": "Post não encontrado",
    "pt-PT": "Post não encontrado",
    en: "Post not found",
    fr: "Publication introuvable",
    es: "Publicación no encontrada",
  },
  searchPlaceholder: {
    "pt-BR": "Pesquisar cafés e posts...",
    "pt-PT": "Pesquisar cafés e posts...",
    en: "Search shops and posts...",
    fr: "Rechercher cafés et posts...",
    es: "Buscar cafeterías y posts...",
  },
  noResults: {
    "pt-BR": "Sem resultados",
    "pt-PT": "Sem resultados",
    en: "No results found",
    fr: "Aucun résultat",
    es: "Sin resultados",
  },
  profileUpdated: {
    "pt-BR": "Perfil atualizado!",
    "pt-PT": "Perfil atualizado!",
    en: "Profile updated!",
    fr: "Profil mis à jour!",
    es: "¡Perfil actualizado!",
  },
  profilePhoto: {
    "pt-BR": "URL da foto de perfil",
    "pt-PT": "URL da foto de perfil",
    en: "Profile photo URL",
    fr: "URL de la photo de profil",
    es: "URL de la foto de perfil",
  },
  saveChanges: {
    "pt-BR": "Salvar alterações",
    "pt-PT": "Guardar alterações",
    en: "Save changes",
    fr: "Enregistrer",
    es: "Guardar cambios",
  },
  uploadImage: {
    "pt-BR": "Clique para fazer upload de imagem",
    "pt-PT": "Clica para fazer upload de imagem",
    en: "Click to upload image",
    fr: "Cliquez pour télécharger une image",
    es: "Haz clic para subir una imagen",
  },
  uploadSuccess: {
    "pt-BR": "Imagem carregada com sucesso!",
    "pt-PT": "Imagem carregada com sucesso!",
    en: "Image uploaded successfully!",
    fr: "Image téléchargée avec succès!",
    es: "¡Imagen subida con éxito!",
  },
  uploadError: {
    "pt-BR": "Erro ao carregar imagem",
    "pt-PT": "Erro ao carregar imagem",
    en: "Failed to upload image",
    fr: "Échec du téléchargement",
    es: "Error al subir imagen",
  },
  delete: {
    "pt-BR": "Apagar",
    "pt-PT": "Apagar",
    en: "Delete",
    fr: "Supprimer",
    es: "Eliminar",
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
