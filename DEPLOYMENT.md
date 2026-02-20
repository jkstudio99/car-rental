# Deployment Guide

## Live URLs

| Service               | URL                                      |
| --------------------- | ---------------------------------------- |
| **Frontend (Vercel)** | https://car-rental-roan-kappa.vercel.app |
| **Storybook**         | Build locally: `npm run storybook`       |
| **Backend (Render)**  | https://car-rental-wwba.onrender.com     |

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

## Backend (Elysia/Bun) — Render

Render ไม่บังคับบัตรเครดิต มี free tier 750 hours/เดือน เหมาะสำหรับ project นี้

### Deploy ครั้งแรก (UI)

1. ไปที่ **[render.com](https://render.com)** → Login ด้วย GitHub
2. กด **New Web Service** → **Connect GitHub**
3. เลือก repo `car-rental` → เลือก branch `main`
4. **Name**: `car-rental-api`
5. **Root Directory**: `backend`
6. **Runtime**: `Docker`
7. **Build Command**: `bun install && bunx prisma generate`
8. **Start Command**: `bun run src/index.ts`
9. กด **Create Web Service**

### เพิ่ม PostgreSQL Database

1. ใน project เดียวกัน กด **New PostgreSQL**
2. **Name**: `car-rental-db`
3. **Database Name**: `carrental`
4. **User**: `postgres`
5. กด **Create Database**

### ตั้งค่า Environment Variables

1. ไปที่ backend service → **Environment**
2. เพิ่ม variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-key-here
   FRONTEND_URL=https://car-rental-roan-kappa.vercel.app
   NODE_ENV=production
   PORT=3000
   ```
3. กด **Save Changes**

### Run migrations หลัง deploy ครั้งแรก

1. ไปที่ backend service → **Shell** (มุมขวาบน)
2. รันใน shell:
   ```bash
   bunx prisma migrate deploy
   bunx tsx prisma/seed.ts
   ```

### Deploy ครั้งต่อไป (อัตโนมัติ)

Render จะ auto-deploy ทุกครั้งที่ push ไป `main` โดยอัตโนมัติ

หรือ deploy ด้วย manual:

1. ไปที่ backend service → **Manual Deploy**
2. กด **Deploy Latest Commit**

### ดู logs

ไปที่ backend service → **Logs**

### ได้ URL ของ backend

ไปที่ backend service → ดูบนสุดของหน้า
จะได้ URL เช่น `https://car-rental-wwba.onrender.com`

---

## CI/CD — GitHub Actions

### Secrets ที่ต้องตั้งใน GitHub Repository

ไปที่ **Settings → Secrets and variables → Actions** แล้วเพิ่ม:

| Secret               | วิธีได้มา                                                                         |
| -------------------- | --------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`       | [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create Token** |
| `RENDER_DEPLOY_HOOK` | Render dashboard → backend service → **Settings** → **Deploy Hook** → Copy URL    |
| `VITE_API_URL`       | URL ของ backend บน Render: `https://car-rental-wwba.onrender.com`                 |

### Workflows

| Workflow     | Trigger            | หน้าที่                                        |
| ------------ | ------------------ | ---------------------------------------------- |
| `ci.yml`     | Push/PR ทุก branch | Lint, Build, Playwright tests, Storybook build |
| `deploy.yml` | Push ไป `main`     | Deploy frontend → Vercel, backend → Render     |

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
        └── Deploy backend → Render
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
