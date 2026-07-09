from collections import Counter, defaultdict
import math
import re

from .models import Interaction, Product, Recommendation, Review, db


EVENT_WEIGHTS = {"view": 1.0, "wishlist": 2.5, "cart": 3.5, "purchase": 5.0, "rating": 4.0}


def product_similarity(product_id, limit=6):
    products = Product.query.all()
    if not products:
        return []
    target = next((p for p in products if p.product_id == product_id), None)
    if not target:
        return []
    target_vector = _text_vector(_product_document(target))
    ranked = [(p, _cosine(target_vector, _text_vector(_product_document(p)))) for p in products]
    ranked = sorted(ranked, key=lambda pair: pair[1], reverse=True)
    return [{"product": p.to_dict(), "score": float(score)} for p, score in ranked if p.product_id != product_id][:limit]


def personalized_recommendations(user_id, limit=8):
    products = Product.query.all()
    interactions = Interaction.query.filter_by(user_id=user_id).all()
    reviews = Review.query.filter_by(user_id=user_id).all()
    if not products:
        return []

    interacted_ids = {i.product_id for i in interactions}
    preference_terms = []
    for interaction in interactions:
        product = Product.query.get(interaction.product_id)
        if product:
            preference_terms.append(f"{product.category} {product.tags} {product.name}")
    for review in reviews:
        product = Product.query.get(review.product_id)
        if product and review.rating >= 4:
            preference_terms.append(f"{product.category} {product.tags}")

    content_scores = _content_scores(products, " ".join(preference_terms)) if preference_terms else {}
    collaborative_scores = _collaborative_scores(user_id)
    trending_scores = {item["product_id"]: item["score"] for item in trending_products(limit=len(products))}

    ranked = []
    for product in products:
        if product.product_id in interacted_ids:
            continue
        score = (
            0.50 * content_scores.get(product.product_id, 0)
            + 0.35 * collaborative_scores.get(product.product_id, 0)
            + 0.15 * trending_scores.get(product.product_id, 0)
        )
        score += product.rating / 20
        ranked.append((product, score))

    ranked.sort(key=lambda pair: pair[1], reverse=True)
    Recommendation.query.filter_by(user_id=user_id).delete()
    for product, score in ranked[:limit]:
        db.session.add(Recommendation(user_id=user_id, product_id=product.product_id, score=float(score)))
    db.session.commit()
    return [{"product": product.to_dict(), "score": round(float(score), 3)} for product, score in ranked[:limit]]


def trending_products(limit=8):
    counters = defaultdict(float)
    for interaction in Interaction.query.all():
        counters[interaction.product_id] += EVENT_WEIGHTS.get(interaction.event_type, 1) * interaction.weight
    for product in Product.query.all():
        counters[product.product_id] += product.rating * 1.5
    max_score = max(counters.values()) if counters else 1
    ranked = sorted(counters.items(), key=lambda pair: pair[1], reverse=True)
    return [{"product_id": pid, "score": round(score / max_score, 3)} for pid, score in ranked[:limit]]


def smart_suggestions(query, limit=6):
    query = (query or "").lower()
    if not query:
        return []
    products = Product.query.all()
    matches = [
        p for p in products
        if query in p.name.lower() or query in p.category.lower() or query in p.tags.lower()
    ]
    return [p.to_dict() for p in matches[:limit]]


def _content_scores(products, preference_document):
    preference_vector = _text_vector(preference_document)
    return {
        product.product_id: _cosine(preference_vector, _text_vector(_product_document(product)))
        for product in products
    }


def _collaborative_scores(user_id):
    user_vectors = defaultdict(lambda: defaultdict(float))
    for interaction in Interaction.query.filter(Interaction.user_id.isnot(None)).all():
        user_vectors[interaction.user_id][interaction.product_id] += interaction.weight * EVENT_WEIGHTS.get(interaction.event_type, 1)
    if user_id not in user_vectors:
        return {}
    target = user_vectors[user_id]
    scores = defaultdict(float)
    similarity_total = 0.0
    for other_user_id, vector in user_vectors.items():
        if other_user_id == user_id:
            continue
        similarity = _cosine(target, vector)
        if similarity <= 0:
            continue
        similarity_total += similarity
        for product_id, weight in vector.items():
            scores[product_id] += similarity * weight
    divisor = similarity_total or 1
    return {product_id: score / divisor for product_id, score in scores.items()}


def _product_document(product):
    return f"{product.name} {product.category} {product.description} {product.tags}"


def _text_vector(text):
    words = re.findall(r"[a-z0-9]+", (text or "").lower())
    stop = {"and", "the", "for", "with", "mode", "daily", "from"}
    return Counter(word for word in words if word not in stop)


def _cosine(left, right):
    if not left or not right:
        return 0.0
    shared = set(left) & set(right)
    numerator = sum(left[key] * right[key] for key in shared)
    left_norm = math.sqrt(sum(value * value for value in left.values()))
    right_norm = math.sqrt(sum(value * value for value in right.values()))
    return numerator / (left_norm * right_norm) if left_norm and right_norm else 0.0
