# Modern Car Rental System

Full-stack car rental management system with React + Vite frontend and ElysiaJS (Bun) backend.

## Tech Stack

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4 (purple theme), Zustand, TanStack Query, Recharts, Lucide React, React Router DOM

**Backend:** ElysiaJS on Bun, Prisma ORM 7, PostgreSQL, JWT auth

## Prerequisites

- **Node.js** >= 20
- **Bun** >= 1.0
- **PostgreSQL** running on `localhost:5432`

## Quick Start

### 1. Database Setup

```bash
# Create the database
createdb cardb
```

### 2. Backend

```bash
cd backend
bun install
cp .env.example .env   # Edit DATABASE_URL and JWT_SECRET if needed
bunx prisma migrate dev
bun run prisma/seed.ts  # Seed demo data
bun run dev             # Starts on http://localhost:3000
```

### 3. Frontend

```bash
# From project root
npm install
npm run dev             # Starts on http://localhost:5173
```

The frontend proxies `/api` requests to the backend automatically.

## Demo Credentials

| Role     | Email               | Password    |
| -------- | ------------------- | ----------- |
| Admin    | admin@carrental.com | admin123    |
| Staff    | staff@carrental.com | staff123    |
| Customer | wichai@email.com    | customer123 |
| Customer | suda@email.com      | customer123 |

## Features

- **Vehicle Catalog** — Browse, search, filter by category (Sedan/SUV/Van)
- **Booking Wizard** — 3-step flow: select vehicle, pick dates with availability calendar, checkout
- **Admin Dashboard** — KPI cards, fleet utilization donut chart, revenue bar chart, upcoming actions
- **Reservation Management** — Confirm, cancel, complete reservations
- **Vehicle CRUD** — Add, edit, delete vehicles
- **Auth** — JWT-based login/register with httpOnly cookies + Bearer token
- **Payments** — Down payment (30%), final payment, late fee & damage fee calculation
- **Responsive** — Mobile bottom nav, tablet/desktop top nav

## API Documentation

Swagger UI available at: http://localhost:3000/swagger

## Project Structure

```
car-rental/
├── backend/
│   ├── prisma/           # Schema, migrations, seed
│   ├── src/
│   │   ├── lib/          # Prisma client, date/pricing utils
│   │   ├── modules/      # auth, vehicles, reservations, payments, admin
│   │   └── index.ts      # Elysia entry point
│   └── package.json
├── src/
│   ├── components/       # UI primitives (button, card, badge, input, select)
│   ├── features/         # Feature pages (catalog, booking, dashboard, auth, admin)
│   ├── stores/           # Zustand stores (auth, booking)
│   ├── lib/              # API client, utils
│   ├── types/            # TypeScript interfaces
│   ├── App.tsx           # Router setup
│   └── index.css         # Tailwind v4 + purple design system
├── vite.config.ts
└── package.json
```
