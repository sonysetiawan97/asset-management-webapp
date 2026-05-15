# 🚀 Vite React Sagara

A scalable, modular frontend boilerplate using **React**, **TypeScript**, and **Vite** with Docker support, structured to support production-ready applications.

---

## 📦 Deployment

### 🔹 Docker (Recommended for Production)

**Build the image:**

```bash
docker build -t vite-react-app .
```

**Run the container:**

```bash
docker run -p 5173:5173 vite-react-app
```

Or using **Docker Compose**:

```bash
docker-compose up --build
```

App will be available at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Local Development

### 🔸 Prerequisites

- Node.js v20+
- pnpm (recommended) / npm / yarn

### 🔸 Install Dependencies

```bash
pnpm install
# or
npm install
```

### 🔸 Start Dev Server

```bash
pnpm dev
# or
npm run dev
```

> App runs at: `http://localhost:5173`

---

## ⚙️ Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Update with your API URLs, tokens, etc.

---

## 🏗️ Folder Structure (Full Breakdown)

```
vite-react-sagara-main/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── layout/
│   ├── mocks/
│   ├── modules/
│   ├── routes/
│   ├── services/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── build.sh
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

### 🔍 Description of `src/` Folders

| Folder/File     | Description |
|-----------------|-------------|
| `assets/`       | Static files: images, fonts, icons, logos. |
| `components/`   | Shared and reusable UI components like buttons, cards, forms. |
| `contexts/`     | React Contexts (e.g., AuthContext, ThemeContext). |
| `hooks/`        | Custom hooks like `useFetch`, `useDebounce`, etc. |
| `layout/`       | Wrapper components like `MainLayout`, `AuthLayout`, including headers/sidebars. |
| `mocks/`        | JSON or mock service handlers for dev/testing. |
| `modules/`      | Feature-based modules following domain separation (e.g., user, dashboard). |
| `routes/`       | Route configuration for the app using `react-router-dom`. |
| `services/`     | External API handlers or fetch wrappers. |
| `stores/`       | Centralized state (Zustand, Redux, etc.). |
| `types/`        | Global and shared TypeScript type declarations and interfaces. |
| `utils/`        | Helper and utility functions (e.g., formatter, validators). |
| `App.tsx`       | Main component holding routing and providers. |
| `main.tsx`      | Entry file to render the app using `ReactDOM`. |
| `index.css`     | Global CSS. |
| `vite-env.d.ts` | Vite’s environment typing file. |

---

## ⚙️ Project Scripts

| Script            | Purpose                       |
|------------------|-------------------------------|
| `dev`            | Start development server      |
| `build`          | Build for production          |
| `preview`        | Preview production build      |
| `lint`           | Run ESLint                    |

Run with:

```bash
pnpm <script>
# or
npm run <script>
```

---

## 📚 Tech Stack

- ⚛️ **React** – UI Library
- ⚡ **Vite** – Fast build tool
- 🔠 **TypeScript** – Type-safe development
- 🧩 **pnpm** – Efficient package manager
- 🐳 **Docker** – Containerized deployment
- 📏 **ESLint** – Code quality

---

## 👨‍💻 Maintainers

Developed and maintained by **Sagara Team**.