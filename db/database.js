// Food Never Comes (FNC) — Database Manager
// Built using Node.js 24 Native SQLite (node:sqlite DatabaseSync)

const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'fnc.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize SQLite database connection
const db = new DatabaseSync(DB_PATH);

// Initialize schema
function initSchema() {
  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schemaSql);
  console.log('✅ SQLite Database initialized at:', DB_PATH);
}

initSchema();

/* ==========================================================
   RESTAURANT QUERIES
   ========================================================== */
function getRestaurants() {
  const stmt = db.prepare('SELECT * FROM restaurants ORDER BY rating DESC');
  return stmt.all();
}

function getRestaurantById(id) {
  const stmt = db.prepare('SELECT * FROM restaurants WHERE id = ?');
  return stmt.get(id);
}

/* ==========================================================
   DISH QUERIES (FILTER, SEARCH, SORT, PAGINATE)
   ========================================================== */
function getDishes({ category, restaurantId, isVeg, search, sortBy = 'default', page = 1, limit = 24 } = {}) {
  let query = 'SELECT * FROM dishes WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (restaurantId && restaurantId !== 'all') {
    query += ' AND restaurant_id = ?';
    params.push(restaurantId);
  }

  if (isVeg !== undefined && isVeg !== 'all') {
    query += ' AND is_veg = ?';
    params.push(isVeg === 'veg' || isVeg === 1 ? 1 : 0);
  }

  if (search && search.trim()) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term);
  }

  // Count total matching
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  const countStmt = db.prepare(countQuery);
  const countRes = countStmt.get(...params);
  const total = countRes ? countRes.total : 0;

  // Sorting
  switch (sortBy) {
    case 'cals-desc':
      query += ' ORDER BY calories DESC';
      break;
    case 'rating':
      query += ' ORDER BY rating DESC, rating_count DESC';
      break;
    case 'price-asc':
      query += ' ORDER BY price ASC';
      break;
    case 'price-desc':
      query += ' ORDER BY price DESC';
      break;
    default:
      query += ' ORDER BY is_bestseller DESC, id ASC';
  }

  // Pagination
  const offset = (Math.max(1, page) - 1) * limit;
  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = db.prepare(query);
  const dishes = stmt.all(...params);

  return {
    dishes,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

/* ==========================================================
   ORDERS & ITEMS QUERIES
   ========================================================== */
function createOrder({ userName = 'Ghost Gourmet', caloriesSpared = 0, simulatedCost = 0, donationAmount = 0, deliveryAddress = 'Barakpur, Kolkata', items = [] } = {}) {
  const orderNumber = 'FNC-' + Math.floor(100000 + Math.random() * 900000);
  const insertOrder = db.prepare(`
    INSERT INTO orders (order_number, user_name, total_calories_spared, simulated_cost, donation_amount, delivery_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertOrder.run(orderNumber, userName, caloriesSpared, simulatedCost, donationAmount, deliveryAddress);

  const getOrderStmt = db.prepare('SELECT id FROM orders WHERE order_number = ?');
  const orderRow = getOrderStmt.get(orderNumber);
  const orderId = orderRow.id;

  if (items && items.length > 0) {
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, dish_id, dish_name, quantity, price, calories)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const it of items) {
      insertItem.run(orderId, it.dishId || null, it.name || 'Gourmet Dish', it.quantity || 1, it.price || 0, it.calories || 0);
    }
  }

  return {
    success: true,
    orderId,
    orderNumber,
    userName,
    caloriesSpared,
    simulatedCost,
    donationAmount,
    status: 'Stationary at roadside bench (Chai Detour ☕)'
  };
}

function getOrders(limit = 20) {
  const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ?');
  const orders = stmt.all(limit);

  const itemStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  return orders.map(ord => ({
    ...ord,
    items: itemStmt.all(ord.id)
  }));
}

/* ==========================================================
   DONATIONS & 80G TAX CERTIFICATES
   ========================================================== */
function recordDonation({ donorName = 'Ghost Gourmet', amount = 100, paymentMethod = 'UPI', upiId = '9874958471@superyes', txnRefUtr = '', razorpayPaymentId = '' } = {}) {
  const donationId = 'DON-' + Date.now().toString().slice(-8);
  const studentMeals = Math.max(1, Math.floor(amount / 20));
  const certNumber = 'SMILEYS-80G-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);

  const stmt = db.prepare(`
    INSERT INTO donations (donation_id, donor_name, amount, payment_method, upi_id, txn_ref_utr, razorpay_payment_id, student_meals_funded, cert_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(donationId, donorName, amount, paymentMethod, upiId, txnRefUtr || null, razorpayPaymentId || null, studentMeals, certNumber);

  return {
    success: true,
    donationId,
    donorName,
    amount,
    paymentMethod,
    upiId,
    txnRefUtr,
    razorpayPaymentId,
    studentMealsFunded: studentMeals,
    certNumber,
    dateIssued: new Date().toISOString()
  };
}

function getDonationByCert(certNumber) {
  const stmt = db.prepare('SELECT * FROM donations WHERE cert_number = ? OR donation_id = ? OR txn_ref_utr = ?');
  return stmt.get(certNumber, certNumber, certNumber);
}

/* ==========================================================
   LEADERBOARD (1,000+ VERIFIED PATRONS)
   ========================================================== */
function getLeaderboard({ filter = 'all', search = '', page = 1, limit = 50 } = {}) {
  let query = 'SELECT * FROM leaderboard WHERE 1=1';
  const params = [];

  if (search && search.trim()) {
    query += ' AND (name LIKE ? OR rank = ?)';
    const term = `%${search.trim()}%`;
    const rankNum = Number(search.trim()) || -1;
    params.push(term, rankNum);
  }

  // Count total matching
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  const countStmt = db.prepare(countQuery);
  const countRes = countStmt.get(...params);
  const total = countRes ? countRes.total : 0;

  // Sorting based on filter
  if (filter === 'donors') {
    query += ' ORDER BY donation_pledged DESC, calories_saved DESC';
  } else {
    query += ' ORDER BY calories_saved DESC, rank ASC';
  }

  // Pagination
  const offset = (Math.max(1, page) - 1) * limit;
  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = db.prepare(query);
  const patrons = stmt.all(...params);

  return {
    patrons,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

/* ==========================================================
   NEWSLETTER SUBSCRIBERS
   ========================================================== */
function addSubscriber(email) {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const stmt = db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)');
    stmt.run(cleanEmail);
    return { success: true, message: 'Subscribed to Calorie Denial Club!' };
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return { success: true, message: 'Already subscribed!' };
    }
    throw err;
  }
}

/* ==========================================================
   GLOBAL TELEMETRY & STATS
   ========================================================== */
function getGlobalStats() {
  const orderStats = db.prepare(`
    SELECT 
      COUNT(*) as total_orders, 
      COALESCE(SUM(total_calories_spared), 0) as total_cals,
      COALESCE(SUM(simulated_cost), 0) as total_simulated_cost
    FROM orders
  `).get();

  const donStats = db.prepare(`
    SELECT 
      COUNT(*) as total_donations,
      COALESCE(SUM(amount), 0) as total_donated,
      COALESCE(SUM(student_meals_funded), 0) as total_meals
    FROM donations
  `).get();

  const patronsCount = db.prepare('SELECT COUNT(*) as total FROM leaderboard').get().total;

  return {
    totalOrdersIntercepted: 94320 + (orderStats?.total_orders || 0),
    totalCaloriesAverted: 74200000 + (orderStats?.total_cals || 0),
    totalDonationsAmount: 542000 + (donStats?.total_donated || 0),
    totalStudentMealsFunded: 5420 + (donStats?.total_meals || 0),
    totalPatrons: Math.max(1000, patronsCount),
    riderSharmaJiChaiCups: 4
  };
}

module.exports = {
  db,
  getRestaurants,
  getRestaurantById,
  getDishes,
  createOrder,
  getOrders,
  recordDonation,
  getDonationByCert,
  getLeaderboard,
  addSubscriber,
  getGlobalStats
};

