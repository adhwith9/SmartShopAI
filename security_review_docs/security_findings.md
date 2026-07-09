# Security Findings Registry

This document records the security findings identified during the static, dependency, and active API security review of the SmartShop AI application.

---

## Summary of Findings

- **Total Findings**: 6
- **Critical Severity**: 0
- **High Severity**: 3
- **Medium Severity**: 2
- **Low Severity**: 1

---

## 1. High Severity Findings

### Finding SEC-SAST-001: Flask Debug Mode Active on Public Interface
- **Severity**: High
- **Source**: SAST (Static Scan)
- **File / Component**: [run.py](file:///Users/charanreddy/Desktop/smartshop-ai/backend/run.py#L7)
- **Vulnerable Code**:
  ```python
  app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5001")), debug=True)
  ```
- **Description**: The Flask application has `debug=True` enabled and binds to the wildcard interface `0.0.0.0`. In production, this causes the Werkzeug interactive debugger to be exposed on the network. If an unhandled exception occurs, an external attacker can execute arbitrary Python commands (Remote Code Execution) using the debugger terminal.
- **Proof of Concept / Replication**:
  1. Launch the backend server.
  2. Cause an exception by visiting an invalid URL or passing malformed inputs (e.g. `/api/products/invalid_id_string`).
  3. The Werkzeug debugger page is rendered. If the PIN is bypassed or disabled, python code can be executed directly.

### Finding SEC-SAST-002: Hardcoded Cryptographic Secret Keys
- **Severity**: High
- **Source**: SAST (Static Scan)
- **File / Component**: [__init__.py](file:///Users/charanreddy/Desktop/smartshop-ai/backend/app/__init__.py#L15-L16)
- **Vulnerable Code**:
  ```python
  app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
  app.config["JWT_SECRET"] = os.getenv("JWT_SECRET", "dev-jwt-secret")
  ```
- **Description**: The configuration contains hardcoded secret fallback keys (`"dev-secret"` and `"dev-jwt-secret"`). If the environment variable `JWT_SECRET` is not set or loaded incorrectly in the deployment, the app falls back to these strings. Because these strings are checked into source control, attackers can use them to forge valid JWT tokens and bypass authentication entirely.
- **Proof of Concept / Replication**:
  1. Construct a JWT payload with `"sub": 1` (Admin) and `"role": "admin"`.
  2. Sign the JWT payload using HMAC-SHA256 with the secret `"dev-jwt-secret"`.
  3. Send a request to `/api/admin/users` passing the forged token in the `Authorization: Bearer <TOKEN>` header.
  4. The server accepts the request and returns the administrative user list.

### Finding SEC-API-BOLA-001: Broken Object Level Authorization (IDOR) on Product Interactions
- **Severity**: High (Passive review mapping)
- **Source**: Architectural Review / API Audit
- **File / Component**: [routes.py](file:///Users/charanreddy/Desktop/smartshop-ai/backend/app/routes.py#L80-L81)
- **Vulnerable Code**:
  ```python
  user_id = request.args.get("user_id", type=int)
  db.session.add(Interaction(user_id=user_id, product_id=product_id, event_type="view", weight=1))
  ```
- **Description**: The system reads the `user_id` query parameter directly from the request and uses it to log database interactions. The route does not verify if the parameter matches the currently authenticated session user. Any customer can log view events on behalf of another user, polluting the recommender model matrix and manipulating recommendations.
- **Proof of Concept / Replication**:
  1. Perform a GET request to `/api/products/42?user_id=999` without passing any authorization token.
  2. Check the database `interactions` table. A new row logging user `999` viewing product `42` has been added.

---

## 2. Medium Severity Findings

### Finding SEC-API-CORS-001: Insecure CORS Wildcard Configuration
- **Severity**: Medium
- **Source**: Active API Scan
- **File / Component**: [__init__.py](file:///Users/charanreddy/Desktop/smartshop-ai/backend/app/__init__.py#L20)
- **Vulnerable Code**:
  ```python
  CORS(app, resources={r"/api/*": {"origins": "*"}})
  ```
- **Description**: The application permits all origins (`*`) for cross-origin requests. While useful for public datasets, having a wildcard CORS policy on authenticated routes allows malicious external scripts to read JSON payloads or interact with user endpoints (e.g. `/api/profile`, `/api/cart`) if authentication credentials are leaked or sent.
- **Proof of Concept / Replication**:
  1. Send an HTTP request:
     ```http
     GET /api/products HTTP/1.1
     Host: localhost:5001
     Origin: http://malicious-attacker-site.com
     ```
  2. The response header returned is `Access-Control-Allow-Origin: *`.

### Finding SEC-DEP-999: Outdated PyJWT Dependency
- **Severity**: Medium
- **Source**: Dependency Scan
- **File / Component**: [requirements.txt](file:///Users/charanreddy/Desktop/smartshop-ai/backend/requirements.txt#L4)
- **Vulnerable Code**:
  ```text
  PyJWT==2.8.0
  ```
- **Description**: PyJWT version 2.8.0 is outdated. Maintaining old cryptographic libraries increases the risk of signature verification bypass or exploitation of vulnerabilities related to token decoding mechanisms.
- **Proof of Concept / Replication**:
  1. Check the installed version of PyJWT using `pip show pyjwt`. It returns version `2.8.0`.

---

## 3. Low Severity Findings

### Finding SEC-API-H-CSP: Missing Content-Security-Policy (CSP) Header
- **Severity**: Low
- **Source**: Active API Scan
- **File / Component**: Global HTTP Headers
- **Description**: The API response does not include a `Content-Security-Policy` header. Although this is primarily an API service, implementing CSP limits cross-site scripting (XSS) risks if the server serves static documentation or error templates.
- **Proof of Concept / Replication**:
  1. Query `/api/health` using curl.
  2. Inspect response headers. The header `Content-Security-Policy` is absent.
