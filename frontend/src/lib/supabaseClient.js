import { createClient } from "@supabase/supabase-js";

// Read Supabase environment variables from Vite env (with project fallback for mobile APK)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qdvrnyallalyjyjbofzh.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdnJueWFsbGFseWp5amJvZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDgzNjksImV4cCI6MjEwMDI4NDM2OX0.vYX9f5k7kkooAdM4_N3RW4ATDIiSRIEUZDX0iozkwzo";

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-supabase-project-id.supabase.co" &&
    supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY"
  );
};

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// -------------------------------------------------------------
// SUPABASE DATASET SERVICES & DATABASE METHODS
// -------------------------------------------------------------

/**
 * Fetch all products from Supabase database
 */
export async function fetchProductsFromSupabase() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or("status.eq.approved,status.is.null")
    .order("product_id", { ascending: true });

  if (error) {
    console.error("Error fetching products from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch products created by a specific Company Owner / Vendor
 */
export async function fetchVendorProductsFromSupabase(vendorEmail) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("vendor_email", vendorEmail)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vendor products from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch products pending Admin Approval
 */
export async function fetchPendingProductsFromSupabase() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending products from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Create a new product submitted by Company Owner (Pending Admin Approval)
 */
export async function createVendorProductInSupabase(productData) {
  if (!isSupabaseConfigured()) return null;
  const payload = {
    product_id: Math.floor(100000 + Math.random() * 900000),
    name: productData.name,
    category: productData.category || "Electronics",
    brand: productData.brand || productData.company_name || "Merchant Brand",
    price: Number(productData.price) || 999,
    original_price: Number(productData.original_price) || Number(productData.price) * 1.2,
    stock: Number(productData.stock) || 10,
    tags: Array.isArray(productData.tags) ? productData.tags : (productData.tags || "").split(",").map(t => t.trim()),
    image: productData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80",
    images: [productData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80"],
    description: productData.description || "",
    specifications: productData.specifications || {},
    vendor_email: productData.vendor_email,
    vendor_name: productData.vendor_name,
    company_name: productData.company_name,
    status: "pending_approval",
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error creating vendor product in Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Approve Vendor Product (Admin Action)
 */
export async function approveVendorProductInSupabase(productId) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("products")
    .update({ status: "approved" })
    .or(`product_id.eq.${productId},id.eq.${productId}`)
    .select()
    .single();

  if (error) {
    console.error("Error approving vendor product in Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Reject Vendor Product (Admin Action)
 */
export async function rejectVendorProductInSupabase(productId) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("products")
    .update({ status: "rejected" })
    .or(`product_id.eq.${productId},id.eq.${productId}`)
    .select()
    .single();

  if (error) {
    console.error("Error rejecting vendor product in Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch product detail by ID from Supabase
 */
export async function fetchProductByIdFromSupabase(productId) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("product_id", productId)
    .single();

  if (error) {
    console.error("Error fetching product by ID from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch product categories from Supabase
 */
export async function fetchCategoriesFromSupabase() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Save / Create new order in Supabase
 */
export async function createOrderInSupabase(orderData) {
  if (!isSupabaseConfigured()) return null;

  const payload = {
    order_id: Math.floor(100000 + Math.random() * 900000),
    user_id: orderData.user_id || 1,
    user_email: orderData.email || orderData.address?.email || "user@smartshop.ai",
    items: orderData.items || [],
    total_amount: orderData.total_amount || 0,
    address: orderData.address || {},
    payment_method: orderData.payment_method || "Credit Card (Test Mode)",
    status: "Processing & Order Confirmed",
    tracking_number: `TRK-SUPA-${Math.floor(10000000 + Math.random() * 90000000)}`,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("orders")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error creating order in Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch orders for a user from Supabase
 */
export async function fetchOrdersFromSupabase(userEmail) {
  if (!isSupabaseConfigured()) return null;
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (userEmail) {
    query = query.eq("user_email", userEmail);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching orders from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Save or Update user profile in Supabase
 */
export async function saveUserProfileInSupabase(profileData) {
  if (!isSupabaseConfigured() || !profileData || !profileData.email) return null;

  const email = profileData.email.toLowerCase().trim();
  const userName = profileData.name || profileData.fullName || email.split("@")[0] || "User";
  const companyName = profileData.companyName || profileData.company_name || null;
  const gstin = profileData.gstin || null;

  let role = profileData.role;
  if (!role) {
    if (companyName || email.includes("vendor") || email.includes("seller")) {
      role = "vendor";
    } else if (email.includes("admin")) {
      role = "admin";
    } else {
      role = "customer";
    }
  }

  let addressObj = typeof profileData.address === "object" ? { ...profileData.address } : {};
  if (companyName) {
    addressObj.company_name = companyName;
    addressObj.gstin = gstin;
    addressObj.is_vendor = true;
  }

  let payload = {
    email: email,
    name: userName,
    phone: profileData.phone || "+91 9876543210",
    role: role,
    address: addressObj,
    updated_at: new Date().toISOString()
  };

  console.log("⚡ Saving user profile to Supabase:", payload);

  let { data, error } = await supabase
    .from("profiles")
    .upsert([payload], { onConflict: "email" })
    .select();

  // Handle legacy Supabase database check constraint gracefully
  if (error && error.message && error.message.includes("profiles_role_check")) {
    console.warn("⚠️ Legacy Supabase check constraint detected. Retrying profile save with seller metadata...");
    payload.role = "customer";
    const retry = await supabase
      .from("profiles")
      .upsert([payload], { onConflict: "email" })
      .select();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error("❌ Error saving profile in Supabase:", error.message || error);
    return null;
  }
  console.log("✅ Profile successfully saved to Supabase:", data);
  return data ? data[0] : null;
}

/**
 * Fetch all user profiles from Supabase
 */
export async function fetchAllProfilesFromSupabase() {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all profiles from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch user profile from Supabase
 */
export async function fetchUserProfileFromSupabase(email) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching profile from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch reviews for product from Supabase
 */
export async function fetchReviewsFromSupabase(productId) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews from Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Add review to Supabase
 */
export async function addReviewInSupabase(reviewData) {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        product_id: reviewData.product_id,
        user_email: reviewData.user_email || "user@smartshop.ai",
        user_name: reviewData.user_name || "SmartShop User",
        rating: reviewData.rating || 5,
        comment: reviewData.comment || ""
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding review in Supabase:", error.message);
    return null;
  }
  return data;
}

/**
 * Fetch full admin overview datasets from Supabase
 */
export async function fetchAdminDataFromSupabase() {
  if (!isSupabaseConfigured()) return null;
  const [productsRes, ordersRes, profilesRes] = await Promise.all([
    supabase.from("products").select("*"),
    supabase.from("orders").select("*"),
    supabase.from("profiles").select("*")
  ]);

  return {
    products: productsRes.data || [],
    orders: ordersRes.data || [],
    customers: profilesRes.data || []
  };
}
