-- SmartShop AI - Supabase Dataset Seed Script
-- Execute this script in your Supabase SQL Editor after running schema.sql.

-- 1. SEED CATEGORIES
INSERT INTO public.categories (name, count, icon) VALUES
('Audio', 2, 'Headphones'),
('Wearables', 2, 'Watch'),
('Laptops', 1, 'Laptop'),
('Tablets', 1, 'Tablet')
ON CONFLICT (name) DO UPDATE SET count = EXCLUDED.count, icon = EXCLUDED.icon;

-- 2. SEED PRODUCTS
INSERT INTO public.products (
    product_id, name, category, brand, price, original_price, rating, reviews_count, stock, tags, image, images, description, specifications
) VALUES
(
    1,
    'AeroPods Max Wireless Headphones',
    'Audio',
    'SoundTech',
    16999.00,
    19999.00,
    4.80,
    142,
    25,
    ARRAY['audio', 'ai', 'wireless', 'noise-canceling'],
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    'Active noise canceling premium spatial audio headphones with 30-hour battery life, custom equalizer tuning, and ultra-comfortable memory foam ear cushions.',
    '{"Battery Life": "30 Hours", "Noise Control": "Active Noise Cancellation (ANC)", "Connectivity": "Bluetooth 5.3", "Weight": "285g", "Warranty": "2 Years Manufacturer Warranty"}'::jsonb
),
(
    2,
    'CyberWatch Pro Smartwatch',
    'Wearables',
    'CyberGear',
    24999.00,
    29999.00,
    4.60,
    98,
    18,
    ARRAY['wearables', 'fitness', 'smartwatch', 'health'],
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    'Advanced health tracker with ECG monitor, real-time blood oxygen sensor, GPS navigation, water resistance to 50m, and crystal-clear AMOLED always-on display.',
    '{"Display": "1.4 inch AMOLED 454x454", "Sensors": "Optical Heart Rate, SpO2, ECG, Accelerometer", "Water Rating": "5 ATM (50m)", "Battery": "7 Days Typical Usage"}'::jsonb
),
(
    3,
    'NeuraSound Earbuds',
    'Audio',
    'SoundTech',
    9999.00,
    12999.00,
    4.70,
    76,
    30,
    ARRAY['audio', 'earbuds', 'wireless'],
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ],
    'True wireless noise-isolating earbuds with adaptive equalizer, IPX7 water resistance, touch controls, and wireless charging case.',
    '{"Playtime": "8 Hours (24 Hours with Case)", "Water Resistance": "IPX7", "Microphones": "Dual Beamforming Mics"}'::jsonb
),
(
    4,
    'VisionGlass AR Glasses',
    'Wearables',
    'VisionCorp',
    42999.00,
    49999.00,
    4.50,
    34,
    10,
    ARRAY['ar', 'wearables', 'ai', 'smart-glasses'],
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
    ],
    'Next-gen augmented reality smart glasses with Micro-OLED heads-up display, real-time voice translation, and AI assistant integration.',
    '{"Display": "Dual Micro-OLED 1080p per eye", "Field of View": "46 Degrees", "Weight": "76g"}'::jsonb
),
(
    5,
    'ProBook X Laptop 16-inch',
    'Laptops',
    'ComputeTech',
    109999.00,
    129999.00,
    4.90,
    210,
    12,
    ARRAY['laptops', 'workstation', 'pro', 'computing'],
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    'High-performance workstation featuring 14-core processor, 32GB DDR5 RAM, 1TB NVMe SSD, and 120Hz Liquid Retina Display.',
    '{"Processor": "14-Core High Performance CPU", "RAM": "32GB DDR5 5600MHz", "Storage": "1TB PCIe Gen4 NVMe SSD", "Display": "16-inch 3072x1920 120Hz Mini-LED"}'::jsonb
),
(
    6,
    'SmartPad Ultra Tablet 11',
    'Tablets',
    'ComputeTech',
    49999.00,
    59999.00,
    4.70,
    115,
    22,
    ARRAY['tablets', 'display', 'stylus'],
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80'
    ],
    'Versatile tablet with stylus pen support, Quad Speakers, 5G connectivity, and all-day 10,000mAh battery life.',
    '{"Screen": "11-inch 120Hz Ultra Retina", "Stylus Support": "Included SmartPen 2.0", "Battery": "10,000 mAh"}'::jsonb
)
ON CONFLICT (product_id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    description = EXCLUDED.description;

-- 3. SEED COUPONS
INSERT INTO public.coupons (code, discount_percent, free_shipping, description) VALUES
('SMARTSHOP20', 20, false, '20% Off AI Launch Special'),
('WELCOME10', 10, false, '10% Off First Order'),
('FREESHIP', 0, true, 'Free Express Delivery')
ON CONFLICT (code) DO NOTHING;

-- 4. SEED DEMO PROFILES
INSERT INTO public.profiles (user_id, name, email, role, phone, address, preferences) VALUES
(1, 'SmartShop Customer', 'user@smartshop.ai', 'customer', '+91 9876543210', '{"fullName": "SmartShop Customer", "street": "742 Evergreen Terrace", "city": "Springfield", "state": "IL", "zip": "62704", "phone": "+91 9876543210"}'::jsonb, ARRAY['Audio', 'Wearables']),
(2, 'System Admin', 'admin@smartshop.ai', 'admin', '+91 9999900000', '{"fullName": "System Administrator", "street": "1 Infinite Loop", "city": "Cupertino", "state": "CA", "zip": "95014", "phone": "+91 9999900000"}'::jsonb, ARRAY['All'])
ON CONFLICT (email) DO NOTHING;

-- 5. SEED INITIAL REVIEWS
INSERT INTO public.reviews (product_id, user_email, user_name, rating, comment) VALUES
(1, 'user@smartshop.ai', 'SmartShop Customer', 5, 'Exceptional noise cancellation and deep bass quality! Definitely worth the price.'),
(2, 'user@smartshop.ai', 'SmartShop Customer', 5, 'The ECG function and battery life are brilliant. Very smooth touch response.')
ON CONFLICT DO NOTHING;
