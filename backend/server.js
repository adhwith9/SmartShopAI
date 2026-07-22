const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// In-Memory & MongoDB Atlas Schema Models Integration
const products = [
  {
    product_id: 1,
    name: "AeroPods Max Wireless Headphones",
    category: "Audio",
    brand: "SoundTech",
    price: 199.99,
    original_price: 249.99,
    rating: 4.8,
    reviews_count: 142,
    stock: 25,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    description: "Active noise canceling premium spatial audio headphones with 30-hour battery life.",
    specifications: { "Battery": "30 Hours", "ANC": "Yes", "Warranty": "2 Years" }
  },
  {
    product_id: 2,
    name: "CyberWatch Pro Smartwatch",
    category: "Wearables",
    brand: "CyberGear",
    price: 299.99,
    original_price: 349.99,
    rating: 4.6,
    reviews_count: 98,
    stock: 18,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    description: "Advanced health tracker with ECG, blood oxygen sensor, GPS navigation, and AMOLED display.",
    specifications: { "Display": "1.4 AMOLED", "Water Rating": "5 ATM" }
  },
  {
    product_id: 3,
    name: "NeuraSound Earbuds",
    category: "Audio",
    brand: "SoundTech",
    price: 129.99,
    original_price: 159.99,
    rating: 4.7,
    reviews_count: 76,
    stock: 30,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    description: "True wireless noise-isolating earbuds with adaptive equalizer and wireless charging.",
    specifications: { "Playtime": "8 Hours", "Rating": "IPX7" }
  },
  {
    product_id: 4,
    name: "VisionGlass AR Glasses",
    category: "Wearables",
    brand: "VisionCorp",
    price: 499.99,
    original_price: 599.99,
    rating: 4.5,
    reviews_count: 34,
    stock: 10,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    description: "Next-gen augmented reality smart glasses with Micro-OLED heads-up display.",
    specifications: { "Resolution": "1080p per eye", "Weight": "76g" }
  },
  {
    product_id: 5,
    name: "ProBook X Laptop 16-inch",
    category: "Laptops",
    brand: "ComputeTech",
    price: 1299.99,
    original_price: 1499.99,
    rating: 4.9,
    reviews_count: 210,
    stock: 12,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    description: "High-performance workstation featuring 14-core processor, 32GB RAM, 1TB NVMe SSD.",
    specifications: { "RAM": "32GB DDR5", "Storage": "1TB NVMe" }
  },
  {
    product_id: 6,
    name: "SmartPad Ultra Tablet 11",
    category: "Tablets",
    brand: "ComputeTech",
    price: 599.99,
    original_price: 699.99,
    rating: 4.7,
    reviews_count: 115,
    stock: 22,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    description: "Versatile tablet with stylus pen support, Quad Speakers, and 5G connectivity.",
    specifications: { "Screen": "11-inch 120Hz", "Battery": "10,000 mAh" }
  }
];

const users = [];
const orders = [];
const otpStore = {};

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ service: "SmartShop AI Express Backend", status: "ok", timestamp: new Date() });
});

// Products API
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Send OTP
app.post("/api/auth/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email.toLowerCase()] = otp;
  res.json({ success: true, otp, message: `OTP sent to ${email}` });
});

// Verify OTP & Login
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp, name } = req.body;
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      user_id: users.length + 1,
      name: name || email.split("@")[0],
      email: email,
      role: email.includes("admin") ? "admin" : "customer",
      created_at: new Date().toISOString()
    };
    users.push(user);
  }
  res.json({ token: `express-jwt-${user.user_id}-${Date.now()}`, user });
});

// Create Order
app.post("/api/orders", (req, res) => {
  const orderData = req.body;
  const newOrder = {
    order_id: orders.length + 101,
    items: orderData.items || [],
    total_amount: orderData.total_amount || 199.99,
    address: orderData.address || {},
    payment_method: orderData.payment_method || "Credit Card (Test Mode)",
    status: "Processing & Order Confirmed",
    tracking_number: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
    created_at: new Date().toISOString()
  };
  orders.unshift(newOrder);
  res.json(newOrder);
});

// Admin Customers Dataset
app.get("/api/admin/customers", (req, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`SmartShop AI Express Backend Server running on http://localhost:${PORT}`);
});
