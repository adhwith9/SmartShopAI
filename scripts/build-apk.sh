#!/usr/bin/env bash
# SmartShop AI - One-Click Android APK Build Script

set -e

echo "========================================================"
echo "📱 Building SmartShop AI Production Android APK..."
echo "========================================================"

cd "$(dirname "$0")/../frontend"

echo "1. Building Web Assets..."
npm run build

echo "2. Syncing Capacitor Android Project..."
npx cap sync android

echo "3. Compiling Android APK with Gradle..."
cd android
./gradlew assembleDebug

echo "========================================================"
echo "🎉 SUCCESS! Your Android APK is ready at:"
echo "   frontend/android/app/build/outputs/apk/debug/app-debug.apk"
echo "========================================================"
