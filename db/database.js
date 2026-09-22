// Food Never Comes (FNC) — Database Manager
// Dual-Engine: Uses Node.js Native SQLite (node:sqlite) when available,
// with automatic fallback to persistent JSON store for older/unflagged Node runtimes.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'fnc.db');
const JSON_STORE_PATH = path.join(DATA_DIR, 'fnc_store.json');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let DatabaseSync;
let useSqlite = false;
let db = null;

try {
  const sqlite = require('node:sqlite');
  if (sqlite && sqlite.DatabaseSync) {
    DatabaseSync = sqlite.DatabaseSync;
    db = new DatabaseSync(DB_PATH);
    useSqlite = true;
    console.log('✅ SQLite Engine active (node:sqlite DatabaseSync)');
  }
} catch (err) {
  console.warn('⚠️ node:sqlite not enabled without flag in this Node runtime, using persistent JSON store fallback:', err.message);
  useSqlite = false;
}

/* ==========================================================
   PERSISTENT JSON STORE FALLBACK
   ========================================================== */
let jsonStore = {
  restaurants: [],
  dishes: [],
  orders: [],
  order_items: [],
  donations: [],
  leaderboard: [],
  newsletter_subscribers: []
};

function loadJsonStore() {
  if (fs.existsSync(JSON_STORE_PATH)) {
    try {
      jsonStore = JSON.parse(fs.readFileSync(JSON_STORE_PATH, 'utf8'));
    } catch (e) {
      console.warn('Could not parse fnc_store.json, creating new store.');
    }
  }
}

function saveJsonStore() {
  try {
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(jsonStore, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving JSON store:', e.message);
  }
}

if (!useSqlite) {
  loadJsonStore();
} else {
  // Initialize SQLite schema
  try {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schemaSql);
    console.log('✅ SQLite Database initialized at:', DB_PATH);
  } catch (e) {
    console.error('Failed to initialize SQLite schema, falling back to JSON store:', e.message);
    useSqlite = false;
    loadJsonStore();
  }
}

/* ==========================================================
   RESTAURANT QUERIES
   ========================================================== */
function getRestaurants() {
  if (useSqlite) {
    return db.prepare('SELECT * FROM restaurants ORDER BY rating DESC').all();
  }
  return [...jsonStore.restaurants].sort((a, b) => b.rating - a.rating);
}

function getRestaurantById(id) {
  if (useSqlite) {
    return db.prepare('SELECT * FROM restaurants WHERE id = ?').get(id);
  }
  return jsonStore.restaurants.find(r => r.id === id);
}

/* ==========================================================
   DISH QUERIES (FILTER, SEARCH, SORT, PAGINATE)
   ========================================================== */
