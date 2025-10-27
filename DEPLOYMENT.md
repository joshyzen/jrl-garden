# Pre-Deployment Checklist for Vercel + Supabase

## ✅ Build Status
- [x] Production build passes
- [x] No TypeScript errors
- [x] Linter warnings only (safe to deploy)

## 🔧 Environment Variables Needed

### Vercel Dashboard (Settings → Environment Variables)

**Required:**
```bash
# Database (Supabase)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Cloudinary (for plant image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend (for email notifications)
RESEND_API_KEY=re_your_key_here

# Google Maps (for address autocomplete)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

**Optional:**
```bash
# Custom brand logo URL (defaults to /logo.png)
NEXT_PUBLIC_BRAND_LOGO_URL=https://...
```

## 📋 Supabase Setup Steps

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Note the connection strings

2. **Get Connection Strings**
   - Go to Project Settings → Database
   - Copy "Connection string" (pooling) → `DATABASE_URL`
   - Copy "Connection string" (direct) → `DIRECT_URL`
   - Replace `[YOUR-PASSWORD]` with your actual password

3. **Run Database Migrations**
   ```bash
   npm run prisma:push
   npm run prisma:seed  # Optional: seed with initial data
   ```

## 🚀 Vercel Deployment Steps

1. **Connect GitHub Repository**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select the `jrl-garden-web` folder as root directory

2. **Configure Build Settings**
   - Root Directory: `jrl-garden-web`
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from the list above
   - Make sure to add them for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## ⚙️ Post-Deployment Tasks

### 1. Database Setup
After first deployment, run migrations:
```bash
# Option A: Use Vercel CLI
vercel env pull .env.local
npm run prisma:push

# Option B: Run from Vercel dashboard (Functions → Console)
npx prisma db push
```

### 2. Test Email Notifications
- Submit a test estimate
- Check zenmaker@gmail.com for email
- Verify all estimate details appear correctly

### 3. Test Address Autocomplete
- Go to /estimate page
- Start typing an address
- Verify Google Places suggestions appear

### 4. Admin Access
- Set up admin login credentials
- Test /admin/login page
- Verify you can manage plants, services, and view estimates

### 5. Custom Domain (Optional)
- Go to Vercel project → Settings → Domains
- Add your custom domain (jrl.garden)
- Update DNS records as instructed
- Wait for SSL certificate provisioning

## 🔐 API Keys Setup Guide

### Resend (Email)
1. Go to https://resend.com
2. Sign up / Login
3. Go to API Keys
4. Create new API key
5. Copy to `RESEND_API_KEY`
6. **Optional:** Verify custom domain for branded emails

### Google Maps (Address Autocomplete)
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable "Places API"
4. Go to Credentials → Create API Key
5. Copy to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
6. **Recommended:** Restrict key to your domain in production

### Cloudinary (Image Upload)
1. Go to https://cloudinary.com
2. Sign up / Login
3. Go to Dashboard
4. Copy Cloud Name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
5. Go to Settings → Access Keys
6. Copy API Key and API Secret

## ⚠️ Common Issues & Solutions

### Build Fails with "DATABASE_URL not found"
- Environment variables not set in Vercel
- Solution: Add all env vars in Vercel dashboard, redeploy

### Images Not Loading
- Cloudinary env vars missing or incorrect
- Solution: Double-check cloud name and API credentials

### Address Autocomplete Not Working
- Google Maps API key not set
- Places API not enabled
- Solution: Enable Places API in Google Cloud Console

### Email Notifications Not Sending
- Resend API key invalid or missing
- Solution: Generate new API key from Resend dashboard
- Check Vercel logs for error messages

### Prisma Connection Errors
- Wrong DATABASE_URL format
- Need to run migrations
- Solution: Ensure connection strings are correct, run `prisma db push`

## 📊 Monitoring

After deployment, monitor:
- Vercel deployment logs
- Supabase database usage
- Resend email delivery
- Google Maps API usage
- Cloudinary storage/bandwidth

## 🎉 You're Ready!

Once all environment variables are set and the deployment succeeds, your site will be live at:
- Vercel URL: `https://your-project.vercel.app`
- Custom domain: `https://jrl.garden` (if configured)

Test all features thoroughly before announcing the launch!

