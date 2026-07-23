# SmartShop AI - Architecture & System Design Specification

## System Overview
**SmartShop AI** is a production-ready, hybrid e-commerce platform built for cross-platform Web and Mobile (Android APK) deployment.

```
                  ┌─────────────────────────────────────────┐
                  │          SmartShop AI Frontend          │
                  │   (React + Vite + Tailwind CSS + PWA)   │
                  └────────────────────┬────────────────────┘
                                       │
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
       ┌───────────────────────────┐       ┌───────────────────────────┐
       │     Capacitor Mobile      │       │     Express / Supabase    │
       │    (Android APK / AAB)    │       │     PostgreSQL Database   │
       └───────────────────────────┘       └───────────────────────────┘
```

---

## 🏗️ Architecture Layers

### 1. Presentation Layer (Frontend & Mobile)
- **Framework**: React 18 with Vite compiler & Rolldown bundler.
- **UI Engine**: Tailwind CSS + Glassmorphism aesthetic tokens + Framer Motion animations.
- **Mobile Container**: Capacitor 6 (`ai.smartshop.mobile.app`) supporting native Android WebViews, SHA-1 Google Sign-In, and offline persistent storage.

### 2. Application Logic & Data Layer
- **Data Adapters**: `api.js` wrapper with dual fallback (Live Supabase Cloud Database + IndexedDB / LocalStorage Persistent Store).
- **Authentication**: `authService.js` handling Google OAuth, Gmail OTP, JWT token storage, and session persistence.
- **AI Recommendation Engine**: `aiEngine.js` implementing:
  - Content-Based Filtering (Tag & Category similarity matching).
  - Collaborative Filtering (User behavior & purchase history).
  - Frequently Bought Together & Bundle Discounting.
  - Real-time Trending Products.

### 3. Backend & Cloud Integration
- **Supabase Cloud Database**: PostgreSQL schema with RLS policies covering 8 core entities (`products`, `orders`, `profiles`, `categories`, `reviews`, `coupons`, `cart_items`, `wishlist_items`).
- **Transactional Email Service**: Nodemailer SMTP sending HTML invoices, OTP codes, and welcome emails.
- **Payment Gateway Engine**: `paymentService.js` supporting Razorpay SDK, UPI (Google Pay, PhonePe), Credit/Debit Cards, NetBanking, and COD.

---

## 🔒 Security Specifications
1. **Row Level Security (RLS)**: Public read policy on catalog items, user-restricted read/write policies on orders and profiles.
2. **Helmet Security Headers**: Protection against XSS, clickjacking, and mime-sniffing.
3. **Environment Isolation**: `.env` secret management for API keys and JWT secrets.
