from .models import db, User, Product, Order, Review, Interaction


PRODUCTS = [
    ("NeuralFit Running Shoes", "Adaptive foam sneakers tuned for everyday training.", "Fashion", 129.99, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", 42, 4.8, "fitness,shoes,wearable,comfort"),
    ("Aurora Noise-Canceling Headphones", "AI-assisted audio profiles with spatial sound and travel mode.", "Electronics", 249.00, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", 31, 4.7, "audio,travel,music,wireless"),
    ("Luma Smart Desk Lamp", "Circadian lighting, motion sensing, and voice assistant control.", "Home", 89.50, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80", 64, 4.5, "smart-home,lighting,office"),
    ("PulseTrack Pro Watch", "Health insights, recovery scoring, GPS, and long battery life.", "Electronics", 199.99, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", 25, 4.6, "wearable,fitness,health,gps"),
    ("TerraBlend Coffee Maker", "Precision brew profiles for espresso, pour-over, and cold brew.", "Kitchen", 159.00, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80", 18, 4.4, "coffee,kitchen,appliance"),
    ("CloudWeave Backpack", "Weatherproof commuter backpack with charging cable routing.", "Travel", 74.99, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", 53, 4.3, "travel,bag,commute,laptop"),
    ("ZenPod Meditation Speaker", "Guided soundscapes and room-aware acoustic balancing.", "Wellness", 119.00, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80", 36, 4.2, "wellness,audio,mindfulness"),
    ("PixelChef Air Fryer", "Connected recipe presets and crisp-control temperature sensing.", "Kitchen", 139.00, "https://images.unsplash.com/photo-1649006205978-8e8d443a7dd6?auto=format&fit=crop&w=900&q=80", 27, 4.5, "kitchen,smart,healthy"),
    ("NovaSkin Hydration Set", "Dermatologist-tested skincare bundle for daily routines.", "Beauty", 58.00, "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80", 88, 4.1, "beauty,skincare,self-care"),
    ("EdgeBook 14 Laptop", "Lightweight productivity laptop with AI camera and all-day power.", "Electronics", 1199.00, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", 12, 4.9, "computer,laptop,office,creator"),
    ("FlexCore Yoga Mat", "Non-slip alignment mat made from recycled natural rubber.", "Wellness", 49.00, "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80", 75, 4.6, "fitness,yoga,wellness"),
    ("ArcticFlow Water Bottle", "Self-cleaning insulated bottle with hydration reminders.", "Travel", 69.00, "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80", 47, 4.4, "hydration,travel,fitness"),
]


def seed_data():
    if User.query.first():
        return

    admin = User(name="Admin Demo", email="admin@smartshop.ai", role="admin", preferences="electronics,analytics")
    admin.set_password("admin123")
    customer = User(name="Ava Customer", email="ava@example.com", role="customer", preferences="electronics,fitness,travel")
    customer.set_password("customer123")
    user2 = User(name="Noah Buyer", email="noah@example.com", role="customer", preferences="kitchen,home,coffee")
    user2.set_password("customer123")
    db.session.add_all([admin, customer, user2])
    db.session.flush()

    products = []
    for item in PRODUCTS:
        product = Product(
            name=item[0], description=item[1], category=item[2], price=item[3],
            image=item[4], stock=item[5], rating=item[6], tags=item[7]
        )
        products.append(product)
        db.session.add(product)
    db.session.flush()

    events = [
        (customer.user_id, 2, "view", 1), (customer.user_id, 4, "cart", 1), (customer.user_id, 10, "wishlist", 1),
        (customer.user_id, 1, "purchase", 1), (customer.user_id, 11, "view", 1),
        (user2.user_id, 3, "view", 1), (user2.user_id, 5, "purchase", 1), (user2.user_id, 8, "cart", 1),
        (user2.user_id, 6, "view", 1), (None, 2, "view", 9), (None, 10, "view", 7), (None, 4, "view", 8),
    ]
    for user_id, product_id, event_type, weight in events:
        db.session.add(Interaction(user_id=user_id, product_id=product_id, event_type=event_type, weight=weight))

    db.session.add_all([
        Order(user_id=customer.user_id, total_amount=129.99, status="delivered"),
        Order(user_id=user2.user_id, total_amount=298.00, status="shipped"),
        Review(user_id=customer.user_id, product_id=1, rating=5, comment="Perfect fit and very accurate recommendation."),
        Review(user_id=user2.user_id, product_id=5, rating=4, comment="Great coffee profiles and simple setup."),
    ])
    db.session.commit()
