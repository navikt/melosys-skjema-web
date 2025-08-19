# Melosys Skjema - Frontend

React-applikasjon for digitale skjema for utsendt arbeidstaker (A1-søknad).

## Tech Stack

- React 19.x
- TypeScript 5.8.x  
- TanStack Router 1.130.x
- Vite 7.x

## Utvikling

### Oppstart

```bash
cd app
npm install
npm run dev
```

Åpne http://localhost:5173

### Kommandoer

```bash
npm run dev          # Start dev server
npm run build        # Bygg for produksjon
npm run preview      # Forhåndsvis produksjonsbygg
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
server/              # Server (kommer senere)
```

## Kodestandarder

- ESLint med strenge regler (Unicorn, React, import-sorting)
- Prettier for formatering
- TypeScript strict mode
- Ingen console.log i produksjonskode