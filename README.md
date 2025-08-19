# Melosys Skjema

Fullstack-applikasjon for digitale skjema for utsendt arbeidstaker (A1-søknad).

## Tech Stack

### Frontend (app/)
- React 19.x
- TypeScript 5.8.x  
- TanStack Router 1.130.x
- Vite 7.x

### Backend (server/)
- Express 5.x
- TypeScript 5.9.x
- Node.js ESModules
- NAV Oasis & Vite-mode

## Utvikling

### Oppstart

**Frontend:**
```bash
cd app
npm install
npm run dev
```
Åpne http://localhost:5173

**Server:**
```bash
docker-compose up -d --build
```
Server på http://localhost:8081

### Kommandoer

**Frontend (app/):**
```bash
npm run dev          # Start dev server
npm run build        # Bygg for produksjon
npm run preview      # Forhåndsvis produksjonsbygg
npm run lint         # Kjør ESLint
npm run lint:fix     # Fiks ESLint-feil
```

**Server (server/):**
```bash
npm run build        # Bygg TypeScript
docker-compose up -d --build  # Bygg og start server
npm run start        # Start bygget server
npm run lint         # Kjør ESLint
npm run lint:fix     # Fiks ESLint-feil
```

## Prosjektstruktur

```
app/                 # Frontend-applikasjon
├── src/
│   ├── routes/      # TanStack Router ruter
│   │   ├── __root.tsx   # Root layout
│   │   ├── index.tsx    # Hjem-side
│   │   └── about.tsx    # Om-side
│   ├── main.tsx     # App entry point
│   └── routeTree.gen.ts # Autogenererte typer
├── package.json
├── vite.config.ts
└── tsconfig.json
server/              # Express server
├── src/
│   ├── config.ts    # Environment config
│   ├── server.ts    # Express app setup
│   └── index.ts     # Server startup
├── .env             # Environment variables
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── .prettierrc.json
docker-compose.yml   # Docker setup
```

## Kodestandarder

- ESLint med strenge regler (Unicorn, React, import-sorting)
- Prettier for formatering
- TypeScript strict mode
- Ingen console.log i produksjonskode