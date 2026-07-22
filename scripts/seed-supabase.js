/**
 * SmartShop AI - Supabase Automated Dataset Seeder Script
 * 
 * Usage:
 *   SUPABASE_URL="https://xxx.supabase.co" SUPABASE_SERVICE_KEY="your-service-role-key" node scripts/seed-supabase.js
 */

let createClient;
try {
  createClient = require('@supabase/supabase-js').createClient;
} catch (e) {
  try {
    createClient = require('../frontend/node_modules/@supabase/supabase-js').createClient;
  } catch (e2) {
    createClient = null;
  }
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-supabase-project-id")) {
  console.log("==================================================================");
  console.log("⚡ SmartShop AI - Supabase Dataset Seeder");
  console.log("==================================================================");
  console.log("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables.");
  console.log("\nTo seed your Supabase project, execute:");
  console.log('  SUPABASE_URL="https://your-id.supabase.co" SUPABASE_SERVICE_KEY="your-key" node scripts/seed-supabase.js');
  console.log("\nAlternatively, run the SQL DDL and DML scripts in your Supabase SQL Editor:");
  console.log("  1. supabase/schema.sql");
  console.log("  2. supabase/seed.sql\n");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_PRODUCTS = [
  {
    product_id: 1,
    name: "AeroPods Max Wireless Headphones",
    category: "Audio",
    brand: "SoundTech",
    price: 16999.00,
    original_price: 19999.00,
    rating: 4.80,
    reviews_count: 142,
    stock: 25,
    tags: ["audio", "ai", "wireless", "noise-canceling"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Active noise canceling premium spatial audio headphones with 30-hour battery life.",
    specifications: { "Battery Life": "30 Hours", "Noise Control": "ANC", "Connectivity": "Bluetooth 5.3" }
  },
  {
    product_id: 2,
    name: "CyberWatch Pro Smartwatch",
    category: "Wearables",
    brand: "CyberGear",
    price: 24999.00,
    original_price: 29999.00,
    rating: 4.60,
    reviews_count: 98,
    stock: 18,
    tags: ["wearables", "fitness", "smartwatch", "health"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Advanced health tracker with ECG monitor, blood oxygen sensor, and GPS.",
    specifications: { "Display": "1.4 AMOLED", "Water Rating": "5 ATM" }
  },
  {
    product_id: 3,
    name: "NeuraSound Earbuds",
    category: "Audio",
    brand: "SoundTech",
    price: 9999.00,
    original_price: 12999.00,
    rating: 4.70,
    reviews_count: 76,
    stock: 30,
    tags: ["audio", "earbuds", "wireless"],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"],
    description: "True wireless noise-isolating earbuds with adaptive EQ.",
    specifications: { "Playtime": "8 Hours", "Water Resistance": "IPX7" }
  },
  {
    product_id: 4,
    name: "VisionGlass AR Glasses",
    category: "Wearables",
    brand: "VisionCorp",
    price: 42999.00,
    original_price: 49999.00,
    rating: 4.50,
    reviews_count: 34,
    stock: 10,
    tags: ["ar", "wearables", "ai"],
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"],
    description: "Next-gen augmented reality smart glasses with Micro-OLED heads-up display.",
    specifications: { "Display": "Micro-OLED 1080p", "Weight": "76g" }
  },
  {
    product_id: 5,
    name: "ProBook X Laptop 16-inch",
    category: "Laptops",
    brand: "ComputeTech",
    price: 109999.00,
    original_price: 129999.00,
    rating: 4.90,
    reviews_count: 210,
    stock: 12,
    tags: ["laptops", "workstation", "pro"],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"],
    description: "High-performance workstation featuring 14-core processor, 32GB RAM, 1TB NVMe SSD.",
    specifications: { "RAM": "32GB DDR5", "Storage": "1TB SSD" }
  },
  {
    product_id: 6,
    name: "SmartPad Ultra Tablet 11",
    category: "Tablets",
    brand: "ComputeTech",
    price: 49999.00,
    original_price: 59999.00,
    rating: 4.70,
    reviews_count: 115,
    stock: 22,
    tags: ["tablets", "display"],
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80"],
    description: "Versatile tablet with stylus pen support, Quad Speakers, and 5G connectivity.",
    specifications: { "Screen": "11-inch 120Hz", "Battery": "10,000 mAh" }
  }
];

const SEED_CATEGORIES = [
  { name: "Audio", count: 2, icon: "Headphones" },
  { name: "Wearables", count: 2, icon: "Watch" },
  { name: "Laptops", count: 1, icon: "Laptop" },
  { name: "Tablets", count: 1, icon: "Tablet" }
];

async function seedDatabase() {
  console.log("🚀 Seeding Supabase dataset...");
  try {
    const { error: catErr } = await supabase.from("categories").upsert(SEED_CATEGORIES, { onConflict: "name" });
    if (catErr) console.warn("Categories seed warning:", catErr.message);
    else console.log("✅ Categories seeded!");

    const { error: prodErr } = await supabase.from("products").upsert(SEED_PRODUCTS, { onConflict: "product_id" });
    if (prodErr) console.warn("Products seed warning:", prodErr.message);
    else console.log("✅ Products dataset seeded successfully!");

    console.log("🎉 Supabase dataset seeding completed!");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  }
}

seedDatabase();
