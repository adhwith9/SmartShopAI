# API Endpoint Inventory

This inventory documents all the backend API endpoints exposed by the SmartShop AI application, including their HTTP methods, authentication levels, query parameters, payload schemas, and security risk factors.

---

## 1. Authentication & Profile Endpoints

### Health Check
- **Path**: `/api/health`
- **Method**: `GET`
- **Authentication**: None (Public)
- **Input Parameters**: None
- **Response Format**: `{"status": "ok", "service": "SmartShop AI API"}`
- **Security Considerations**: Lower risk. Ensure it does not leak system architecture details or environment configurations.

### User Registration
- **Path**: `/api/auth/register`
- **Method**: `POST`
- **Authentication**: None (Public)
- **Request Body (JSON)**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123",
    "name": "John Doe",
    "preferences": ["electronics", "books"]
  }
  ```
- **Response Format**: JWT authentication token and created user profile data.
- **Security Considerations**: High risk. Requires password hashing (currently uses PBKDF2/Werkzeug hash helper), SQLi prevention, and rate-limiting to prevent automated spam registration.

### User Login
- **Path**: `/api/auth/login`
- **Method**: `POST`
- **Authentication**: None (Public)
- **Request Body (JSON)**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response Format**: JWT authentication token and logged-in user profile data.
- **Security Considerations**: High risk. Must prevent brute-force attacks via credential stuffing. Ensure default/fallback keys are not used to sign JWTs.

### Get User Profile
- **Path**: `/api/profile`
- **Method**: `GET`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response Format**: Active user account profile dictionary.
- **Security Considerations**: Medium risk. Ensure the JWT parsing routine validates signatures strictly and is not susceptible to `alg: none` or default secret key forge attacks.

### Update User Profile
- **Path**: `/api/profile`
- **Method**: `PUT`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Request Body (JSON)**:
  ```json
  {
    "name": "Jane Doe",
    "preferences": ["home", "sports"]
  }
  ```
- **Response Format**: Updated user details.
- **Security Considerations**: Medium risk. Sanitize input to prevent stored XSS attacks if profile names are rendered directly in administrative interfaces.

---

## 2. Product Catalog Endpoints

### List Products
- **Path**: `/api/products`
- **Method**: `GET`
- **Authentication**: None (Public)
- **Query Parameters**:
  - `search` (string): Text filter on product names, tags, and description.
  - `category` (string): Filters products by category type.
  - `max_price` (float): Filters products up to a maximum price.
  - `min_rating` (float): Filters products above a minimum rating.
- **Response Format**: Sorted array of matching product objects.
- **Security Considerations**: High risk. Vulnerable to SQL Injection and Denial of Service (DoS) if large database outputs are fetched without pagination or if inputs are concatenated into raw queries (SQLAlchemy ORM avoids raw concatenation).

### Product Details
- **Path**: `/api/products/<int:product_id>`
- **Method**: `GET`
- **Authentication**: None (Public)
- **Query Parameters**:
  - `user_id` (int, optional): Logged-in user tracking identifier.
- **Response Format**: Complete product data, list of published reviews, and recommended similar products.
- **Security Considerations**: High risk. Insecure Direct Object Reference (IDOR/BOLA) and parameter tampering in `user_id` parameter can corrupt user action weight matrices without authentication.

### List Categories
- **Path**: `/api/categories`
- **Method**: `GET`
- **Authentication**: None (Public)
- **Response Format**: List of all unique product categories and active inventories.
- **Security Considerations**: Low risk.

---

## 3. Customer Actions & Shopping Endpoints

### Add Item to Cart
- **Path**: `/api/cart`
- **Method**: `POST`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Request Body (JSON)**:
  ```json
  {
    "product_id": 42
  }
  ```
- **Response Format**: Confirmation message.
- **Security Considerations**: Medium risk. Ensure the validated JWT user ID is used to construct cart relationships instead of trusting client-supplied user parameters.

### Get Wishlist
- **Path**: `/api/wishlist`
- **Method**: `GET`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Response Format**: Array of products currently in the user's wishlist.
- **Security Considerations**: Medium risk. Ensure proper authorization checks to prevent users from viewing other customers' wishlists.

### Save to Wishlist
- **Path**: `/api/wishlist`
- **Method**: `POST`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Request Body (JSON)**:
  ```json
  {
    "product_id": 42
  }
  ```
- **Response Format**: Confirmation message.
- **Security Considerations**: Medium risk.

### Post Product Review
- **Path**: `/api/reviews`
- **Method**: `POST`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Request Body (JSON)**:
  ```json
  {
    "product_id": 42,
    "rating": 5,
    "comment": "Excellent quality recommendation!"
  }
  ```
- **Response Format**: Created review record details.
- **Security Considerations**: Medium risk. Sanitize `comment` parameter against HTML/JavaScript strings to prevent stored XSS attacks in admin review dashboards.

### List Orders
- **Path**: `/api/orders`
- **Method**: `GET`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Response Format**: Historical list of orders placed by the current user.
- **Security Considerations**: High risk. Prevent horizontal privilege escalation where users can access other customers' invoice details.

### Create Order (Checkout)
- **Path**: `/api/orders`
- **Method**: `POST`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Request Body (JSON)**:
  ```json
  {
    "items": [
      { "product_id": 12, "quantity": 2 },
      { "product_id": 3, "quantity": 1 }
    ]
  }
  ```
- **Response Format**: Created order record, with totals and order status.
- **Security Considerations**: High risk. Price tampering verification: The API must recalculate total prices based on database state instead of trusting price parameters in the client payload.

---

## 4. AI Recommendation Endpoints

### Personalized Recommendations
- **Path**: `/api/ai/recommendations`
- **Method**: `GET`
- **Authentication**: Bearer Token Required (`@login_required`)
- **Response Format**: Custom recommended products based on collaborative filtering.
- **Security Considerations**: Medium risk.

### Trending Products
- **Path**: `/api/ai/trending`
- **Method**: `GET`
- **Authentication**: None (Public)
- **Response Format**: Array of currently popular products.
- **Security Considerations**: Low risk.

### Smart Autocomplete Suggestions
- **Path**: `/api/ai/suggestions`
- **Method**: `GET`
- **Authentication**: None (Public)
- **Query Parameters**:
  - `q` (string): Query prefix input.
- **Response Format**: List of suggested keyword combinations.
- **Security Considerations**: Medium risk. Ensure the search query validation handles SQL metacharacters safely and resists denial-of-service triggers.

---

## 5. Administrative Endpoints

> [!CAUTION]
> All endpoints under `/api/admin/*` require full administrative credentials. Improper security mappings here present critical risks of data exposure, product price alteration, or total system compromise.

### Admin Dashboard Overview
- **Path**: `/api/admin/overview`
- **Method**: `GET`
- **Authentication**: Admin JWT Token Required (`@admin_required`)
- **Response Format**: Key business metrics: total users, products, orders, revenues, and low stock lists.
- **Security Considerations**: Critical risk. Must prevent unauthorized access by enforcing checks at the controller entry point.

### List Users Directory
- **Path**: `/api/admin/users`
- **Method**: `GET`
- **Authentication**: Admin JWT Token Required (`@admin_required`)
- **Response Format**: Comprehensive directory of all registered user records.
- **Security Considerations**: Critical risk. Leaks complete PII datasets (names, emails, preferences, creation dates) if compromised.

### List/Create Administrative Products
- **Path**: `/api/admin/products`
- **Methods**: `GET`, `POST`
- **Authentication**: Admin JWT Token Required (`@admin_required`)
- **POST Request Body (JSON)**:
  ```json
  {
    "name": "Smart Speaker Max",
    "description": "High fidelity audio speaker with AI integration.",
    "category": "Electronics",
    "price": 149.99,
    "stock": 100,
    "tags": "speaker,audio,smart"
  }
  ```
- **Response Format**: Created/listed products registry.
- **Security Considerations**: Critical risk (POST). Unauthenticated creation allows malicious modifications to pricing catalogs.

### Update/Delete Administrative Product
- **Path**: `/api/admin/products/<int:product_id>`
- **Methods**: `PUT`, `DELETE`
- **Authentication**: Admin JWT Token Required (`@admin_required`)
- **PUT Request Body (JSON)**: Update fields (pricing, stock, etc.).
- **Response Format**: Confirmation payload.
- **Security Considerations**: Critical risk. Unauthorized price alteration or delete requests.

### List All Global Orders
- **Path**: `/api/admin/orders`
- **Method**: `GET`
- **Authentication**: Admin JWT Token Required (`@admin_required`)
- **Response Format**: Chronological registry of all purchase activities across the site.
- **Security Considerations**: Critical risk.

### Moderate Review Status
- **Path**: `/api/admin/reviews/<int:review_id>`
- **Method**: `PUT`
- **Authentication**: Admin JWT Token Required (`@admin_required`)
- **Request Body (JSON)**:
  ```json
  {
    "status": "approved"
  }
  ```
- **Response Format**: Updated review model data.
- **Security Considerations**: Critical risk.
