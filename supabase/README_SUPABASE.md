# SmartShop AI - Supabase Dataset & Connection Guide

This directory contains the database SQL scripts and documentation to connect **SmartShop AI** with **Supabase**.

---

## 📁 Files Included

- **`schema.sql`**: Complete PostgreSQL DDL schema creating tables (`products`, `categories`, `profiles`, `orders`, `cart_items`, `wishlist_items`, `reviews`, `coupons`), indexes, and Row Level Security (RLS) policies.
- **`seed.sql`**: DML script populating all initial products, categories, coupons, and mock user profiles into your Supabase database.
- **`../frontend/src/lib/supabaseClient.js`**: Frontend JavaScript SDK connection client and database querying helpers.
- **`../scripts/seed-supabase.js`**: Node.js script for seeding data automatically via `@supabase/supabase-js`.

---

## ⚡ Quick Setup Guide

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, choose a project name (e.g. `smartshop-ai`), and set your database password.
3. Once the project is provisioned, go to **Project Settings > API**.
4. Copy your **Project URL** (`VITE_SUPABASE_URL`) and **Anon / Public Key** (`VITE_SUPABASE_ANON_KEY`).

---

### Step 2: Create Tables & Seed Dataset

#### Option A: Supabase SQL Editor (Recommended)
1. In your Supabase Dashboard, click on **SQL Editor** from the left navigation menu.
2. Open `supabase/schema.sql`, copy its content, paste it into the SQL Editor, and click **Run**.
3. Open `supabase/seed.sql`, copy its content, paste it into the SQL Editor, and click **Run**.

#### Option B: Automated Node Script
Run the seeding script with your project credentials:
```bash
SUPABASE_URL="https://your-project-id.supabase.co" SUPABASE_SERVICE_KEY="your-service-role-key" node scripts/seed-supabase.js
```

---

### Step 3: Configure Environment Variables

Create `.env` file in the `frontend` folder:
```env
VITE_API_BASE=/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

Create `.env` file in the `backend` folder (if using Express backend with Supabase):
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
SUPABASE_ANON_KEY=your-actual-anon-key-here
```

---

### Step 4: Run the Application

Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will detect `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and interact directly with your live Supabase database dataset! If credentials are not present, it will seamlessly default to local persistent storage.

---

## 📊 Database Schema Overview

| Table Name | Description | Key Columns | RLS Status |
|---|---|---|---|
| `products` | Product catalog dataset | `product_id`, `name`, `category`, `price`, `stock`, `tags`, `image`, `specifications` | Enabled (Public Read) |
| `categories` | Product category taxonomy | `id`, `name`, `count`, `icon` | Enabled (Public Read) |
| `profiles` | Customer & Admin user profiles | `id`, `user_id`, `name`, `email`, `role`, `address` | Enabled |
| `orders` | Customer checkout orders | `order_id`, `user_email`, `items`, `total_amount`, `status`, `tracking_number` | Enabled |
| `reviews` | Product customer reviews | `id`, `product_id`, `user_email`, `rating`, `comment` | Enabled |
| `coupons` | Promotional discount codes | `code`, `discount_percent`, `free_shipping`, `description` | Enabled (Public Read) |
