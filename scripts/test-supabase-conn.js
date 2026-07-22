const { createClient } = require('../frontend/node_modules/@supabase/supabase-js');

const supabaseUrl = "https://qdvrnyallalyjyjbofzh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdnJueWFsbGFseWp5amJvZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDgzNjksImV4cCI6MjEwMDI4NDM2OX0.vYX9f5k7kkooAdM4_N3RW4ATDIiSRIEUZDX0iozkwzo";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("🔍 Checking connection to Supabase database...");
  console.log(`URL: ${supabaseUrl}`);

  try {
    // 1. Check products table
    const { data: products, error: prodErr } = await supabase.from('products').select('product_id, name, price');
    if (prodErr) {
      console.error("❌ Products table error:", prodErr.message);
    } else {
      console.log(`✅ Connected! Products count in Supabase: ${products.length}`);
      console.log("Sample product:", products[0]);
    }

    // 2. Check profiles table
    const { data: profiles, error: profErr } = await supabase.from('profiles').select('email, name, role');
    if (profErr) {
      console.error("❌ Profiles table error:", profErr.message);
    } else {
      console.log(`✅ Profiles count in Supabase: ${profiles.length}`);
      console.log("Existing profiles:", profiles);
    }

    // 3. Test inserting a profile
    const testEmail = `test_${Date.now()}@gmail.com`;
    console.log(`\n🧪 Testing live profile insert for: ${testEmail}...`);
    const { data: inserted, error: insertErr } = await supabase
      .from('profiles')
      .upsert([{ email: testEmail, name: "Live Test User", role: "customer" }])
      .select();

    if (insertErr) {
      console.error("❌ Insert failed:", insertErr.message);
    } else {
      console.log("🎉 SUCCESS! Live insert succeeded into Supabase profiles table:", inserted[0]);
    }

  } catch (err) {
    console.error("❌ Network or Connection error:", err.message);
  }
}

testConnection();
