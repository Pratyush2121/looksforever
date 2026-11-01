# looksforever

> Premium Non-Surgical Hair Replacement & Studio E-Commerce Platform

A production-ready full-stack hair replacement and studio platform built for **Looks Forever Hair Studio** (Wave Mall, Sector 18 Noida). Built with React + Vite, Tailwind CSS, Vercel Serverless Functions, MongoDB Atlas, and a secure, hidden Admin Panel.

## Features

- **Storefront & Studio Presentation**:
  - Live Studio Availability & Consultation Booking desk
  - Transparent pricing and interactive "Price Your Own System" cost calculator
  - Six real hair fixing methods (Hair Patches, Bonding, Clipping, Weaving, Toppers, Servicing)
  - Results comparison: Non-surgical hair system vs. hair transplant surgery
  - 2-Column Mobile Product Grid with fixed 4/5 aspect ratio cards and direct WhatsApp ordering
  - Wave Mall Sector 18 Noida studio location with interactive Google Maps

- **Multi-Page Architecture**:
  - `/` - Studio Overview & Home Page
  - `/products` - Complete 27 Hair Systems & Accessories Catalog
  - `/category/:slug` - Dynamic category collections (Swiss Lace, Micro Skin, Wigs, Tapes)
  - `/services` - Detailed breakdown of all six fixing methods
  - `/gallery` - Before & after transformations categorized by Norwood baldness stages
  - `/about` - Studio history, legacy timeline, and four quality standards
  - `/blogs` - Hair maintenance and summer care knowledge guides
  - `/contact` - Wave Mall Noida studio appointments and contact desk

- **Hidden Admin Suite (`/admin`)**:
  - Completely hidden from public site (no public links, excluded from robots.txt & sitemap)
  - Code-split with `React.lazy` so regular visitors never download admin assets
  - Protected with bcrypt password hashing and HTTP-only JWT cookies
  - 12 Complete Management Views: Dashboard, Products, Categories, Homepage, Offers, Blogs, About, Contact Leads CRM, Header/Footer, SEO, Settings, and Analytics

- **Backend & APIs (`/api/`)**:
  - Native Vercel Serverless functions
  - Cached MongoDB Atlas connection pooling
  - Input validation with Zod schemas

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection URI:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## Deployment

Deploy directly to Vercel in one click:
```bash
vercel
```
Ensure you set `MONGODB_URI` and `JWT_SECRET` in your Vercel Project Environment Variables.

