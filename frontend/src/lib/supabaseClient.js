import { createClient } from "@supabase/supabase-js";

// Read Supabase environment variables from Vite env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-supabase-project-id.supabase.co" &&
    supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY"
  );
};

// Initialize Supabase Client (uses dummy values if not set to avoid init crash)
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured() ? supabaseAnonKey : "placeholder-anon-key"
);

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
    .order("product_id", { ascending: true });

  if (error) {
    console.error("Error fetching products from Supabase:", error.message);
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
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from("profiles")
    .upsert([
      {
        email: profileData.email,
        name: profileData.name || profileData.fullName,
        phone: profileData.phone,
        address: profileData.address || profileData,
        role: profileData.role || "customer",
        updated_at: new Date().toISOString()
      }
    ], { onConflict: "email" })
    .select()
    .single();

  if (error) {
    console.error("Error saving profile in Supabase:", error.message);
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