function getDishes({ category, restaurantId, isVeg, search, sortBy = 'default', page = 1, limit = 24 } = {}) {
  if (useSqlite) {
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

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countRes = db.prepare(countQuery).get(...params);
    const total = countRes ? countRes.total : 0;

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

    const offset = (Math.max(1, page) - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const dishes = db.prepare(query).all(...params);

    return {
      dishes,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  }

  // JSON Store Implementation
  let list = [...jsonStore.dishes];

  if (category && category !== 'all') {
    list = list.filter(d => d.category === category);
  }
  if (restaurantId && restaurantId !== 'all') {
    list = list.filter(d => d.restaurant_id === restaurantId);
  }
  if (isVeg !== undefined && isVeg !== 'all') {
    const v = (isVeg === 'veg' || isVeg === 1 || isVeg === true) ? 1 : 0;
    list = list.filter(d => d.is_veg === v);
  }
  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    list = list.filter(d => d.name.toLowerCase().includes(s) || (d.description && d.description.toLowerCase().includes(s)));
  }

  const total = list.length;

  switch (sortBy) {
    case 'cals-desc':
      list.sort((a, b) => b.calories - a.calories);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    default:
      list.sort((a, b) => (b.is_bestseller || 0) - (a.is_bestseller || 0));
  }

  const offset = (Math.max(1, page) - 1) * limit;
  const paged = list.slice(offset, offset + limit);

  return {
    dishes: paged,
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

  if (useSqlite) {
    db.prepare(`
      INSERT INTO orders (order_number, user_name, total_calories_spared, simulated_cost, donation_amount, delivery_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(orderNumber, userName, caloriesSpared, simulatedCost, donationAmount, deliveryAddress);

    const orderRow = db.prepare('SELECT id FROM orders WHERE order_number = ?').get(orderNumber);
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

  // JSON Store
  const orderId = jsonStore.orders.length + 1;
  const newOrder = {
    id: orderId,
    order_number: orderNumber,
    user_name: userName,
    total_calories_spared: caloriesSpared,
    simulated_cost: simulatedCost,
    donation_amount: donationAmount,
    delivery_address: deliveryAddress,
    status: 'Stationary at roadside bench (Chai Detour ☕)',
    chai_cups: 4,
    created_at: new Date().toISOString()
  };

  jsonStore.orders.unshift(newOrder);

  if (items && items.length > 0) {
    for (const it of items) {
      jsonStore.order_items.push({
        id: jsonStore.order_items.length + 1,
        order_id: orderId,
        dish_id: it.dishId || null,
        dish_name: it.name || 'Gourmet Dish',
        quantity: it.quantity || 1,
        price: it.price || 0,
        calories: it.calories || 0
      });
    }
  }

  saveJsonStore();

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
  if (useSqlite) {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ?').all(limit);
    const itemStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    return orders.map(ord => ({
      ...ord,
      items: itemStmt.all(ord.id)
    }));
  }

  return jsonStore.orders.slice(0, limit).map(ord => ({
    ...ord,
    items: jsonStore.order_items.filter(it => it.order_id === ord.id)
  }));
}

/* ==========================================================
   DONATIONS & 80G TAX CERTIFICATES
   ========================================================== */
function recordDonation({ donorName = 'Ghost Gourmet', amount = 100, paymentMethod = 'UPI', upiId = '9874958471@superyes', txnRefUtr = '', razorpayPaymentId = '' } = {}) {
  const donationId = 'DON-' + Date.now().toString().slice(-8);
  const studentMeals = Math.max(1, Math.floor(amount / 20));
  const certNumber = 'SMILEYS-80G-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);

  if (useSqlite) {
    db.prepare(`
      INSERT INTO donations (donation_id, donor_name, amount, payment_method, upi_id, txn_ref_utr, razorpay_payment_id, student_meals_funded, cert_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(donationId, donorName, amount, paymentMethod, upiId, txnRefUtr || null, razorpayPaymentId || null, studentMeals, certNumber);
  } else {
    jsonStore.donations.unshift({
      id: jsonStore.donations.length + 1,
      donation_id: donationId,
      donor_name: donorName,
      amount,
      payment_method: paymentMethod,
      upi_id: upiId,
      txn_ref_utr: txnRefUtr,
      razorpay_payment_id: razorpayPaymentId,
      student_meals_funded: studentMeals,
      cert_number: certNumber,
      created_at: new Date().toISOString()
    });
    saveJsonStore();
  }

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
  if (useSqlite) {
    return db.prepare('SELECT * FROM donations WHERE cert_number = ? OR donation_id = ? OR txn_ref_utr = ?').get(certNumber, certNumber, certNumber);
  }
  return jsonStore.donations.find(d => d.cert_number === certNumber || d.donation_id === certNumber || d.txn_ref_utr === certNumber);
}

/* ==========================================================
   LEADERBOARD (1,000+ VERIFIED PATRONS)
   ========================================================== */
function getLeaderboard({ filter = 'all', search = '', page = 1, limit = 50 } = {}) {
  if (useSqlite) {
    let query = 'SELECT * FROM leaderboard WHERE 1=1';
    const params = [];

    if (search && search.trim()) {
      query += ' AND (name LIKE ? OR rank = ?)';
      const term = `%${search.trim()}%`;
      const rankNum = Number(search.trim()) || -1;
      params.push(term, rankNum);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countRes = db.prepare(countQuery).get(...params);
    const total = countRes ? countRes.total : 0;

    if (filter === 'donors') {
      query += ' ORDER BY donation_pledged DESC, calories_saved DESC';
    } else {
      query += ' ORDER BY calories_saved DESC, rank ASC';
    }

    const offset = (Math.max(1, page) - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const patrons = db.prepare(query).all(...params);

    return {
      patrons,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  }

  // JSON Store
  let list = [...jsonStore.leaderboard];

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(s) || p.rank.toString() === s);
  }

  if (filter === 'donors') {
    list.sort((a, b) => b.donation_pledged - a.donation_pledged);
  } else {
    list.sort((a, b) => b.calories_saved - a.calories_saved);
  }

  const total = list.length;
  const offset = (Math.max(1, page) - 1) * limit;
  const paged = list.slice(offset, offset + limit);

  return {
    patrons: paged,
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
  if (useSqlite) {
    try {
      db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(cleanEmail);
      return { success: true, message: 'Subscribed to Calorie Denial Club!' };
    } catch (err) {
      if (err.message && err.message.includes('UNIQUE')) {
        return { success: true, message: 'Already subscribed!' };
      }
      throw err;
    }
  }

  if (!jsonStore.newsletter_subscribers.some(s => s.email === cleanEmail)) {
    jsonStore.newsletter_subscribers.push({ id: jsonStore.newsletter_subscribers.length + 1, email: cleanEmail, created_at: new Date().toISOString() });
    saveJsonStore();
  }
  return { success: true, message: 'Subscribed to Calorie Denial Club!' };
}

/* ==========================================================
   GLOBAL TELEMETRY & STATS
   ========================================================== */
function getGlobalStats() {
  if (useSqlite) {
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

  const totalOrders = jsonStore.orders.length;
  const totalCals = jsonStore.orders.reduce((acc, o) => acc + (o.total_calories_spared || 0), 0);
  const totalDonated = jsonStore.donations.reduce((acc, d) => acc + (d.amount || 0), 0);
  const totalMeals = jsonStore.donations.reduce((acc, d) => acc + (d.student_meals_funded || 0), 0);

  return {
    totalOrdersIntercepted: 94320 + totalOrders,
    totalCaloriesAverted: 74200000 + totalCals,
    totalDonationsAmount: 542000 + totalDonated,
    totalStudentMealsFunded: 5420 + totalMeals,
    totalPatrons: Math.max(1000, jsonStore.leaderboard.length),
    riderSharmaJiChaiCups: 4
  };
}

module.exports = {
  db,
  useSqlite,
  jsonStore,
  saveJsonStore,
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
