# Melosys Skjema Web

Web-applikasjon for digitale skjema for utsendt arbeidstaker (A1-søknad).

## Tech Stack

### Frontend (app/)
- React 19.x
- TypeScript 5.8.x
- TanStack Router 1.130.x
- Vite 7.x

### Backend (server/)
- Express 5.x
- TypeScript 5.x
- Node.js ESModules
- Winston 3.x (logging)
- Morgan 1.x (HTTP logging)
- NAV Oasis 3.x & Vite-mode 0.x
- NAV Dekoratøren 3.x
- Express Rate Limit 8.x

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
app/                      # Frontend-applikasjon
├── src/
│   ├── routes/           # TanStack Router ruter
│   │   ├── __root.tsx    # Root layout
│   │   ├── index.tsx     # Hjem-side
│   │   └── about.tsx     # Om-side
│   ├── main.tsx          # App entry point
│   └── routeTree.gen.ts  # Autogenererte typer
├── index.html            # HTML template
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── eslint.config.mjs

server/                   # Express server
├── src/
│   ├── actuators.ts      # Health/metrics endpoints
│   ├── config.ts         # Environment config
│   ├── errorHandler.ts   # Global error handling
│   ├── frontendRoute.ts  # Frontend routing logic
│   ├── index.ts          # Server startup
│   ├── logger.ts         # Winston logging setup
│   └── server.ts         # Express app setup
├── dist/                 # Compiled TypeScript output
├── Dockerfile            # Docker container config
├── docker-compose.yaml   # Docker compose setup
├── package.json
├── package-lock.json
├── tsconfig.json
└── eslint.config.mjs
```

## Kodestandarder

- ESLint med strenge regler (Unicorn, React, import-sorting)
- Prettier for formatering
- TypeScript strict mode
- Ingen console.log i produksjonskode