import os


def get_firestore_client():
    """Optional Firestore bridge for teams that want cloud persistence later."""
    if os.getenv("USE_FIRESTORE", "false").lower() != "true":
        return None
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            firebase_admin.initialize_app(credentials.Certificate(cred_path) if cred_path else None)
        return firestore.client()
    except Exception:
        return None
