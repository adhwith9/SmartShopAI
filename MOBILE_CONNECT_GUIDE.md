# SmartShop AI - Mobile Connection & Setup Guide

This guide explains how to use the **SmartShop AI** application on your mobile phone via **Android APK** or **Mobile Web Browser**.

---

## ☁️ How Server Connection Works

Your app uses a **Cloud Database (Supabase)**:
- **Cloud Database URL**: `https://qdvrnyallalyjyjbofzh.supabase.co`
- **Data Persistence**: Products, user sign-ins, cart items, orders, and reviews are saved directly in the cloud.
- **No Local Laptop Server Required**: Once the APK is installed, your mobile app accesses cloud data over 4G/5G/Wi-Fi anywhere!

---

## 📱 Method 1: Install & Use the Android APK (Recommended)

### Step 1: Download the APK onto your phone
Open your phone's browser and go to:
👉 **[https://github.com/adhwith9/SmartShopAI/releases/tag/v1.0.0](https://github.com/adhwith9/SmartShopAI/releases/tag/v1.0.0)**

Or download directly from your local network link:
👉 `http://10.13.28.223:5173/SmartShopAI.apk`

---

### Step 2: Install the APK
1. Tap on the downloaded `SmartShopAI.apk` file on your phone.
2. If prompted with *"Install unknown apps"*, tap **Settings** and enable **"Allow from this source"**.
3. Tap **Install** and open **SmartShop AI**!

---

### Step 3: Use the App
- Open **SmartShop AI** on your phone screen.
- Enter any Gmail address (e.g. `yourname@gmail.com`) to sign in with OTP (`123456`).
- Explore products, add items to cart, select payment method (UPI / Card / COD), and place orders!

---

## 🌐 Method 2: Access via Mobile Browser (Same Wi-Fi)

If your laptop and mobile phone are connected to the **same Wi-Fi network**:

1. Make sure the dev server is running on your laptop (`npm run dev` in `frontend`).
2. Open **Chrome** or **Safari** on your mobile phone.
3. Type the network address:
   👉 **`http://10.13.28.223:5173`**
4. The full responsive SmartShop AI mobile web app will load instantly!
