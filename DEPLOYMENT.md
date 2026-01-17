# Aurelex Deployment Guide

## Overview
This monorepo contains three deployable applications:
- **web** - Customer-facing Next.js e-commerce site
- **admin** - Admin dashboard Next.js app
- **server** - Hono API server with tRPC

## Prerequisites
1. Supabase account with a project created
2. Vercel account (for web and admin)
3. Railway/Render account (for server - or any Node.js hosting)

---

## Environment Variables

### Web App (apps/web)
```env
NEXT_PUBLIC_API_URL=https://your-server-url.com
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Admin App (apps/admin)
```env
NEXT_PUBLIC_API_URL=https://your-server-url.com
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Server (apps/server)
```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
JWT_SECRET=your-secure-jwt-secret
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
NODE_ENV=production
PORT=3001
```

---

## Deployment Steps

### 1. Supabase Setup
1. Create a new Supabase project
2. Get your project URL and anon key from Settings > API
3. Create a storage bucket named "aurelix" (public)
4. Get database connection string from Settings > Database
   - Use the "Transaction pooler" connection string (port 6543)

### 2. Deploy Server (Railway/Render)

#### Railway:
1. Connect your GitHub repo
2. Set root directory to `apps/server`
3. Add all environment variables
4. Deploy - Railway will auto-detect Node.js

#### Render:
1. Create a new Web Service
2. Connect repo and set root to `apps/server`
3. Build command: `pnpm install && pnpm build`
4. Start command: `node dist/index.js`
5. Add environment variables

### 3. Deploy Web (Vercel)
1. Import your GitHub repo
2. Set Framework Preset to "Next.js"
3. Set Root Directory to `apps/web`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your server URL
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

### 4. Deploy Admin (Vercel)
1. Create another project from the same repo
2. Set Root Directory to `apps/admin`
3. Add same environment variables as web
4. Deploy

---

## Database Migration
After setting up Supabase, run migrations:
```bash
cd packages/db
pnpm migrate
```

## Seed Admin User
To create an admin user, run:
```bash
cd packages/db
pnpm seed
```
Default admin: admin@aurelex.com / admin123

---

## Important Notes

1. **CORS**: The server allows all origins. For production, restrict to your domains.

2. **JWT Secret**: Use a strong, unique secret for JWT_SECRET

3. **Gmail SMTP**:
   - Enable 2FA on your Google account
   - Create an App Password in Google Account settings
   - Use the app password as SMTP_PASS

4. **Supabase Storage**:
   - Make the "aurelix" bucket public
   - Set allowed MIME types to images only if needed

5. **Monorepo Build**:
   - Each app builds independently
   - Turbo handles caching and dependencies

---

## Local Development
```bash
# Install dependencies
pnpm install

# Start all apps
pnpm dev

# Or start individually
cd apps/web && pnpm dev      # Port 3000
cd apps/admin && pnpm dev    # Port 3002
cd apps/server && pnpm dev   # Port 3001
```
