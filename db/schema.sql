-- Food Never Comes (FNC) — Database Schema
-- Built for Node.js Native SQLite (node:sqlite DatabaseSync)

PRAGMA foreign_keys = ON;

-- 1. Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  locality TEXT NOT NULL,
  address TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 4.5,
  rating_count TEXT NOT NULL DEFAULT '10K+',
  delivery_time TEXT NOT NULL DEFAULT 'Never (Stalled)',
  cost_for_two INTEGER NOT NULL DEFAULT 400,
  cuisines TEXT NOT NULL,
  image_url TEXT NOT NULL,
  phone TEXT,
  lat REAL,
  lng REAL,
  is_ghost INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Dishes Table
CREATE TABLE IF NOT EXISTS dishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 200,
  calories INTEGER NOT NULL DEFAULT 500,
  is_veg INTEGER NOT NULL DEFAULT 0,
  rating REAL NOT NULL DEFAULT 4.5,
  rating_count INTEGER NOT NULL DEFAULT 100,
  image_url TEXT NOT NULL,
  is_bestseller INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- 3. Orders Table (Phantom Zero-Cost Orders)
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  user_name TEXT NOT NULL,
  total_calories_spared INTEGER NOT NULL DEFAULT 0,
  simulated_cost INTEGER NOT NULL DEFAULT 0,
  donation_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Stationary at roadside bench (Chai Detour)',
  delivery_address TEXT NOT NULL DEFAULT 'Barakpur, Kolkata',
  chai_cups INTEGER NOT NULL DEFAULT 4,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  dish_id INTEGER,
  dish_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL DEFAULT 0,
  calories INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 5. Donations Table (The Smileys Foundation 80G Fund)
CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donation_id TEXT UNIQUE NOT NULL,
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  upi_id TEXT NOT NULL DEFAULT '9874958471@superyes',
  txn_ref_utr TEXT,
  razorpay_payment_id TEXT,
  student_meals_funded INTEGER NOT NULL,
  cert_number TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Leaderboard Table (1,000+ Verified Abstainers)
CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rank INTEGER NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  orders_count INTEGER NOT NULL DEFAULT 0,
  calories_saved INTEGER NOT NULL DEFAULT 0,
  karma_points INTEGER NOT NULL DEFAULT 0,
  donation_pledged INTEGER NOT NULL DEFAULT 0,
  is_verified INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Newsletter Subscribers Table (Calorie Denial Club)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_dishes_restaurant ON dishes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
CREATE INDEX IF NOT EXISTS idx_dishes_veg ON dishes(is_veg);
CREATE INDEX IF NOT EXISTS idx_leaderboard_calories ON leaderboard(calories_saved DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_donations ON leaderboard(donation_pledged DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_donations_id ON donations(donation_id);

