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
          address: { fullName: "SmartShop Customer", street: "742 Evergreen Terrace", city: "Springfield", state: "IL", zip: "62704", phone: "+1 555-0199" },
          preferences: ["Audio", "Wearables"],
          created_at: new Date().toISOString()
        },
        {
          user_id: 2,
          name: "Ava Johnson",
          email: "ava@example.com",
          password: "customer123",
          role: "customer",
          address: { fullName: "Ava Johnson", street: "100 Innovation Way", city: "Austin", state: "TX", zip: "78701", phone: "+1 555-0144" },
          preferences: ["Electronics", "Fitness"],
          created_at: new Date().toISOString()
        },
        {
          user_id: 3,
          name: "System Admin",
          email: "admin@smartshop.ai",
          password: "admin123",
          role: "admin",
          address: { fullName: "System Administrator", street: "1 Infinite Loop", city: "Cupertino", state: "CA", zip: "95014", phone: "+1 555-0100" },
          preferences: ["All"],
          created_at: new Date().toISOString()
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
            subject: "🎉 Welcome to SmartShop AI!",
            date: new Date().toLocaleDateString(),
            snippet: "Your account user@smartshop.ai has been created successfully. Explore personalized AI deals!"
          }
        ],
        "ava@example.com": [
          {
            id: 102,
            sender: "no-reply@smartshop.ai",
            subject: "🎉 Welcome to SmartShop AI!",
            date: new Date().toLocaleDateString(),
            snippet: "Your account ava@example.com is active. Check out your personalized recommendations."
          }
        ],
        "admin@smartshop.ai": [
          {
            id: 103,
            sender: "system@smartshop.ai",
            subject: "⚡ Admin Access Granted",
            date: new Date().toLocaleDateString(),
            snippet: "You have full administrator privileges to view customer datasets, manage inventory, and monitor orders."
          }
        ]
      };
      localStorage.setItem("smartshop_db_emails", JSON.stringify(defaultEmails));
    }

    if (!localStorage.getItem("smartshop_db_orders")) {
      localStorage.setItem("smartshop_db_orders", JSON.stringify([]));
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

  getOrders() {
    try {
      return JSON.parse(localStorage.getItem("smartshop_db_orders")) || [];
    } catch (e) {
      return [];
    }
  }

  saveOrders(orders) {
    localStorage.setItem("smartshop_db_orders", JSON.stringify(orders));
  }

  addEmail(email, mailObj) {
    try {
      const emailsObj = JSON.parse(localStorage.getItem("smartshop_db_emails")) || {};
      if (!emailsObj[email]) emailsObj[email] = [];
      emailsObj[email].unshift(mailObj);
      localStorage.setItem("smartshop_db_emails", JSON.stringify(emailsObj));
    } catch (e) {}
  }

  getEmails(email) {
    try {
      const emailsObj = JSON.parse(localStorage.getItem("smartshop_db_emails")) || {};
      return emailsObj[email] || [
        {
          id: Date.now(),
          sender: "no-reply@smartshop.ai",
          subject: "🎉 Welcome to SmartShop AI!",
          date: new Date().toLocaleDateString(),
          snippet: `Welcome ${email}! Your account is active and saved in the database.`
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
      address: userData.address || { fullName: userData.name || "SmartShop User", street: "", city: "", state: "", zip: "", phone: "" },
      preferences: userData.preferences || ["General"],
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    this.addEmail(userData.email, {
      id: Date.now(),
      sender: "welcome@smartshop.ai",
      subject: "🎉 Registration Successful & Account Active",
      date: new Date().toLocaleDateString(),
      snippet: `Hello ${newUser.name}, your registration for ${newUser.email} is complete. Your details are saved in the customer dataset!`
    });

    return {
      token: `jwt-db-token-${newUser.user_id}-${Date.now()}`,
      user: newUser
    };
  }

  loginUser(email, password) {
    const users = this.getUsers();
    let found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      // Auto-register demo logins dynamically
      const auth = this.registerUser({ email, password, name: email.split("@")[0] });
      found = auth.user;
    }

    // Trigger Login Notification Email into user inbox
    this.addEmail(found.email, {
      id: Date.now(),
      sender: "security@smartshop.ai",
      subject: "🔐 Security Alert: Successful Login Detected",
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      snippet: `Hello ${found.name}, a new login to your account (${found.email}) was recorded from your current device. Welcome back!`
    });

    return {
      token: `jwt-db-token-${found.user_id}-${Date.now()}`,
      user: found
    };
  }

  createOrder(userEmail, orderData) {
    const orders = this.getOrders();
    const users = this.getUsers();
    const currentUser = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase()) || { user_id: 1, email: userEmail, name: "Customer" };

    if (orderData.address) {
      currentUser.address = orderData.address;
      this.saveUsers(users);
    }

    const newOrder = {
      order_id: orders.length + 101,
      user_id: currentUser.user_id,
      user_email: userEmail,
      user_name: currentUser.name,
      items: orderData.items || [],
      total_amount: orderData.total_amount || 199.99,
      shipping_address: orderData.address || currentUser.address || {},
      status: "Processing & Order Confirmed",
      created_at: new Date().toISOString()
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);

    const addrStr = newOrder.shipping_address.street ? `${newOrder.shipping_address.street}, ${newOrder.shipping_address.city}` : "Saved Shipping Address";
    this.addEmail(userEmail, {
      id: Date.now(),
      sender: "fulfillment@smartshop.ai",
      subject: `📦 Order Confirmation #ORD-${newOrder.order_id}`,
      date: new Date().toLocaleDateString(),
      snippet: `Thank you for your order! Your purchase of $${newOrder.total_amount.toFixed(2)} is confirmed and scheduled for delivery to: ${addrStr}.`
    });

    return newOrder;
  }

  getCustomerDataset() {
    const users = this.getUsers();
    const orders = this.getOrders();

    return users.map((u) => {
      const userOrders = orders.filter((o) => o.user_email?.toLowerCase() === u.email.toLowerCase() || o.user_id === u.user_id);
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      return {
        user_id: u.user_id,
        name: u.name,
        email: u.email,
        role: u.role,
        address: u.address || {},
        orders_count: userOrders.length,
        total_spent: totalSpent,
        created_at: u.created_at || new Date().toISOString()
      };
    });
  }
}

const db = new PersistentDatabase();

export async function api(path, options = {}) {
  const token = localStorage.getItem("smartshop_token");
  const userStr = localStorage.getItem("smartshop_user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

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
    console.warn(`API call to ${path} using persistent database.`);
  }

  if (path.includes("/auth/login")) {
    const body = options.body ? JSON.parse(options.body) : {};
    return db.loginUser(body.email || "user@smartshop.ai", body.password || "password123");
  }

  if (path.includes("/auth/register")) {
    const body = options.body ? JSON.parse(options.body) : {};
    return db.registerUser(body);
  }

  if (path.includes("/emails")) {
    return db.getEmails(currentUser ? currentUser.email : "user@smartshop.ai");
  }

  if (path.includes("/orders") && options.method === "POST") {
    const body = options.body ? JSON.parse(options.body) : {};
    return db.createOrder(currentUser ? currentUser.email : "user@smartshop.ai", body);
  }

  if (path.includes("/admin/customers") || path.includes("/admin/users")) {
    return db.getCustomerDataset();
  }

  if (path.includes("/admin/overview")) {
    const dataset = db.getCustomerDataset();
    const orders = db.getOrders();
    return {
      revenue: (orders.reduce((sum, o) => sum + (o.total_amount || 0), 1250)).toFixed(2),
      users: dataset.length,
      orders: orders.length + 15,
      products: MOCK_PRODUCTS.length,
      categorySales: [
        { category: "Audio", value: 4500 },
        { category: "Wearables", value: 3800 },
        { category: "Laptops", value: 5200 },
        { category: "Tablets", value: 2400 }
      ],
      recommendationMetrics: { ctr: 4.8, conversionLift: 18.5, coverage: 94.2, model: "Hybrid Collaborative & Content Filtering" },
      lowStock: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2]]
    };
  }

  if (path.includes("/ai/trending") || path.includes("/ai/recommendations") || path.includes("/products")) {
    return MOCK_PRODUCTS;
  }

  if (path.includes("/categories")) {
    return MOCK_CATEGORIES;
  }

  if (path.includes("/orders")) {
    return db.getOrders();
  }

  return [];
}
