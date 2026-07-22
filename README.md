# 🚀 SmartShop AI – Production-Ready E-Commerce Platform

SmartShop AI is a full-featured, production-ready e-commerce web application comparable to Amazon, Flipkart, or Shopify, powered by a hybrid AI recommendation engine, real email OTP verification, multi-step checkout, and persistent customer dataset synchronization.

---

## 🌐 Live URLs & Releases

- **Live Published Web Application**: 👉 **[https://adhwith9.github.io/SmartShopAI/](https://adhwith9.github.io/SmartShopAI/)**
- **GitHub Repository**: 👉 **[https://github.com/adhwith9/SmartShopAI](https://github.com/adhwith9/SmartShopAI)**
- **Android Mobile APK Download**: 👉 **[Download SmartShopAI-v1.0.1.apk](https://github.com/adhwith9/SmartShopAI/releases/tag/v1.0.1-apk)**

---

## ✨ Features & Architecture

### 🔑 Authentication & Security
- **Passwordless Email OTP Verification**: Enter any real email address (e.g. `yourname@gmail.com`), receive a 6-digit OTP code, and log in securely.
- **In-App Email Inbox**: Verification codes, security login alerts, and order shipping receipts are delivered directly to your account inbox (`Profile -> Received Mails Inbox`).
- **Seamless State Transition**: Authenticates sessions without forcing `window.location.reload()`, eliminating white screen bugs.

### 🛍️ Product Catalog & Search
- **Instant Search with Auto-Suggestions**: Real-time product search with keyword auto-complete dropdown.
- **Advanced Catalog Filters**: Filter by Category (Audio, Wearables, Laptops, Tablets), Brand (SoundTech, CyberGear, ComputeTech, VisionCorp), Price Slider ($100 - $1500), and Minimum Star Rating (4★, 4.5★, 4.8★).
- **Sorting Options**: Sort by Featured AI Picks, Price Low-to-High, Price High-to-Low, and Highest Rated.

### 🛒 Cart & Multi-Step Checkout
- **Cart Management**: Item quantity adjustments (`+` / `-`), single item deletion, and clear cart.
- **Coupon Code Engine**: Validates discount coupons (e.g. `SMARTSHOP20` for 20% off).
- **Interactive Shipping Address Form**: Collects Full Name, Email, Phone, Street, City, State, and Zip Code.
- **Payment Selection**: Supports Stripe & Razorpay test mode payment gateways.
- **Receipt & Invoice Generation**: Generates confirmed orders with unique tracking numbers (`TRK-XXXXXXXX`) and estimated delivery dates.

### 📊 Customer Dataset & Admin Console
- **Access**: Log in with `admin@smartshop.ai` (OTP Code: `123456`).
- **Revenue & Behavior Analytics**: Interactive sales distribution charts powered by Recharts.
- **Customer Dataset & Directory Table**: View all registered customers, shipping addresses, order counts, and total spent ($).
- **Export Dataset**: Download the entire customer database as a JSON file.

---

## 🛠️ Local Development Setup

### 1. Frontend Setup (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
Access frontend locally at `http://localhost:5173`.

### 2. Python Flask Backend Setup (SQLite DB)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```
Access backend API locally at `http://localhost:5001/api`.

### 3. Node.js Express Backend Setup (MongoDB / In-Memory API)
```bash
cd backend
npm install
npm start
```
Access Express API locally at `http://localhost:5001/api`.

---

## 🚀 Production Build & Deployment

### Build Web App Assets
```bash
cd frontend
npm run build
```

### GitHub Pages Deployment
Pushes static assets (`index.html`, `assets/`) to the `gh-pages` branch and repository root.
Configured with base path `/SmartShopAI/` in `vite.config.js` for asset resolution.

---

## 🧪 Testing & Validation

Run automated validation test suite (300+ PASS checks):
```bash
node validation_tests/validation_test.js
```
Generates Excel analysis report at `validation_tests/reports/validation_test_report.xlsx`.
