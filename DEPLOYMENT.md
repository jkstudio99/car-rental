# Deployment Guide

## Live URLs

| Service               | URL                                       |
| --------------------- | ----------------------------------------- |
| **Frontend (Vercel)** | https://car-rental-roan-kappa.vercel.app  |
| **Storybook**         | Build locally: `npm run storybook`        |
| **Backend (Railway)** | https://car-rental-backend.up.railway.app |

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
   VITE_API_URL=https://car-rental-backend.up.railway.app
   ```
6. กด **Deploy**

### Environment Variables (Vercel)

| Key            | Value               |
| -------------- | ------------------- |
| `VITE_API_URL` | URL ของ backend API |

---

## Backend (Elysia/Bun) — Railway

Railway ให้ $5 credit/เดือนฟรี ไม่ sleep ไม่ต้องใส่บัตรเครดิต (Hobby plan)

### Deploy ครั้งแรก (UI)

1. ไปที่ **[railway.app](https://railway.app)** → Login ด้วย GitHub
2. กด **New Project** → **Deploy from GitHub repo**
3. เลือก repo `car-rental`
4. Railway จะ detect `Dockerfile` ใน `backend/` → กด **Deploy Now**
5. ไปที่ service → **Settings** → **Source** → ตั้ง **Root Directory** เป็น `backend`

### เพิ่ม PostgreSQL Database

1. ใน project เดียวกัน กด **New** → **Database** → **Add PostgreSQL**
2. Railway สร้าง DB ให้อัตโนมัติพร้อม `DATABASE_URL`

### ตั้งค่า Environment Variables

1. ไปที่ backend service → **Variables**
2. เพิ่ม variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-key-here
   FRONTEND_URL=https://car-rental-roan-kappa.vercel.app
   NODE_ENV=production
   PORT=3000
   ```
3. Railway จะ restart service อัตโนมัติ

### Run migrations หลัง deploy ครั้งแรก

`start.sh` จะรัน `bunx prisma migrate deploy` อัตโนมัติตอน container start

หรือรันผ่าน Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway run --service backend bunx prisma migrate deploy
```

### Deploy ครั้งต่อไป (อัตโนมัติ)

Railway จะ auto-deploy ทุกครั้งที่ push ไป `main` โดยอัตโนมัติ

### ดู logs

ไปที่ backend service → **Deployments** → เลือก deploy → **View Logs**

### ได้ URL ของ backend

ไปที่ backend service → **Settings** → **Networking** → **Generate Domain**
จะได้ URL เช่น `https://car-rental-backend.up.railway.app`

---

## CI/CD — GitHub Actions

### Secrets ที่ต้องตั้งใน GitHub Repository

ไปที่ **Settings → Secrets and variables → Actions** แล้วเพิ่ม:

| Secret          | วิธีได้มา                                                                          |
| --------------- | ---------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`  | [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create Token**  |
| `RAILWAY_TOKEN` | [railway.app](https://railway.app) → Account Settings → **Tokens** → Create token |
| `VITE_API_URL`  | URL ของ backend บน Railway เช่น `https://car-rental-backend.up.railway.app`        |

### Workflows

| Workflow     | Trigger            | หน้าที่                                         |
| ------------ | ------------------ | ----------------------------------------------- |
| `ci.yml`     | Push/PR ทุก branch | Lint, Build, Playwright tests, Storybook build  |
| `deploy.yml` | Push ไป `main`     | Deploy frontend → Vercel, backend → Railway     |

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
        └── Deploy backend → Railway
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
