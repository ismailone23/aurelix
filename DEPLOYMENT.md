# Aurelex Deployment Guide

## Overview
This monorepo contains two deployable applications:
- **web** - Customer-facing Next.js e-commerce site (port 3000)
- **admin** - Admin dashboard Next.js app with API routes (port 3002)

The admin app hosts all API routes including tRPC, image upload, and email endpoints.

## Prerequisites
1. Supabase account with a project created
2. Vercel account (or any Next.js hosting)
3. Gmail account with App Password for SMTP

---

## Environment Variables

### Web App (apps/web)
```env
# Admin API URL (for tRPC and other API calls)
NEXT_PUBLIC_ADMIN_URL=https://your-admin-url.com

# Supabase Storage (for client-side image display)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Admin App (apps/admin)
```env
# Database (Transaction Pooler)
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Auth
JWT_SECRET=your-secure-jwt-secret

# Supabase Storage
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Public Supabase (for client-side)
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
```

---

## Deployment Steps

### 1. Supabase Setup
1. Create a new Supabase project
2. Get your project URL and anon key from Settings > API
3. Create a storage bucket named "aurelix" (public)
4. Get database connection string from Settings > Database
   - Use the "Transaction pooler" connection string (port 6543)

### 2. Deploy Admin (Vercel) - Deploy First!
1. Import your GitHub repo
2. Set Framework Preset to "Next.js"
3. Set Root Directory to `apps/admin`
4. Add all environment variables listed above
5. Deploy
6. Note your admin URL (e.g., https://aurelex-admin.vercel.app)

### 3. Deploy Web (Vercel)
1. Create another project from the same repo
2. Set Root Directory to `apps/web`
3. Add environment variables:
   - `NEXT_PUBLIC_ADMIN_URL` = your admin URL from step 2
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
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

This creates:
- Email: admin@aurelex.com
- Password: admin123

**Change this password immediately after first login!**

---

## API Routes (hosted on Admin app)

The admin app provides these API endpoints:

- `POST /api/trpc/*` - tRPC endpoints for all data operations
- `POST /api/upload` - Image upload to Supabase Storage
- `DELETE /api/upload?path=` - Delete image from storage
- `POST /api/email/order-confirmation` - Send order confirmation emails
- `POST /api/email/status-update` - Send order status update emails
- `POST /api/contact` - Handle contact form submissions

---

## Local Development

```bash
# Install dependencies
pnpm install

# Run database migrations
cd packages/db && pnpm migrate

# Start both apps
pnpm dev
```

Web runs on: http://localhost:3000
Admin runs on: http://localhost:3002

---

## Troubleshooting

### CORS Issues
If you encounter CORS issues, ensure your admin app allows requests from your web domain. Next.js API routes handle CORS automatically for same-origin requests.

### Image Upload Issues
- Ensure your Supabase storage bucket "aurelix" is public
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are set correctly

### Email Not Sending
- Verify SMTP credentials are correct
- For Gmail, use an App Password (not your regular password)
- Enable "Less secure app access" or use App Passwords
