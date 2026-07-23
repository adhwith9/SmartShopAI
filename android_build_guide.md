# SmartShop AI - Android APK & Production Deployment Guide

This guide provides step-by-step instructions to generate a production-ready **Android APK** and **AAB** bundle using **Capacitor**.

---

## 📱 Step-by-Step Android APK Generation

### Step 1: Install Capacitor Android Dependencies
Navigate to the `frontend` directory:
```bash
cd frontend
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Build the Web Distribution Assets
```bash
npm run build
```
This generates the optimized bundle in `frontend/dist`.

### Step 3: Add & Sync Android Platform
```bash
npx cap add android
npx cap sync android
```

### Step 4: Add Firebase & Google Sign-In Credentials for Android
1. Open [Firebase Console](https://console.firebase.google.com).
2. Register an Android App with Package Name: `ai.smartshop.mobile.app`.
3. Download `google-services.json` and place it in:
   ```text
   frontend/android/app/google-services.json
   ```
4. Generate SHA-1 / SHA-256 Fingerprint:
   ```bash
   keytool -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore -storepass android -keypass android
   ```
   Add the generated SHA-1 fingerprint to your Firebase / Google Cloud App configuration.

### Step 5: Build Debug & Release APK
Open Android Studio or run Gradle from the CLI:
```bash
cd android
./gradlew assembleRelease
```
The output APK will be located at:
`frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 🛠️ Offline Support & Deep Links
- The application automatically uses **Capacitor Network** status API to detect offline state and load products from local persistent storage (`PersistentDatabase`).
- **Android Deep Links**: Defined in `AndroidManifest.xml` under `https://smartshop.ai/product/*`.
