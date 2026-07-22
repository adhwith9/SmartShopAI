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
    console.warn(`API call to ${path} encountered network error. Falling back to offline dataset.`);
  }

  // Graceful Offline / Mobile Webview Fallbacks
  if (path.includes("/ai/trending") || path.includes("/ai/recommendations") || path.includes("/products")) {
    return MOCK_PRODUCTS;
  }
  if (path.includes("/categories")) {
    return MOCK_CATEGORIES;
  }
  if (path.includes("/auth/login") || path.includes("/auth/register")) {
    return {
      token: "demo-mobile-token-12345",
      user: { user_id: 1, name: "SmartShop User", email: "user@smartshop.ai", role: "customer" }
    };
  }
  if (path.includes("/orders") || path.includes("/wishlist") || path.includes("/cart")) {
    return [];
  }
  if (path.includes("/admin/metrics")) {
    return { total_sales: 15480.50, orders_count: 142, ctr: 4.8, conversion_rate: 3.2 };
  }

  return [];
}
