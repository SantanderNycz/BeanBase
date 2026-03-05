# ☕ BeanBase

**BeanBase** é uma rede social para amantes de café — partilha as tuas experiências, descobre novos cafés e conecta-te com a comunidade.

<!-- ![BeanBase](https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=400&fit=crop) -->

![BeanBase](https://drive.google.com/file/d/1PPCfd5CKom1gdqe-twFiCGVV7_wTt7Rh/view?usp=sharing)

---

## 🚀 Demo

🔗 [beanbase.up.railway.app](https://beanbase.up.railway.app)

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — Login com Google OAuth ou email/password
- 📝 **Posts** — Cria, apaga e interage com posts da comunidade
- 💬 **Comentários** — Comenta e apaga comentários em posts
- ❤️ **Likes** — Gosta de posts de outros utilizadores
- 🏪 **Directório de Cafés** — Descobre e adiciona cafés locais
- ⭐ **Favoritos** — Guarda os teus cafés favoritos
- 🔔 **Notificações** — Recebe notificações de likes e comentários
- 🔍 **Pesquisa** — Pesquisa cafés e posts em tempo real
- 👤 **Perfil** — Edita o teu perfil e vê os teus posts
- 🌍 **Multilíngue** — Português (PT/BR), Inglês, Francês e Espanhol
- 🌙 **Tema** — Modo claro e escuro

---

## 🛠️ Stack Tecnológica

### Frontend

| Tecnologia            | Uso                      |
| --------------------- | ------------------------ |
| React 18              | Interface de utilizador  |
| TypeScript            | Tipagem estática         |
| Vite                  | Bundler e dev server     |
| Tailwind CSS          | Estilização              |
| shadcn/ui             | Componentes de UI        |
| TanStack Query        | Gestão de estado e cache |
| Wouter                | Routing                  |
| React Hook Form + Zod | Formulários e validação  |

### Backend

| Tecnologia      | Uso                 |
| --------------- | ------------------- |
| Express.js      | Servidor HTTP       |
| TypeScript      | Tipagem estática    |
| Drizzle ORM     | ORM para PostgreSQL |
| Passport.js     | Autenticação        |
| bcryptjs        | Hash de passwords   |
| express-session | Gestão de sessões   |

### Base de Dados & Infra

| Tecnologia        | Uso                       |
| ----------------- | ------------------------- |
| PostgreSQL (Neon) | Base de dados em produção |
| Railway           | Deploy do servidor        |
| Google OAuth 2.0  | Autenticação social       |

---

## 📁 Estrutura do Projeto

```
BeanBase/
├── client/                   # Frontend React
│   └── src/
│       ├── components/
│       │   ├── forms/        # CreatePostForm, CreateShopForm
│       │   ├── layout/       # Navbar
│       │   └── shared/       # PostCard, CommentDialog, CoffeeShopCard
│       ├── hooks/            # use-auth, use-posts, use-coffee-shops, etc.
│       ├── lib/              # queryClient, utils
│       └── pages/            # Home, Login, Landing, Profile, etc.
├── server/                   # Backend Express
│   ├── auth/                 # Autenticação (Passport, sessões, rotas)
│   ├── routes.ts             # Rotas da API
│   ├── storage.ts            # Camada de dados (DB + Memória)
│   └── index.ts              # Entry point
├── shared/                   # Código partilhado
│   ├── models/               # Schema da BD (auth, notifications)
│   ├── routes.ts             # Definição das rotas da API
│   └── schema.ts             # Schema principal (posts, comments, etc.)
├── script/
│   └── build.ts              # Script de build (esbuild + vite)
├── drizzle.config.ts
└── vercel.json / railway.toml
```

---

## ⚙️ Instalação Local

### Pré-requisitos

- Node.js 20+
- PostgreSQL (ou conta no [Neon](https://neon.tech))

### 1. Clona o repositório

```bash
git clone https://github.com/SantanderNycz/BeanBase.git
cd BeanBase
```

### 2. Instala as dependências

```bash
npm install
```

### 3. Configura as variáveis de ambiente

Cria um ficheiro `.env` na raiz:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
SESSION_SECRET=uma-string-aleatoria-segura
GOOGLE_CLIENT_ID=o-teu-google-client-id
GOOGLE_CLIENT_SECRET=o-teu-google-client-secret
```

### 4. Cria as tabelas na base de dados

```bash
npm run db:push
```

### 5. Inicia o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5000`.

---

## 🔑 Configurar Google OAuth

1. Acede ao [Google Cloud Console](https://console.cloud.google.com)
2. Cria um novo projeto
3. Vai a **APIs e Serviços → Credenciais**
4. Configura a **Tela de consentimento OAuth** (tipo: Externo)
5. Cria um **ID do cliente OAuth** (tipo: Aplicativo da Web)
6. Adiciona os URIs de redirecionamento:
   - `http://localhost:5000/api/auth/google/callback` (desenvolvimento)
   - `https://teu-dominio.railway.app/api/auth/google/callback` (produção)
7. Copia o **Client ID** e **Client Secret** para o `.env`

---

## 🚢 Deploy

### Railway (recomendado)

1. Faz login em [railway.app](https://railway.app) com GitHub
2. **New Project → Deploy from GitHub repo**
3. Adiciona as variáveis de ambiente em **Variables**:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
4. Em **Settings → Networking**, gera um domínio público
5. O Railway deteta automaticamente os scripts `build` e `start`

### Scripts disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Compila o frontend (Vite) e o backend (esbuild)
npm run start    # Inicia o servidor em produção
npm run db:push  # Aplica o schema na base de dados
npm run check    # Verificação de tipos TypeScript
```

---

## 🗺️ API Endpoints

### Autenticação

| Método | Endpoint                    | Descrição                  |
| ------ | --------------------------- | -------------------------- |
| GET    | `/api/auth/user`            | Utilizador autenticado     |
| GET    | `/api/auth/google`          | Inicia OAuth Google        |
| GET    | `/api/auth/google/callback` | Callback OAuth Google      |
| POST   | `/api/auth/login`           | Login com email/password   |
| POST   | `/api/auth/register`        | Registo com email/password |
| PATCH  | `/api/auth/profile`         | Atualiza perfil            |
| GET    | `/api/logout`               | Termina sessão             |

### Cafés

| Método | Endpoint                         | Descrição            |
| ------ | -------------------------------- | -------------------- |
| GET    | `/api/coffee-shops`              | Lista todos os cafés |
| GET    | `/api/coffee-shops/:id`          | Detalhe de um café   |
| POST   | `/api/coffee-shops`              | Cria um café         |
| POST   | `/api/coffee-shops/:id/favorite` | Toggle favorito      |

### Posts

| Método | Endpoint              | Descrição          |
| ------ | --------------------- | ------------------ |
| GET    | `/api/posts`          | Lista posts        |
| GET    | `/api/posts/:id`      | Detalhe de um post |
| POST   | `/api/posts`          | Cria um post       |
| DELETE | `/api/posts/:id`      | Apaga um post      |
| POST   | `/api/posts/:id/like` | Toggle like        |

### Comentários

| Método | Endpoint                          | Descrição         |
| ------ | --------------------------------- | ----------------- |
| GET    | `/api/posts/:postId/comments`     | Lista comentários |
| POST   | `/api/posts/:postId/comments`     | Cria comentário   |
| DELETE | `/api/posts/:postId/comments/:id` | Apaga comentário  |

### Notificações

| Método | Endpoint                  | Descrição          |
| ------ | ------------------------- | ------------------ |
| GET    | `/api/notifications`      | Lista notificações |
| POST   | `/api/notifications/read` | Marca como lidas   |

---

## 🌍 Idiomas Suportados

- 🇧🇷 Português (Brasil)
- 🇵🇹 Português (Portugal)
- 🇬🇧 English
- 🇫🇷 Français
- 🇪🇸 Español

---

## 📸 Screenshots

| Landing Page                                                                                  | Feed                                                                                       | Cafés                                                                                    |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| ![Landing](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=250&fit=crop) | ![Feed](https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop) | ![Cafés](https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=250&fit=crop) |

---

## 📄 Licença

MIT © [SantanderNycz](https://github.com/SantanderNycz)
