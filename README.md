# SmartShop AI

AI-powered personalized recommendation engine for e-commerce platforms.

## Live Local Deployment

Frontend: http://localhost:5173  
Backend API: http://localhost:5001/api

Google Cloud Run deploys as one public URL that serves both the web app and `/api`.

Demo accounts:

- Customer: `ava@example.com` / `customer123`
- Admin: `admin@smartshop.ai` / `admin123`

## Run Locally

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Production frontend build:

```bash
cd frontend
npm run build
npm run preview
```

Production backend:

```bash
cd backend
source .venv/bin/activate
gunicorn "app:create_app()" --bind 0.0.0.0:5001
```

## Deploy To Google Cloud Run

Install the Google Cloud CLI, then run:

```bash
cd outputs/smartshop-ai
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud artifacts repositories create smartshop-ai --repository-format=docker --location=us-central1
gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=us-central1,_SECRET_KEY=replace-with-a-secret,_JWT_SECRET=replace-with-a-second-secret
```

After deployment finishes, Google prints a Cloud Run service URL. That single URL is the complete SmartShop AI app, including the customer pages and admin dashboard.

Alternative direct deploy from local Docker context:

```bash
gcloud run deploy smartshop-ai --source . --region us-central1 --allow-unauthenticated
```

## Database

The app runs immediately with SQLite. To use MySQL, set:

```bash
DATABASE_URL=mysql+pymysql://user:password@host:3306/smartshop_ai
```

Firestore support is prepared as an optional adapter. Set `USE_FIRESTORE=true` and `GOOGLE_APPLICATION_CREDENTIALS` to a service account file when extending persistence to Google Cloud Firestore.

## Features

- Customer auth, profile, browsing, search filters, cart, wishlist, orders, ratings, reviews
- AI recommendations using hybrid content similarity, collaborative behavior signals, and trending detection
- Admin dashboard with users, products, orders, inventory, review moderation, analytics, and recommendation metrics
- Responsive React/Tailwind UI with dark/light mode and animated e-commerce experience

## Selenium and Appium

This web app is ready for Selenium browser automation against `http://localhost:5173`. Appium can target a mobile browser session or a future native wrapper that points to the same responsive frontend.
