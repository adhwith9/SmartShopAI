const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const MOCK_PRODUCTS = [
  {
    product_id: 1,
    name: "AeroPods Max Wireless Headphones",
    category: "Audio",
    price: 199.99,
    rating: 4.8,
    reviews_count: 142,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    description: "Active noise canceling premium spatial audio headphones with 30-hour battery life and ultra-comfortable memory foam ear cushions."
  },
  {
    product_id: 2,
    name: "CyberWatch Pro Smartwatch",
    category: "Wearables",
    price: 299.99,
    rating: 4.6,
    reviews_count: 98,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    description: "Advanced health tracker with ECG, blood oxygen sensor, GPS navigation, and crystal-clear AMOLED always-on display."
  },
  {
    product_id: 3,
    name: "NeuraSound Earbuds",
    category: "Audio",
    price: 129.99,
    rating: 4.7,
    reviews_count: 76,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
    description: "True wireless noise-isolating earbuds with adaptive equalizer, IPX7 water resistance, and wireless charging case."
  },
  {
    product_id: 4,
    name: "VisionGlass AR Glasses",
    category: "Wearables",
    price: 499.99,
    rating: 4.5,
    reviews_count: 34,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
    description: "Next-gen augmented reality smart glasses with Micro-OLED heads-up display and real-time voice translation."
  },
  {
    product_id: 5,
    name: "ProBook X Laptop 16-inch",
    category: "Laptops",
    price: 1299.99,
    rating: 4.9,
    reviews_count: 210,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60",
    description: "High-performance workstation featuring 14-core processor, 32GB RAM, 1TB NVMe SSD, and 120Hz Retina Display."
  },
  {
    product_id: 6,
    name: "SmartPad Ultra Tablet 11",
    category: "Tablets",
    price: 599.99,
    rating: 4.7,
    reviews_count: 115,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
    description: "Versatile tablet with stylus pen support, Quad Speakers, 5G connectivity, and all-day battery life."
  }
];

export const MOCK_CATEGORIES = [
  { name: "Audio", count: 2 },
  { name: "Wearables", count: 2 },
  { name: "Laptops", count: 1 },
  { name: "Tablets", count: 1 }
];

// Persistent Database Engine
class PersistentDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("smartshop_db_users")) {
      const defaultUsers = [
        {
          user_id: 1,
          name: "SmartShop Customer",
          email: "user@smartshop.ai",
          password: "password123",
          role: "customer",
          preferences: ["Audio", "Wearables"]
        },
        {
          user_id: 2,
          name: "Ava Johnson",
          email: "ava@example.com",
          password: "customer123",
          role: "customer",
          preferences: ["Electronics", "Fitness"]
        },
        {
          user_id: 3,
          name: "System Admin",
          email: "admin@smartshop.ai",
          password: "admin123",
          role: "admin",
          preferences: ["All"]
        }
      ];
      localStorage.setItem("smartshop_db_users", JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem("smartshop_db_emails")) {
      const defaultEmails = {
        "user@smartshop.ai": [
          {
            id: 101,
            sender: "no-reply@smartshop.ai",
            subject: "Welcome to SmartShop AI!",
            date: new Date().toLocaleDateString(),
            snippet: "Your account user@smartshop.ai has been created successfully. Explore personalized AI deals!"
          },
          {
            id: 102,
            sender: "orders@smartshop.ai",
            subject: "Order Confirmation #ORD-8842",
            date: new Date().toLocaleDateString(),
            snippet: "Thank you for your order! Your AeroPods Max purchase has been processed."
          }
        ],
        "ava@example.com": [
          {
            id: 103,
            sender: "no-reply@smartshop.ai",
            subject: "Welcome to SmartShop AI!",
            date: new Date().toLocaleDateString(),
            snippet: "Your account ava@example.com is active. Check out your personalized recommendations."
          }
        ],
        "admin@smartshop.ai": [
          {
            id: 104,
            sender: "system@smartshop.ai",
            subject: "Admin Access Granted",
            date: new Date().toLocaleDateString(),
            snippet: "You have full administrator privileges to manage products, view metrics, and moderate reviews."
          }
        ]
      };
      localStorage.setItem("smartshop_db_emails", JSON.stringify(defaultEmails));
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem("smartshop_db_users")) || [];
    } catch (e) {
      return [];
    }
  }

  saveUsers(users) {
    localStorage.setItem("smartshop_db_users", JSON.stringify(users));
  }

  getEmails(email) {
    try {
      const emailsObj = JSON.parse(localStorage.getItem("smartshop_db_emails")) || {};
      return emailsObj[email] || [
        {
          id: Date.now(),
          sender: "no-reply@smartshop.ai",
          subject: "Welcome to SmartShop AI!",
          date: new Date().toLocaleDateString(),
          snippet: `Welcome ${email}! Your account is active and synced with the database.`
        }
      ];
    } catch (e) {
      return [];
    }
  }

  registerUser(userData) {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error("Email already registered in database");
    }

    const newUser = {
      user_id: users.length + 1,
      name: userData.name || "SmartShop User",
      email: userData.email,
      password: userData.password,
      role: "customer",
      preferences: userData.preferences || ["General"]
    };

    users.push(newUser);
    this.saveUsers(users);

    // Generate welcome mail
    const emailsObj = JSON.parse(localStorage.getItem("smartshop_db_emails")) || {};
    emailsObj[userData.email] = [
      {
        id: Date.now(),
        sender: "welcome@smartshop.ai",
        subject: "🎉 Welcome to SmartShop AI!",
        date: new Date().toLocaleDateString(),
        snippet: `Hello ${newUser.name}, thank you for registering (${newUser.email}). Your profile and preferences have been stored in the database!`
      }
    ];
    localStorage.setItem("smartshop_db_emails", JSON.stringify(emailsObj));

    return {
      token: `jwt-db-token-${newUser.user_id}-${Date.now()}`,
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        preferences: newUser.preferences
      }
    };
  }

  loginUser(email, password) {
    const users = this.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      // Allow fallback creation for seamless login demo if not existing
      return this.registerUser({ email, password, name: email.split("@")[0] });
    }

    return {
      token: `jwt-db-token-${found.user_id}-${Date.now()}`,
      user: {
        user_id: found.user_id,
        name: found.name,
        email: found.email,
        role: found.role,
        preferences: found.preferences
      }
    };
  }
}

const db = new PersistentDatabase();

export async function api(path, options = {}) {
  const token = localStorage.getItem("smartshop_token");
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return data;
    }
  } catch (err) {
    console.warn(`API call to ${path} using offline persistent database.`);
  }

  // Database Handler & Router
  if (path.includes("/auth/login")) {
    const body = options.body ? JSON.parse(options.body) : {};
    return db.loginUser(body.email || "user@smartshop.ai", body.password || "password123");
  }

  if (path.includes("/auth/register")) {
    const body = options.body ? JSON.parse(options.body) : {};
    return db.registerUser(body);
  }

  if (path.includes("/emails")) {
    const userStr = localStorage.getItem("smartshop_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    return db.getEmails(currentUser ? currentUser.email : "user@smartshop.ai");
  }

  if (path.includes("/ai/trending") || path.includes("/ai/recommendations") || path.includes("/products")) {
    return MOCK_PRODUCTS;
  }

  if (path.includes("/categories")) {
    return MOCK_CATEGORIES;
  }

  if (path.includes("/orders") || path.includes("/wishlist") || path.includes("/cart")) {
    return [];
  }

  if (path.includes("/admin/metrics")) {
    return { total_sales: 15480.50, orders_count: 142, ctr: 4.8, conversion_rate: 3.2 };
  }

  return [];
}
