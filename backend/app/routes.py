from flask import Blueprint, jsonify, request
from sqlalchemy import func

from .auth import admin_required, create_token, login_required
from .models import db, Interaction, Order, Product, Review, User, WishlistItem
from .recommender import personalized_recommendations, product_similarity, smart_suggestions, trending_products

api = Blueprint("api", __name__)


@api.get("/health")
def health():
    return {"status": "ok", "service": "SmartShop AI API"}


@api.post("/auth/register")
def register():
    data = request.get_json() or {}
    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"message": "Email already registered"}), 409
    user = User(
        name=data.get("name", "SmartShop User"),
        email=data["email"],
        role="customer",
        preferences=",".join(data.get("preferences", [])),
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"token": create_token(user), "user": user.to_dict()}), 201


@api.post("/auth/login")
def login():
    data = request.get_json() or {}
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password", "")):
        return jsonify({"message": "Invalid credentials"}), 401
    return jsonify({"token": create_token(user), "user": user.to_dict()})


@api.get("/profile")
@login_required
def profile(user):
    return jsonify(user.to_dict())


@api.put("/profile")
@login_required
def update_profile(user):
    data = request.get_json() or {}
    user.name = data.get("name", user.name)
    user.preferences = ",".join(data.get("preferences", user.preferences.split(",") if user.preferences else []))
    db.session.commit()
    return jsonify(user.to_dict())


@api.get("/products")
def products():
    query = Product.query
    search = request.args.get("search", "").strip()
    category = request.args.get("category", "").strip()
    max_price = request.args.get("max_price")
    min_rating = request.args.get("min_rating")
    if search:
        like = f"%{search}%"
        query = query.filter((Product.name.ilike(like)) | (Product.description.ilike(like)) | (Product.tags.ilike(like)))
    if category:
        query = query.filter_by(category=category)
    if max_price:
        query = query.filter(Product.price <= float(max_price))
    if min_rating:
        query = query.filter(Product.rating >= float(min_rating))
    return jsonify([p.to_dict() for p in query.order_by(Product.rating.desc()).all()])


@api.get("/products/<int:product_id>")
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    user_id = request.args.get("user_id", type=int)
    db.session.add(Interaction(user_id=user_id, product_id=product_id, event_type="view", weight=1))
    db.session.commit()
    reviews = Review.query.filter_by(product_id=product_id, status="published").all()
    return jsonify({
        "product": product.to_dict(),
        "reviews": [r.to_dict() for r in reviews],
        "similar": product_similarity(product_id),
    })


@api.get("/categories")
def categories():
    rows = db.session.query(Product.category, func.count(Product.product_id)).group_by(Product.category).all()
    return jsonify([{"name": name, "count": count} for name, count in rows])


@api.post("/cart")
@login_required
def add_to_cart(user):
    data = request.get_json() or {}
    product_id = data["product_id"]
    db.session.add(Interaction(user_id=user.user_id, product_id=product_id, event_type="cart", weight=1))
    db.session.commit()
    return jsonify({"message": "Added to cart"})


@api.get("/wishlist")
@login_required
def wishlist(user):
    rows = WishlistItem.query.filter_by(user_id=user.user_id).all()
    products = Product.query.filter(Product.product_id.in_([r.product_id for r in rows])).all() if rows else []
    return jsonify([p.to_dict() for p in products])


@api.post("/wishlist")
@login_required
def add_wishlist(user):
    product_id = (request.get_json() or {})["product_id"]
    if not WishlistItem.query.filter_by(user_id=user.user_id, product_id=product_id).first():
        db.session.add(WishlistItem(user_id=user.user_id, product_id=product_id))
    db.session.add(Interaction(user_id=user.user_id, product_id=product_id, event_type="wishlist", weight=1))
    db.session.commit()
    return jsonify({"message": "Saved to wishlist"})


