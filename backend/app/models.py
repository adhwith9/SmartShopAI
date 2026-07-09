from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import firestore_adapter

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(180), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(40), default="customer")
    preferences = db.Column(db.String(255), default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "preferences": self.preferences.split(",") if self.preferences else [],
            "created_at": self.created_at.isoformat(),
        }


class Product(db.Model):
    __tablename__ = "products"
    product_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(180), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(500), nullable=False)
    stock = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0)
    tags = db.Column(db.String(255), default="")

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "price": self.price,
            "image": self.image,
            "stock": self.stock,
            "rating": self.rating,
            "tags": self.tags.split(",") if self.tags else [],
        }


class Order(db.Model):
    __tablename__ = "orders"
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(40), default="processing")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "order_id": self.order_id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class Review(db.Model):
    __tablename__ = "reviews"
    review_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, default="")
    status = db.Column(db.String(40), default="published")

    def to_dict(self):
        return {
            "review_id": self.review_id,
            "product_id": self.product_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "comment": self.comment,
            "status": self.status,
        }


class Recommendation(db.Model):
    __tablename__ = "recommendations"
    recommendation_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False)
    score = db.Column(db.Float, default=0)

    def to_dict(self):
        return {
            "recommendation_id": self.recommendation_id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "score": self.score,
        }


class Interaction(db.Model):
    __tablename__ = "interactions"
    interaction_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False)
    event_type = db.Column(db.String(40), nullable=False)
    weight = db.Column(db.Float, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class WishlistItem(db.Model):
    __tablename__ = "wishlist"
    item_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"), nullable=False)
