# Deployment Guide

## Live URLs

| Service               | URL                                      |
| --------------------- | ---------------------------------------- |
| **Frontend (Vercel)** | https://car-rental-roan-kappa.vercel.app |
| **Storybook**         | Build locally: `npm run storybook`       |
| **Backend**           | Deploy via Railway (see below)           |

## Frontend — Vercel

### Option A: Vercel CLI (แนะนำ)

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (ครั้งแรก)
vercel

# Deploy production
vercel --prod
```

### Option B: GitHub Integration (Auto-deploy)

1. Push code ขึ้น GitHub
2. ไปที่ [vercel.com](https://vercel.com) → **Add New Project**
3. Import repository
4. ตั้งค่า:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. เพิ่ม Environment Variables:
   ```
   VITE_API_URL=https://your-api.fly.dev
   ```
6. กด **Deploy**

### Environment Variables (Vercel)

| Key            | Value               |
| -------------- | ------------------- |
| `VITE_API_URL` | URL ของ backend API |

---

## Backend (Elysia/Bun) — Railway

Railway ไม่บังคับบัตรเครดิต มี free tier $5/เดือน เหมาะสำหรับ project นี้

### Deploy ครั้งแรก (UI)

1. ไปที่ **[railway.app](https://railway.app)** → Login ด้วย GitHub
2. กด **New Project** → **Deploy from GitHub repo**
3. เลือก repo `car-rental` → เลือก folder **`backend`**
4. Railway จะ detect Dockerfile อัตโนมัติ
5. กด **Add Service** → **Database** → **PostgreSQL**
6. ไปที่ backend service → **Variables** → เพิ่ม:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-key-here
   FRONTEND_URL=https://car-rental-roan-kappa.vercel.app
   NODE_ENV=production
   PORT=3000
   ```
7. กด **Deploy**

### Run migrations หลัง deploy ครั้งแรก

```bash
# ติดตั้ง Railway CLI
npm install -g @railway/cli

# Login
railway login

# เชื่อม project
railway link

# รัน migration
railway run --service car-rental-api bunx prisma migrate deploy

# Seed database (optional)
railway run --service car-rental-api bun run prisma/seed.ts
```

### Deploy ครั้งต่อไป (อัตโนมัติ)

Railway จะ auto-deploy ทุกครั้งที่ push ไป `main` โดยอัตโนมัติ (ถ้าเชื่อม GitHub แล้ว)

หรือ deploy ด้วย CLI:

```bash
cd backend
railway up --service car-rental-api
```

### ดู logs

```bash
railway logs --service car-rental-api
```

### ได้ URL ของ backend

ไปที่ Railway dashboard → backend service → **Settings** → **Networking** → **Generate Domain**
จะได้ URL เช่น `https://car-rental-api-production.up.railway.app`

---

## CI/CD — GitHub Actions

### Secrets ที่ต้องตั้งใน GitHub Repository

ไปที่ **Settings → Secrets and variables → Actions** แล้วเพิ่ม:

| Secret          | วิธีได้มา                                                                          |
| --------------- | ---------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`  | [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create Token**  |
| `RAILWAY_TOKEN` | [railway.app](https://railway.app) → Account → **API Tokens** → **Create Token**   |
| `VITE_API_URL`  | URL ของ backend บน Railway เช่น `https://car-rental-api-production.up.railway.app` |

### Workflows

| Workflow     | Trigger            | หน้าที่                                        |
| ------------ | ------------------ | ---------------------------------------------- |
| `ci.yml`     | Push/PR ทุก branch | Lint, Build, Playwright tests, Storybook build |
| `deploy.yml` | Push ไป `main`     | Deploy frontend → Vercel, backend → Railway    |

### Flow

```
Push to main
    │
    ├── ci.yml
    │   ├── Lint & TypeScript check
    │   ├── Build frontend
    │   ├── Playwright E2E tests (with PostgreSQL service)
    │   └── Build Storybook
    │
    └── deploy.yml (หลัง CI ผ่าน)
        ├── Deploy frontend → Vercel (production)
        └── Deploy backend → Fly.io
```

---

## Storybook

### Run locally

```bash
npm run storybook
# เปิด http://localhost:6006
```

### Build static

```bash
npm run build-storybook
# output ที่ storybook-static/
```

### Deploy Storybook ไป Chromatic (optional)

```bash
npx chromatic --project-token=your-chromatic-token
```
