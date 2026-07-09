# Security Remediation Recommendations

This document outlines structural remedies, configuration patches, and code corrections to resolve the security vulnerabilities identified during the audit of the SmartShop AI application.

---

## 1. High Severity Vulnerabilities

### Finding SEC-SAST-001: Flask Debug Mode Active on Public Interface

#### Recommendation:
Load the debug flag and network binding settings from environment configurations, defaulting to secure production-ready settings. Never hardcode `debug=True` in executable entrypoints.

#### Remediation Patch:
Modify `backend/run.py` as follows:

```diff
-app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5001")), debug=True)
+debug_mode = os.getenv("FLASK_DEBUG", "False").lower() in ("true", "1", "yes")
+host_address = "127.0.0.1" if not debug_mode else "0.0.0.0"
+app.run(host=host_address, port=int(os.getenv("PORT", "5001")), debug=debug_mode)
```

---

### Finding SEC-SAST-002: Hardcoded Cryptographic Secret Keys

#### Recommendation:
Extract configurations from environment variables. In production, prevent the application from starting if these cryptographic secrets are missing.

#### Remediation Patch:
Modify `backend/app/__init__.py` as follows:

```diff
-app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
-app.config["JWT_SECRET"] = os.getenv("JWT_SECRET", "dev-jwt-secret")
+flask_env = os.getenv("FLASK_ENV", "production")
+secret_key = os.getenv("SECRET_KEY")
+jwt_secret = os.getenv("JWT_SECRET")
+
+if flask_env == "production":
+    if not secret_key:
+        raise RuntimeError("CRITICAL ERROR: SECRET_KEY environment variable must be set in production!")
+    if not jwt_secret:
+        raise RuntimeError("CRITICAL ERROR: JWT_SECRET environment variable must be set in production!")
+
+app.config["SECRET_KEY"] = secret_key or "dev-secret-fallback-key-do-not-use-in-prod"
+app.config["JWT_SECRET"] = jwt_secret or "dev-jwt-fallback-key-do-not-use-in-prod"
```

---

### Finding SEC-API-BOLA-001: Broken Object Level Authorization (IDOR) on Product Interactions

#### Recommendation:
Do not trust client-supplied user parameters in queries. Require standard user authentication (`@login_required`) and extract the active user context directly from the token object (`user.user_id`).

#### Remediation Patch:
Modify `backend/app/routes.py` as follows:

```diff
-@api.get("/products/<int:product_id>")
-def product_detail(product_id):
+@api.get("/products/<int:product_id>")
+@login_required
+def product_detail(user, product_id):
     product = Product.query.get_or_404(product_id)
-    user_id = request.args.get("user_id", type=int)
-    db.session.add(Interaction(user_id=user_id, product_id=product_id, event_type="view", weight=1))
+    db.session.add(Interaction(user_id=user.user_id, product_id=product_id, event_type="view", weight=1))
     db.session.commit()
```

---

## 2. Medium Severity Vulnerabilities

### Finding SEC-API-CORS-001: Insecure CORS Wildcard Configuration

#### Recommendation:
Avoid using the wildcard origin `*` on routes that handle user authentication or sessions. Configure Flask-Cors to load an explicit whitelist of trusted frontend domains from the environment.

#### Remediation Patch:
Modify `backend/app/__init__.py` as follows:

```diff
-CORS(app, resources={r"/api/*": {"origins": "*"}})
+cors_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")
+CORS(app, resources={r"/api/*": {"origins": cors_origins}})
```

---

### Finding SEC-DEP-999: Outdated PyJWT Dependency

#### Recommendation:
Update package definitions to utilize the latest security-hardened version of `PyJWT`.

#### Remediation Patch:
Modify `backend/requirements.txt` to upgrade PyJWT:

```diff
-PyJWT==2.8.0
+PyJWT==2.9.0
```

And update Werkzeug:

```diff
-Werkzeug==3.0.3
+Werkzeug==3.0.4
```

---

## 3. Low Severity Vulnerabilities

### Finding SEC-API-H-CSP: Missing HTTP Security Headers

#### Recommendation:
Append standard security headers on all HTTP response models using Flask's `@app.after_request` hooks. This ensures defense-in-depth security against XSS, clickjacking, and content-sniffing.

#### Remediation Patch:
Add the following global hook to `backend/app/__init__.py` (inside the `create_app` factory):

```python
    @app.after_request
    def apply_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        if os.getenv("FLASK_ENV") == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response
```
