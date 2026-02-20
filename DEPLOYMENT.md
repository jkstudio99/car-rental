# Deployment Guide

## Live URLs

| Service               | URL                                      |
| --------------------- | ---------------------------------------- |
| **Frontend (Vercel)** | https://car-rental-roan-kappa.vercel.app |
| **Storybook**         | Build locally: `npm run storybook`       |
| **Backend**           | Deploy via Fly.io (see below)            |

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

## Backend (Elysia/Bun) — Fly.io

### ติดตั้ง flyctl

```bash
# macOS
brew install flyctl

# หรือ
curl -L https://fly.io/install.sh | sh
```

### Deploy ครั้งแรก

```bash
cd backend

# Login
flyctl auth login

# สร้าง app (ครั้งแรกเท่านั้น)
flyctl launch --name car-rental-api --region sin --no-deploy

# สร้าง PostgreSQL database
flyctl postgres create --name car-rental-db --region sin

# Attach database กับ app
flyctl postgres attach car-rental-db --app car-rental-api

# ตั้งค่า secrets
flyctl secrets set JWT_SECRET=your-super-secret-key-here
flyctl secrets set NODE_ENV=production

# Deploy
flyctl deploy
```

### Deploy ครั้งต่อไป

```bash
cd backend
flyctl deploy
```

### Run migrations บน production

```bash
flyctl ssh console --app car-rental-api
# ใน console:
bunx prisma migrate deploy
```

### ดู logs

```bash
flyctl logs --app car-rental-api
```

---

## Backend — Railway (ทางเลือก)

Railway ง่ายกว่า Fly.io เหมาะสำหรับ prototype:

1. ไปที่ [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. เลือก folder `backend`
4. เพิ่ม **PostgreSQL** plugin
5. ตั้งค่า Environment Variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-secret
   PORT=3000
   ```
6. ตั้งค่า **Start Command**: `bun run src/index.ts`

---

## CI/CD — GitHub Actions

### Secrets ที่ต้องตั้งใน GitHub Repository

ไปที่ **Settings → Secrets and variables → Actions** แล้วเพิ่ม:

| Secret              | วิธีได้มา                                                      |
| ------------------- | -------------------------------------------------------------- |
| `VERCEL_TOKEN`      | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`     | รัน `vercel whoami` หรือดูใน `.vercel/project.json`            |
| `VERCEL_PROJECT_ID` | รัน `vercel link` แล้วดูใน `.vercel/project.json`              |
| `FLY_API_TOKEN`     | รัน `flyctl auth token`                                        |
| `VITE_API_URL`      | URL ของ backend เช่น `https://car-rental-api.fly.dev`          |

### Workflows

| Workflow     | Trigger            | หน้าที่                                        |
| ------------ | ------------------ | ---------------------------------------------- |
| `ci.yml`     | Push/PR ทุก branch | Lint, Build, Playwright tests, Storybook build |
| `deploy.yml` | Push ไป `main`     | Deploy frontend → Vercel, backend → Fly.io     |

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
