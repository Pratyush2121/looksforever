# Looks Forever: Production Deployment & Operations Guide

This guide details how to deploy the entire dynamic website and admin suite to **Vercel** connected to **MongoDB Atlas** as a **single, unified project**.

---

## Architecture Summary
* **Frontend**: React + Vite (SPA)
* **Backend**: Vercel Serverless Functions in `/api/` (9 consolidated endpoints, well within the Vercel Hobby 12-function cap)
* **Database**: MongoDB Atlas with connection pooling cached across serverless invocations
* **Hosting**: ONE Vercel project deployed from ONE GitHub repository (`git push` = instant deployment)
* **Branding**: Official Looks Forever logo processed across all devices, favicons, OG social cards, and admin dashboard.

---

## Step 1: MongoDB Atlas Setup (Free Tier)

1. Sign up / Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Create a free shared cluster (e.g. `Cluster0` in `AWS / Mumbai ap-south-1` for minimum latency).
3. **Database Access**: Create a database user (e.g. `looks_admin`) with **Read and write to any database** permissions.
4. **Network Access**: Add IP Address `0.0.0.0/0` (Allow access from anywhere). This is required for Vercel serverless function instances.
5. **Connection String**: Click **Connect** > **Drivers** (Node.js) and copy the URI:
   ```env
   mongodb+srv://looks_admin:<password>@cluster0.xxxxx.mongodb.net/looksforever?retryWrites=true&w=majority
   ```

---

## Step 2: Local Seeding & Admin Account Creation

Before deploying, populate your MongoDB database with the 27 existing products, categories, homepage settings, and your admin user.

1. In your local `.env` file, paste your MongoDB URI:
   ```env
   MONGODB_URI=mongodb+srv://looks_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/looksforever?retryWrites=true&w=majority
   JWT_SECRET=looks_forever_jwt_super_secret_production_key_32_chars_minimum
   ```

2. Run the seed script:
   ```bash
   node scripts/seed.js
   ```
   *You will see:*
   * `✅ Seeded 5 categories.`
   * `✅ Seeded 27 products.`
   * `✅ Seeded 6 settings sections (header, footer, homepage, whatsapp, seo, about, contact).`
   * `✅ Seeded offers & sample blogs.`

3. Create your administrator account:
   ```bash
   node scripts/create-admin.js admin care@looksforever.org YourSecurePassword123!
   ```
   *Password is hashed with bcryptjs and saved securely in MongoDB.*

---

## Step 3: Deploying to Vercel (Single Project)

1. Initialize Git and commit all project files:
   ```bash
   git init
   git add .
   git commit -m "feat: Looks Forever dynamic storefront and admin panel suite"
   ```

2. Push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/<your-username>/looks-forever.git
   git branch -M main
   git push -u origin main
   ```

3. Import into Vercel:
   * Go to [vercel.com/new](https://vercel.com/new).
   * Select your `looks-forever` repository.
   * Framework Preset: **Vite** (Root Directory: `./`).
   * Expand **Environment Variables** and add:
     | Variable Name | Value |
     |---|---|
     | `MONGODB_URI` | `mongodb+srv://looks_admin:...@cluster0.../looksforever?retryWrites=true&w=majority` |
     | `JWT_SECRET` | Secure 32+ character key (e.g. `openssl rand -hex 32`) |
     | `VITE_SITE_URL` | `https://looksforever.org` (or your Vercel deployment URL) |
     | `NODE_ENV` | `production` |
   * Click **Deploy**.

---

## Step 4: Verification Checklist

1. **Public Storefront**:
   * Visit `https://your-domain.vercel.app/`.
   * Check that all products load dynamically from MongoDB.
   * Check mobile view (under 768px): products appear in an equal-height **2-column grid** with 4/5 aspect ratio images and full-width green WhatsApp buttons.
   * Verify "Why Choose Looks Forever" section is present right after the Hero.
   * Test "Buy Now on WhatsApp" on any product — verify WhatsApp opens with pre-filled product name, SKU, price, and current link.
2. **Hidden Admin Panel**:
   * Navigate directly to `https://your-domain.vercel.app/admin`.
   * Verify the public site has zero buttons, links, or sitemap references pointing to this URL.
   * Log in with your admin credentials.
   * Test updating a product price or adding a new promotion in **Offers**.
   * Test submitting a consultation inquiry on the public site and verifying it appears in the **Contact & Leads CRM** inbox.
   * Click **Export CSV** in Leads CRM to download patient records.