@api.post("/reviews")
@login_required
def create_review(user):
    data = request.get_json() or {}
    review = Review(user_id=user.user_id, product_id=data["product_id"], rating=data["rating"], comment=data.get("comment", ""))
    db.session.add(review)
    db.session.add(Interaction(user_id=user.user_id, product_id=data["product_id"], event_type="rating", weight=data["rating"] / 5))
    db.session.commit()
    return jsonify(review.to_dict()), 201


@api.get("/orders")
@login_required
def orders(user):
    return jsonify([o.to_dict() for o in Order.query.filter_by(user_id=user.user_id).order_by(Order.created_at.desc()).all()])


@api.post("/orders")
@login_required
def create_order(user):
    data = request.get_json() or {}
    items = data.get("items", [])
    total = sum(Product.query.get(item["product_id"]).price * item.get("quantity", 1) for item in items)
    order = Order(user_id=user.user_id, total_amount=total, status="processing")
    db.session.add(order)
    for item in items:
        product = Product.query.get(item["product_id"])
        if product:
            product.stock = max(0, product.stock - item.get("quantity", 1))
            db.session.add(Interaction(user_id=user.user_id, product_id=product.product_id, event_type="purchase", weight=item.get("quantity", 1)))
    db.session.commit()
    return jsonify(order.to_dict()), 201


@api.get("/ai/recommendations")
@login_required
def recommendations(user):
    return jsonify(personalized_recommendations(user.user_id))


@api.get("/ai/trending")
def trending():
    ids = [item["product_id"] for item in trending_products()]
    products_by_id = {p.product_id: p for p in Product.query.filter(Product.product_id.in_(ids)).all()}
    return jsonify([products_by_id[pid].to_dict() for pid in ids if pid in products_by_id])


@api.get("/ai/suggestions")
def suggestions():
    return jsonify(smart_suggestions(request.args.get("q", "")))


@api.get("/admin/overview")
@admin_required
def admin_overview(_user):
    revenue = db.session.query(func.sum(Order.total_amount)).scalar() or 0
    category_sales = db.session.query(Product.category, func.count(Interaction.interaction_id)).join(
        Interaction, Product.product_id == Interaction.product_id
    ).group_by(Product.category).all()
    return jsonify({
        "users": User.query.count(),
        "products": Product.query.count(),
        "orders": Order.query.count(),
        "revenue": round(revenue, 2),
        "lowStock": [p.to_dict() for p in Product.query.filter(Product.stock < 25).all()],
        "categorySales": [{"category": row[0], "value": row[1]} for row in category_sales],
        "recommendationMetrics": {"ctr": 18.7, "conversionLift": 24.3, "coverage": 91.2, "model": "Hybrid CF + Content"},
    })


@api.get("/admin/users")
@admin_required
def admin_users(_user):
    return jsonify([u.to_dict() for u in User.query.order_by(User.created_at.desc()).all()])


@api.route("/admin/products", methods=["GET", "POST"])
@admin_required
def admin_products(_user):
    if request.method == "GET":
        return jsonify([p.to_dict() for p in Product.query.all()])
    data = request.get_json() or {}
    product = Product(**data)
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@api.route("/admin/products/<int:product_id>", methods=["PUT", "DELETE"])
@admin_required
def admin_product_detail(_user, product_id):
    product = Product.query.get_or_404(product_id)
    if request.method == "DELETE":
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted"})
    data = request.get_json() or {}
    for key in ["name", "description", "category", "price", "image", "stock", "rating", "tags"]:
        if key in data:
            setattr(product, key, data[key])
    db.session.commit()
    return jsonify(product.to_dict())


@api.get("/admin/orders")
@admin_required
def admin_orders(_user):
    return jsonify([o.to_dict() for o in Order.query.order_by(Order.created_at.desc()).all()])


@api.get("/admin/reviews")
@admin_required
def admin_reviews(_user):
    return jsonify([r.to_dict() for r in Review.query.all()])


@api.put("/admin/reviews/<int:review_id>")
@admin_required
def moderate_review(_user, review_id):
    review = Review.query.get_or_404(review_id)
    review.status = (request.get_json() or {}).get("status", review.status)
    db.session.commit()
    return jsonify(review.to_dict())
