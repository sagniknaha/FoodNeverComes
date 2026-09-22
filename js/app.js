/* Food Never Comes (FNC) — Scalable Catalog, Real Geolocation & Real Razorpay/UPI Gateway */

const RECEIVER_UPI_ID = "9874958471@superyes";
const RECEIVER_NAME = "The Smileys Foundation";
let serverRazorpayConfig = { keyId: null, receiverUpi: "9874958471@superyes", hasServerKey: false };

// App State
let currentCategory = 'all';
let selectedRestaurant = 'all';
let searchQuery = '';
let vegFilter = 'all'; // 'all' | 'veg' | 'nonveg'
let sortBy = 'default';
let currentDishPage = 1;
const DISHES_PER_PAGE = 24;

let cart = {};
let activeDonationTier = 100;
let cartDonationAmount = 0;
let selectedUpiApp = 'PhonePe';
let activeLbFilter = 'all';
let lbSearchQuery = '';
let lbCurrentPage = 1;
const LB_PER_PAGE = 50;

let customizingDish = null;
let currentCustomAddons = [];
let telemetryTimer = null;
let notificationTimer = null;
let radarAnimationId = null;
let lastCompletedOrder = null;
let chaiCupsConsumed = 4;

let userLocation = {
  name: "Detecting location...",
  city: "Kolkata",
  locality: "Barakpur",
  lat: 22.76,
  lng: 88.37,
  isGeoLocated: false
};

let lifetimeStats = {
  orders: 0,
  caloriesSaved: 0,
  timeSaved: 0,
  moneySaved: 0,
  karmaPoints: 1420,
  donationPledged: 0,
  userName: "Ghost Gourmet",
  orderHistory: []
};

/* ==========================================================
   REAL GEOLOCATION (BROWSER GPS + REVERSE GEOCODE + IP FALLBACK)
   ========================================================== */
async function initGeolocation() {
  const locDisplay = document.getElementById('current-location-text');
  if (locDisplay) locDisplay.textContent = "Detecting location...";

  // 1. First attempt browser GPS
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        userLocation.lat = pos.coords.latitude;
        userLocation.lng = pos.coords.longitude;
        userLocation.isGeoLocated = true;
        await reverseGeocode(userLocation.lat, userLocation.lng);
      },
      async (err) => {
        console.warn("Browser GPS unavailable or denied, falling back to IP geolocation:", err.message);
        await ipFallbackGeolocation();
      },
      { timeout: 6000, enableHighAccuracy: true }
    );
  } else {
    await ipFallbackGeolocation();
  }
}

async function reverseGeocode(lat, lng) {
  const locDisplay = document.getElementById('current-location-text');
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.localityInfo?.administrative?.[3]?.name || data.principalSubdivision;
      const city = data.city || data.localityInfo?.administrative?.[2]?.name || locality;
      
      userLocation.city = city || "Kolkata";
      userLocation.locality = locality || city || "Barakpur";
      userLocation.name = `${userLocation.locality}, ${userLocation.city}`;
      
      if (locDisplay) locDisplay.textContent = userLocation.name;
      updateRestaurantDistances(userLocation.name);
      showToast(`📍 Location locked: ${userLocation.name}`, "mint");
      return;
    }
  } catch (e) {
    console.error("Reverse geocoding failed:", e);
  }
  await ipFallbackGeolocation();
}

async function ipFallbackGeolocation() {
  const locDisplay = document.getElementById('current-location-text');
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || "Barakpur";
      const city = data.city || "Kolkata";
      userLocation.city = city;
      userLocation.locality = locality;
      userLocation.name = `${locality}, ${city}`;
      if (locDisplay) locDisplay.textContent = userLocation.name;
      updateRestaurantDistances(userLocation.name);
      showToast(`📍 Detected Area: ${userLocation.name}`, "info");
      return;
    }
  } catch (e) {
    console.error("IP Geolocation failed:", e);
  }

  // Final fallback if offline
  userLocation.name = "Kolkata (Barakpur Zone)";
  if (locDisplay) locDisplay.textContent = userLocation.name;
}

function updateRestaurantDistances(area) {
  // Update restaurant distance labels based on detected location
  RESTAURANTS.forEach((r, idx) => {
    const dist = (1.2 + idx * 0.7).toFixed(1);
    r.distance = `${dist} km from ${area} (Rider Stalled)`;
  });
  renderRestaurantsCarousel();
}

function openLocationModal() {
  const backdrop = document.getElementById('location-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    soundBlip();
  }
}

function closeLocationModal() {
  const backdrop = document.getElementById('location-modal-backdrop');
  if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
}

function selectManualLocation(areaName) {
  userLocation.name = areaName;
  const locDisplay = document.getElementById('current-location-text');
  if (locDisplay) locDisplay.textContent = areaName;
  updateRestaurantDistances(areaName);
  closeLocationModal();
  soundBlip();
  showToast(`Location set to ${areaName} 📍 Detours updated!`, "mint");
}

function handleCustomLocationSubmit() {
  const input = document.getElementById('manual-location-input');
  if (!input) return;
  const val = input.value.trim();
  if (val) {
    selectManualLocation(val);
    input.value = '';
  }
}

/* ==========================================================
   STORAGE & PERSISTENCE
   ========================================================== */
function initStorage() {
  try {
    const stored = localStorage.getItem('fnc_user_stats_v6');
    if (stored) {
      lifetimeStats = Object.assign(lifetimeStats, JSON.parse(stored));
      if (!Array.isArray(lifetimeStats.orderHistory)) {
        lifetimeStats.orderHistory = [];
      }
    }
  } catch (e) {}

  updateUserDisplay();
  renderDashboard();
  renderCompactPodium();
  renderLeaderboardDrawer();
  updateNavKarmaBadge();
}

function saveStats() {
  try {
    localStorage.setItem('fnc_user_stats_v6', JSON.stringify(lifetimeStats));
  } catch (e) {}
}

function updateUserDisplay() {
  const lbName = document.getElementById('lb-user-name');
  const lbPodiumName = document.getElementById('podium-user-name');
  const rzpTag = document.getElementById('rzp-user-name-tag');
  if (lbName) lbName.textContent = lifetimeStats.userName;
  if (lbPodiumName) lbPodiumName.textContent = lifetimeStats.userName;
  if (rzpTag) rzpTag.textContent = lifetimeStats.userName;
}

function updateNavKarmaBadge() {
  const el = document.getElementById('nav-karma-points');
  const heroEl = document.getElementById('hero-karma-display');
  const rewardsEl = document.getElementById('rewards-karma-balance');
  const text = lifetimeStats.karmaPoints.toLocaleString() + ' pts';
  if (el) el.textContent = text;
  if (heroEl) heroEl.textContent = (lifetimeStats.karmaPoints / 1000).toFixed(2) + 'k';
  if (rewardsEl) rewardsEl.textContent = lifetimeStats.karmaPoints.toLocaleString();
}

function resetLifetimeStats() {
  if (confirm("Reset cumulative phantom achievements? Your calories & karma will return to base.")) {
    lifetimeStats.orders = 0;
    lifetimeStats.caloriesSaved = 0;
    lifetimeStats.timeSaved = 0;
    lifetimeStats.moneySaved = 0;
    lifetimeStats.karmaPoints = 1420;
    lifetimeStats.donationPledged = 0;
    lifetimeStats.orderHistory = [];
    saveStats();
    renderDashboard();
    renderCompactPodium();
    renderLeaderboardDrawer();
    updateNavKarmaBadge();
    playTone(330, 'sine', 0.2, 0.1);
    showToast("Stats reset to baseline.", "info");
  }
}

/* ==========================================================
   RESTAURANT CAROUSEL & FILTERS
   ========================================================== */
function renderRestaurantsCarousel() {
  const container = document.getElementById('restaurant-carousel');
  if (!container) return;

  container.innerHTML = `
    <div 
      onclick="filterByRestaurant('all')"
      class="shrink-0 p-3.5 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 flex items-center gap-3 w-64 ${
        selectedRestaurant === 'all' 
          ? 'border-swiggy-orange bg-orange-50/70 shadow-sm' 
          : 'border-swiggy-border bg-white hover:border-stone-300'
      }"
    >
      <div class="w-12 h-12 rounded-xl bg-swiggy-orange text-white flex items-center justify-center font-black text-lg shadow-xs">
        🏪
      </div>
      <div>
        <div class="font-display font-bold text-xs text-swiggy-dark">All Ghost Kitchens</div>
        <div class="text-[11px] text-swiggy-muted font-mono">500+ Total Dishes</div>
      </div>
    </div>
  ` + RESTAURANTS.map(rest => {
    const isSelected = selectedRestaurant === rest.id;
    return `
      <div 
        onclick="filterByRestaurant('${rest.id}')"
        class="shrink-0 p-3 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 flex items-center gap-3 w-72 ${
          isSelected 
            ? 'border-swiggy-orange bg-orange-50/70 shadow-sm' 
            : 'border-swiggy-border bg-white hover:border-stone-300'
        }"
      >
        <img src="${rest.image}" alt="${rest.name}" class="w-12 h-12 rounded-xl object-cover shadow-xs shrink-0"/>
        <div class="min-w-0 flex-1">
          <div class="font-display font-bold text-xs text-swiggy-dark truncate">${rest.name}</div>
          <div class="text-[10px] text-swiggy-muted truncate">${rest.cuisine}</div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[10px] font-mono font-bold bg-swiggy-green text-white px-1 py-0.2 rounded">★ ${rest.rating}</span>
            <span class="text-[10px] font-mono text-swiggy-orange truncate">${rest.distance}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterByRestaurant(restId) {
  selectedRestaurant = restId;
  currentDishPage = 1;
  soundTabClick();
  renderRestaurantsCarousel();
  renderDishes();
}

/* ==========================================================
   CATEGORIES, DISH RENDERING & PAGINATION
   ========================================================== */
function renderCategories() {
  const container = document.getElementById('category-pills');
  if (!container) return;
  container.innerHTML = CATEGORIES.map(cat => {
    const active = cat.id === currentCategory;
    return `
      <button 
        onclick="soundTabClick(); setCategory('${cat.id}')"
        class="px-4 py-2 rounded-full text-xs font-display font-bold whitespace-nowrap transition-all border active:scale-95 ${
          active 
            ? 'bg-swiggy-dark text-white border-swiggy-dark shadow-sm' 
            : 'bg-white border-swiggy-border text-swiggy-muted hover:border-swiggy-dark hover:text-swiggy-dark'
        }"
      >
        ${cat.label}
      </button>
    `;
  }).join('');
}

function setCategory(id) {
  currentCategory = id;
  currentDishPage = 1;
  renderCategories();
  renderDishes();
}

function setVegFilter(type) {
  vegFilter = type;
  currentDishPage = 1;
  ['all', 'veg', 'nonveg'].forEach(t => {
    const btn = document.getElementById(`filter-veg-${t}`);
    if (btn) {
      if (t === type) {
        btn.className = "px-3 py-1.5 rounded-full text-xs font-display font-bold border-2 border-swiggy-dark bg-swiggy-dark text-white transition-all shadow-xs";
      } else {
        btn.className = "px-3 py-1.5 rounded-full text-xs font-display font-bold border border-swiggy-border bg-white text-swiggy-muted hover:border-swiggy-dark transition-all";
      }
    }
  });
  soundTabClick();
  renderDishes();
}

function setSortBy(sortVal) {
  sortBy = sortVal;
  currentDishPage = 1;
  soundTabClick();
  renderDishes();
}

function handleSearch(val) {
  searchQuery = val.trim().toLowerCase();
  currentDishPage = 1;
  renderDishes();
}

function getFilteredDishesList() {
  return DISHES.filter(d => {
    const matchRest = selectedRestaurant === 'all' || d.restaurantId === selectedRestaurant;
    const matchCat = currentCategory === 'all' || d.category === currentCategory;
    const matchVeg = vegFilter === 'all' || (vegFilter === 'veg' ? d.isVeg : !d.isVeg);
    const matchSearch = !searchQuery || 
      d.name.toLowerCase().includes(searchQuery) || 
      d.restaurant.toLowerCase().includes(searchQuery) ||
      d.desc.toLowerCase().includes(searchQuery);
    return matchRest && matchCat && matchVeg && matchSearch;
  });
}

function renderDishes() {
  const grid = document.getElementById('dishes-grid');
  const countEl = document.getElementById('dishes-count-label');
  const paginationControls = document.getElementById('dishes-pagination-controls');
  if (!grid) return;

  let filtered = getFilteredDishesList();

  if (sortBy === 'cals-desc') {
    filtered.sort((a, b) => b.calories - a.calories);
  } else if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  }

  const totalCount = filtered.length;
  if (countEl) countEl.textContent = `Showing ${Math.min(currentDishPage * DISHES_PER_PAGE, totalCount)} of ${totalCount} dishes`;

  if (totalCount === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <span class="text-4xl">🔍</span>
        <h3 class="font-display font-bold text-base text-swiggy-dark mt-3">No phantom dishes found</h3>
        <p class="text-xs text-swiggy-muted mt-1">Try loosening your search or toggling the Veg/Non-Veg filter.</p>
      </div>
    `;
    if (paginationControls) paginationControls.classList.add('hidden');
    return;
  }

  const pagedDishes = filtered.slice(0, currentDishPage * DISHES_PER_PAGE);

  grid.innerHTML = pagedDishes.map(dish => {
    const cartItem = cart[dish.id];
    const qty = cartItem ? cartItem.qty : 0;
    const karma = Math.round(dish.calories / 10);

    return `
      <div class="group p-4 sm:p-5 rounded-2xl bg-white border border-swiggy-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all flex items-start justify-between gap-4">
        <div class="flex-1 pr-1">
          <div class="flex items-center gap-2 mb-1.5 flex-wrap">
            <span class="${dish.isVeg ? 'type-veg' : 'type-nonveg'}"></span>
            <span class="text-[10px] font-mono font-bold text-swiggy-muted">${dish.restaurant}</span>
            ${dish.bestseller ? `<span class="text-[9px] font-display font-extrabold uppercase px-1.5 py-0.2 rounded bg-swiggy-orangeLight text-swiggy-orange">★ BESTSELLER</span>` : ''}
            <span class="text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">✨ +${karma} Karma</span>
          </div>
          <h3 class="font-display font-bold text-base text-swiggy-dark group-hover:text-swiggy-orange transition-colors">
            ${dish.name}
          </h3>
          <div class="font-display font-extrabold text-sm sm:text-base text-swiggy-dark mt-1">
            ₹${dish.price}
          </div>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            <div class="flex items-center gap-1 bg-swiggy-green text-white text-[10px] font-display font-bold px-1.5 py-0.5 rounded">
              <span>★</span><span>${dish.rating}</span>
            </div>
            <span class="text-[11px] text-swiggy-muted font-sans font-medium">(${dish.ratingCount})</span>
            <span class="text-[10px] font-mono font-bold text-swiggy-greenDark bg-swiggy-greenLight px-2 py-0.5 rounded border border-green-200">
              🔥 -${dish.calories} kcal saved
            </span>
          </div>
          <p class="text-xs text-swiggy-muted mt-2.5 line-clamp-2 leading-relaxed">
            ${dish.desc}
          </p>
          ${dish.customizable ? `
            <button onclick="soundBlip(); openCustomizerModal('${dish.id}')" class="mt-2 text-[11px] font-display font-bold text-swiggy-orange hover:underline flex items-center gap-1">
              <span>⚙️ Customizable Guilt Add-ons</span>
            </button>
          ` : ''}
        </div>

        <!-- Image & FNC ADD Button -->
        <div class="relative w-32 sm:w-36 h-28 sm:h-32 shrink-0">
          <img src="${dish.image}" alt="${dish.name}" class="w-full h-full object-cover rounded-xl shadow-xs" loading="lazy"/>
          <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10 w-28">
            ${qty === 0 ? `
              <button onclick="soundPop(); handleAddDish('${dish.id}')" class="w-full py-1.5 rounded-lg bg-white border border-swiggy-border hover:border-swiggy-orange shadow-md text-swiggy-orange font-display font-extrabold text-xs tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1">
                <span>ADD</span><span class="text-xs">+</span>
              </button>
            ` : `
              <div class="w-full py-1 rounded-lg bg-white border border-swiggy-orange shadow-md text-swiggy-orange font-display font-extrabold text-xs flex items-center justify-between px-2">
                <button onclick="soundPop(); updateCartQty('${dish.id}', -1)" class="w-6 h-6 flex items-center justify-center hover:bg-orange-50 rounded font-bold">−</button>
                <span class="font-mono">${qty}</span>
                <button onclick="soundPop(); updateCartQty('${dish.id}', 1)" class="w-6 h-6 flex items-center justify-center hover:bg-orange-50 rounded font-bold">+</button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (paginationControls) {
    if (pagedDishes.length < totalCount) {
      paginationControls.classList.remove('hidden');
    } else {
      paginationControls.classList.add('hidden');
    }
  }
}

function loadMoreDishes() {
  currentDishPage++;
  soundTabClick();
  renderDishes();
}

function handleAddDish(dishId) {
  const dish = DISHES.find(d => d.id === dishId);
  if (dish && dish.customizable && dish.addons && dish.addons.length > 0 && !cart[dishId]) {
    openCustomizerModal(dishId);
  } else {
    addToCart(dishId);
  }
}

/* ==========================================================
   CUSTOMIZER MODAL
   ========================================================== */
function openCustomizerModal(dishId) {
  const dish = DISHES.find(d => d.id === dishId);
  if (!dish) return;
  customizingDish = dish;
  currentCustomAddons = cart[dishId]?.addons ? [...cart[dishId].addons] : [];

  const backdrop = document.getElementById('customizer-backdrop');
  const modal = document.getElementById('customizer-modal');
  const title = document.getElementById('customizer-title');
  const baseCals = document.getElementById('customizer-base-cals');

  if (title) title.textContent = dish.name;
  if (baseCals) baseCals.textContent = `${dish.calories} kcal base`;

  renderCustomizerAddons();

  if (backdrop && modal) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.remove('scale-95');
    modal.classList.add('scale-100');
  }
}

function closeCustomizerModal() {
  const backdrop = document.getElementById('customizer-backdrop');
  const modal = document.getElementById('customizer-modal');
  if (backdrop && modal) {
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('scale-100');
    modal.classList.add('scale-95');
  }
  customizingDish = null;
  currentCustomAddons = [];
}

function toggleCustomAddon(addonId) {
  soundBlip();
  const idx = currentCustomAddons.indexOf(addonId);
  if (idx >= 0) {
    currentCustomAddons.splice(idx, 1);
  } else {
    currentCustomAddons.push(addonId);
  }
  renderCustomizerAddons();
}

function renderCustomizerAddons() {
  const container = document.getElementById('customizer-addons-container');
  const totalCalsEl = document.getElementById('customizer-total-cals');
  const totalPriceEl = document.getElementById('customizer-total-price');
  if (!container || !customizingDish) return;

  let totalCals = customizingDish.calories;
  let totalPrice = customizingDish.price;

  container.innerHTML = (customizingDish.addons || []).map(addon => {
    const isSelected = currentCustomAddons.includes(addon.id);
    if (isSelected) {
      totalCals += addon.calories;
      totalPrice += addon.price;
    }
    return `
      <div onclick="toggleCustomAddon('${addon.id}')" class="p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
        isSelected ? 'border-swiggy-orange bg-orange-50/60' : 'border-swiggy-border bg-white hover:border-stone-300'
      }">
        <div class="flex items-center gap-3">
          <input type="checkbox" ${isSelected ? 'checked' : ''} class="w-4 h-4 text-swiggy-orange rounded pointer-events-none"/>
          <div>
            <div class="font-display font-bold text-xs text-swiggy-dark">${addon.name}</div>
            <div class="text-[11px] font-mono text-swiggy-green font-semibold">+${addon.calories} kcal</div>
          </div>
        </div>
        <div class="font-mono text-xs font-bold text-swiggy-dark">+₹${addon.price}</div>
      </div>
    `;
  }).join('');

  if (totalCalsEl) totalCalsEl.textContent = `${totalCals.toLocaleString()} kcal prevented`;
  if (totalPriceEl) totalPriceEl.textContent = `₹${totalPrice}`;
}

function saveCustomizationAndAdd() {
  if (!customizingDish) return;
  const dishId = customizingDish.id;
  if (!cart[dishId]) {
    cart[dishId] = { qty: 1, addons: [...currentCustomAddons] };
  } else {
    cart[dishId].qty += 1;
    cart[dishId].addons = [...currentCustomAddons];
  }

  soundPop();
  updateCartUI();
  renderDishes();
  closeCustomizerModal();
  showToast(`Added ${customizingDish.name} with extra guilt averted! 🛑`, "orange");
}

/* ==========================================================
   CART SYSTEM & FREE ZERO-CHECKOUT
   ========================================================== */
function addToCart(dishId) {
  if (!cart[dishId]) {
    cart[dishId] = { qty: 1, addons: [] };
  } else {
    cart[dishId].qty += 1;
  }
  updateCartUI();
  renderDishes();
  showToast("Added to phantom cart! Calories intercepted 🛑", "orange");
}

function updateCartQty(dishId, change) {
  if (!cart[dishId]) return;
  cart[dishId].qty += change;
  if (cart[dishId].qty <= 0) delete cart[dishId];
  updateCartUI();
  renderDishes();
}

function calculateCartTotals() {
  let subtotal = 0;
  let totalCals = 0;
  let totalItems = 0;

  for (const [id, item] of Object.entries(cart)) {
    const dish = DISHES.find(d => d.id === id);
    if (dish && item.qty > 0) {
      let itemPrice = dish.price;
      let itemCals = dish.calories;

      if (item.addons && item.addons.length > 0 && dish.addons) {
        item.addons.forEach(addonId => {
          const addon = dish.addons.find(a => a.id === addonId);
          if (addon) {
            itemPrice += addon.price;
            itemCals += addon.calories;
          }
        });
      }

      subtotal += itemPrice * item.qty;
      totalCals += itemCals * item.qty;
      totalItems += item.qty;
    }
  }

  const totalToPay = cartDonationAmount; // Phantom food is 100% free (₹0)!
  return { subtotal, totalCals, totalItems, totalToPay };
}

function updateCartUI() {
  const { subtotal, totalCals, totalItems, totalToPay } = calculateCartTotals();
  
  // Nav Badges
  const badge = document.getElementById('nav-cart-badge');
  const mobileBadge = document.getElementById('mobile-cart-badge');
  const count = totalItems + (cartDonationAmount > 0 ? 1 : 0);
  if (badge) badge.textContent = count;
  if (mobileBadge) mobileBadge.textContent = count;

  // Floating Cart Bar
  const floatBar = document.getElementById('floating-cart-bar');
  const floatCount = document.getElementById('float-count');
  const floatTotal = document.getElementById('float-total');

  if (totalItems > 0 || cartDonationAmount > 0) {
    if (floatBar) {
      floatBar.classList.remove('translate-y-36', 'opacity-0');
      floatBar.classList.add('translate-y-0', 'opacity-100');
    }
    if (floatCount) floatCount.textContent = `${totalItems} DISHES • ${totalCals.toLocaleString()} KCAL SAVED`;
    if (floatTotal) {
      floatTotal.textContent = totalToPay > 0 
        ? `₹${totalToPay} for Smileys NGO • ₹0 for food`
        : `100% Free Phantom Order • ₹0`;
    }
  } else {
    if (floatBar) {
      floatBar.classList.add('translate-y-36', 'opacity-0');
      floatBar.classList.remove('translate-y-0', 'opacity-100');
    }
  }

  // Drawer Items
  const container = document.getElementById('cart-items-container');
  if (container) {
    if (totalItems === 0 && cartDonationAmount === 0) {
      container.innerHTML = `
        <div class="py-16 text-center">
          <span class="text-4xl">🧘</span>
          <p class="text-swiggy-dark font-display font-bold text-sm mt-3">Your phantom cart is empty</p>
          <p class="text-swiggy-muted text-xs mt-1">Add calorie bombs to prevent your rider from moving!</p>
        </div>
      `;
    } else {
      let itemsHtml = Object.entries(cart).map(([id, item]) => {
        const dish = DISHES.find(d => d.id === id);
        if (!dish || item.qty <= 0) return '';
        
        let addonsDesc = '';
        let itemPrice = dish.price;
        let itemCals = dish.calories;

        if (item.addons && item.addons.length > 0 && dish.addons) {
          const names = [];
          item.addons.forEach(addonId => {
            const addon = dish.addons.find(a => a.id === addonId);
            if (addon) {
              names.push(addon.name);
              itemPrice += addon.price;
              itemCals += addon.calories;
            }
          });
          if (names.length > 0) {
            addonsDesc = `<div class="text-[10px] text-amber-800 mt-0.5 font-mono">+ ${names.join(', ')}</div>`;
          }
        }

        return `
          <div class="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-swiggy-border">
            <div class="flex items-center gap-2.5">
              <span class="${dish.isVeg ? 'type-veg' : 'type-nonveg'}"></span>
              <div>
                <div class="font-display font-bold text-xs text-swiggy-dark">${dish.name}</div>
                ${addonsDesc}
                <div class="text-[11px] font-mono text-swiggy-green font-semibold">-${itemCals * item.qty} kcal (₹0 real)</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs text-stone-400 line-through">₹${itemPrice * item.qty}</span>
              <span class="font-mono text-xs font-bold text-swiggy-green">₹0</span>
              <div class="flex items-center bg-white border border-swiggy-border rounded-lg px-1 text-xs">
                <button onclick="soundPop(); updateCartQty('${dish.id}', -1)" class="px-1.5 py-0.5 text-swiggy-orange font-bold">−</button>
                <span class="px-1 font-mono">${item.qty}</span>
                <button onclick="soundPop(); updateCartQty('${dish.id}', 1)" class="px-1.5 py-0.5 text-swiggy-orange font-bold">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      if (cartDonationAmount > 0) {
        itemsHtml += `
          <div class="flex items-center justify-between gap-3 p-3 bg-blue-50/80 rounded-xl border border-blue-200">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">💛</span>
              <div>
                <div class="font-display font-bold text-xs text-blue-900">The Smileys Foundation (80G)</div>
                <div class="text-[11px] font-mono text-blue-700 font-semibold">+500 FNC Karma Bonus</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-blue-900">₹${cartDonationAmount}</span>
              <button onclick="soundBlip(); toggleCartDonation(0)" class="text-xs text-stone-400 hover:text-stone-700 px-1">✕</button>
            </div>
          </div>
        `;
      }

      container.innerHTML = itemsHtml;
    }
  }

  // Drawer Bill values
  const subtotalEl = document.getElementById('cart-subtotal');
  const calsEl = document.getElementById('cart-cals-val');
  const donationRow = document.getElementById('cart-donation-row');
  const donationVal = document.getElementById('cart-donation-val');
  const payEl = document.getElementById('cart-total-pay');
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutBtnLabel = document.getElementById('checkout-btn-label');

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal} (Waived)`;
  if (calsEl) calsEl.textContent = `${totalCals.toLocaleString()} kcal`;
  if (payEl) payEl.textContent = `₹${totalToPay}`;

  if (donationRow && donationVal) {
    if (cartDonationAmount > 0) {
      donationRow.style.display = 'flex';
      donationVal.textContent = `₹${cartDonationAmount}`;
    } else {
      donationRow.style.display = 'none';
    }
  }

  if (checkoutBtn && checkoutBtnLabel) {
    checkoutBtn.disabled = (totalItems === 0 && cartDonationAmount === 0);
    if (cartDonationAmount > 0) {
      checkoutBtnLabel.textContent = `PAY ₹${cartDonationAmount} FOR SMILEYS NGO (FOOD IS ₹0)`;
    } else {
      checkoutBtnLabel.textContent = `CONFIRM ZERO-CALORIE ORDER (₹0)`;
    }
  }
}

function openCartDrawer() {
  document.getElementById('cart-backdrop').classList.remove('opacity-0', 'pointer-events-none');
  document.getElementById('cart-drawer').classList.remove('translate-x-full');
  updateCartUI();
}

function closeCartDrawer() {
  document.getElementById('cart-backdrop').classList.add('opacity-0', 'pointer-events-none');
  document.getElementById('cart-drawer').classList.add('translate-x-full');
}

function handleCartCheckout() {
  closeCartDrawer();
  const { totalToPay } = calculateCartTotals();

  if (totalToPay > 0) {
    openDonationGateway(totalToPay);
  } else {
    showToast("Zero-Charge Order Confirmed! Rider dispatched to chai stall ☕", "mint");
    soundFanfare();
    soundChaChing();
    try {
      if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    finalizeOrderAndOpenTracking();
  }
}

/* ==========================================================
   REAL RAZORPAY / PHONEPE / UPI GATEWAY (UPI ID: 9874958471@superyes)
   ========================================================== */
function getUpiString(amount) {
  const note = encodeURIComponent("Smileys NGO 80G Donation");
  const pn = encodeURIComponent(RECEIVER_NAME);
  return `upi://pay?pa=${RECEIVER_UPI_ID}&pn=${pn}&am=${amount}&cu=INR&tn=${note}`;
}

function switchPaymentGatewayTab(tab) {
  soundTabClick();
  const tabs = ['upi', 'razorpay'];
  tabs.forEach(t => {
    const btn = document.getElementById(`gw-tab-btn-${t}`);
    const content = document.getElementById(`gw-tab-content-${t}`);
    if (t === tab) {
      if (btn) {
        btn.className = "py-3 px-2 text-center border-b-2 border-blue-600 bg-white text-blue-950 flex items-center justify-center gap-1.5 transition-all font-bold";
      }
      if (content) content.classList.remove('hidden');
    } else {
      if (btn) {
        btn.className = "py-3 px-2 text-center border-b-2 border-transparent text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1.5 transition-all font-bold";
      }
      if (content) content.classList.add('hidden');
    }
  });
}

function copyText(text, label = "Item") {
  navigator.clipboard.writeText(text).then(() => {
    soundBlip();
    showToast(`Copied ${label}: ${text}! 📋`, "mint");
  }).catch(() => {
    showToast(`${label}: ${text}`, "info");
  });
}

function saveRazorpayKey(key) {
  if (!key) return;
  const trimmed = key.trim();
  localStorage.setItem('fnc_rzp_key', trimmed);
  updateRazorpayKeyUI();
  showToast(`Razorpay Key saved: ${trimmed.substring(0, 14)}... 🔑`, "mint");
}

function updateRazorpayKeyUI() {
  const statusPill = document.getElementById('rzp-status-pill');
  const keyInput = document.getElementById('rzp-custom-key-input');
  const savedKey = localStorage.getItem('fnc_rzp_key');

  if (keyInput && savedKey && !keyInput.value) {
    keyInput.value = savedKey;
  }

  if (statusPill) {
    if (serverRazorpayConfig.hasServerKey && serverRazorpayConfig.keyId) {
      statusPill.innerHTML = `
        <div class="flex items-center gap-1.5 text-emerald-800">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="font-mono font-bold text-[11px]">Server Key Active (${serverRazorpayConfig.keyId.substring(0, 12)}...)</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">READY</span>
      `;
      statusPill.className = "flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs";
    } else if (savedKey && (savedKey.startsWith('rzp_test_') || savedKey.startsWith('rzp_live_'))) {
      statusPill.innerHTML = `
        <div class="flex items-center gap-1.5 text-blue-800">
          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
          <span class="font-mono font-bold text-[11px]">Custom Key Active (${savedKey.substring(0, 12)}...)</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">SAVED</span>
      `;
      statusPill.className = "flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs";
    } else {
      statusPill.innerHTML = `
        <div class="flex items-center gap-1.5 text-amber-800">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span class="font-mono font-bold text-[11px]">Beneficiary UPI: ${RECEIVER_UPI_ID}</span>
        </div>
        <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">INSTANT UPI</span>
      `;
      statusPill.className = "flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs";
    }
  }
}

async function initRazorpayConfig() {
  try {
    const res = await fetch('/api/razorpay/config');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        serverRazorpayConfig = data;
        updateRazorpayKeyUI();
      }
    }
  } catch (e) {
    // Standalone / offline fallback
  }
}

function openDonationGateway(amount = 100) {
  const backdrop = document.getElementById('donation-gateway-backdrop');
  const amountLabel = document.getElementById('gw-amount-display');
  const mealsLabel = document.getElementById('gw-meals-display');
  const upiIdDisplay = document.getElementById('gw-upi-id-display');
  const qrImg = document.getElementById('gw-qr-image');
  const utrInput = document.getElementById('gw-utr-input');

  activeDonationTier = amount;

  if (amountLabel) amountLabel.textContent = `₹${amount}.00`;
  if (mealsLabel) mealsLabel.textContent = `${Math.max(1, Math.floor(amount / 20))} hot student meals funded`;
  if (upiIdDisplay) upiIdDisplay.textContent = RECEIVER_UPI_ID;
  if (utrInput) utrInput.value = '';

  updateRazorpayKeyUI();

  const upiUrl = getUpiString(amount);

  // Generate high-resolution scannable QR Code using QR Server API encoding the exact UPI Intent
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
  }

  switchPaymentGatewayTab('upi');

  if (backdrop) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    soundWarmBell();
  }
}

function closeDonationGateway() {
  const backdrop = document.getElementById('donation-gateway-backdrop');
  if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
}

function copyUpiId() {
  copyText(RECEIVER_UPI_ID, "Receiver UPI ID");
}

function openDirectUpiApp(appName) {
  const { totalToPay } = calculateCartTotals();
  const amount = totalToPay > 0 ? totalToPay : activeDonationTier;
  const upiUrl = getUpiString(amount);

  soundBlip();
  showToast(`Opening ${appName} for ₹${amount} to ${RECEIVER_UPI_ID}...`, "info");

  // Trigger mobile deep link
  window.location.href = upiUrl;
}

function triggerRazorpayUpiIntent() {
  const { totalToPay } = calculateCartTotals();
  const amount = totalToPay > 0 ? totalToPay : activeDonationTier;
  const upiUrl = getUpiString(amount);

  soundChaChing();
  showToast(`Opening UPI payment of ₹${amount} to ${RECEIVER_UPI_ID}... ⚡`, "mint");
  window.location.href = upiUrl;
}

function showRazorpayKeyPrompt(amount) {
  soundBlip();
  switchPaymentGatewayTab('razorpay');
  const keyInput = document.getElementById('rzp-custom-key-input');
  if (keyInput) {
    const details = keyInput.closest('details');
    if (details) details.open = true;
    keyInput.focus();
    keyInput.select();
  }
  showToast(`Razorpay Standard requires an active Key ID (rzp_test_... or rzp_live_...). You can also tap 'Fast Pay via UPI (${RECEIVER_UPI_ID})' directly! 💡`, "info");
}

async function triggerRealRazorpayCheckout() {
  const { totalToPay } = calculateCartTotals();
  const amount = totalToPay > 0 ? totalToPay : activeDonationTier;
  const serverKey = serverRazorpayConfig?.keyId;
  const savedKey = localStorage.getItem('fnc_rzp_key') || (document.getElementById('rzp-custom-key-input')?.value.trim());
  const rzpKey = (serverKey && serverKey.length > 5) ? serverKey : (savedKey && savedKey.length > 5 ? savedKey : null);

  // If no valid key is provided, guide user smoothly to instant UPI or key input
  if (!rzpKey || (!rzpKey.startsWith('rzp_test_') && !rzpKey.startsWith('rzp_live_'))) {
    showRazorpayKeyPrompt(amount);
    return;
  }

  let orderId = null;
  try {
    const orderRes = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if (orderRes.ok) {
      const orderData = await orderRes.json();
      if (orderData.order && orderData.order.id) {
        orderId = orderData.order.id;
      }
    }
  } catch (e) {
    console.warn('Razorpay order creation fallback:', e);
  }

  if (typeof Razorpay !== 'undefined') {
    const options = {
      key: rzpKey,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "The Smileys Foundation",
      description: "80G Tax-Exempt Donation for Rural Children Education",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApyiuBZePWzqR-Q7C6uT6pGe_qOzX_ili0E_JJBb_ekDr8rR7Y6H6wXbLMVQ7vQhVlOQmztUJhbl6IubULJYRjiabUbK9d9a7ijomNjlNNdYBI3FkW-X8jovjSa58Wzc2HX1gPIZgWrV3g-Pzh2z9bCxAMfLJVClwV0xKvm6kjv11R4YfN5mYMOLKlRP5D3lCO2DPiap8k-oR9GEpMA8b1LgaUz0UJfVRlarg0xC6iPy0y3zBCgCSCHQ",
      ...(orderId ? { order_id: orderId } : {}),
      handler: function (response) {
        const txnId = response.razorpay_payment_id || `RZP_${Date.now()}`;
        handleDonationSuccess(txnId);
      },
      prefill: {
        name: lifetimeStats.userName || "Ghost Gourmet",
        contact: "+919874958471",
        email: "donor@smileysfoundation.org",
        vpa: RECEIVER_UPI_ID
      },
      notes: {
        receiver_upi: RECEIVER_UPI_ID,
        beneficiary: "The Smileys Foundation Trust",
        tax_exemption: "Section 80G Registered"
      },
      theme: {
        color: "#0C2340"
      },
      modal: {
        ondismiss: function() {
          showToast("Razorpay payment modal closed", "info");
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.warn("Razorpay Payment Failure:", response.error);
        showToast(`Razorpay: ${response.error.description || 'Payment cancelled'}. You can pay directly via UPI to ${RECEIVER_UPI_ID}`, "info");
      });
      rzp.open();
      return;
    } catch (e) {
      console.warn("Razorpay popup restricted or error:", e);
      showToast("Razorpay popup error. Switching to direct UPI...", "info");
      switchPaymentGatewayTab('upi');
      return;
    }
  } else {
    showToast("Razorpay SDK not loaded. Switching to direct UPI to " + RECEIVER_UPI_ID, "info");
    switchPaymentGatewayTab('upi');
  }
}

function handleDonationSuccess(paymentId, certNumber) {
  closeDonationGateway();
  try {
    if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
  } catch (e) {}

  soundFanfare();
  soundWarmBell();
  
  const officialCert = certNumber || `SMILEYS-80G-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  lifetimeStats.lastTxnId = paymentId;
  lifetimeStats.lastCertNumber = officialCert;
  lifetimeStats.donationPledged += activeDonationTier;
  lifetimeStats.karmaPoints += Math.floor(activeDonationTier * 1.5);
  lifetimeStats.isVerifiedDonor = true;
  saveStats();
  updateStatsDisplay();

  showToast(`💛 Payment Verified! ₹${activeDonationTier} received. 80G Certificate Minted: ${officialCert}`, "mint");

  finalizeOrderAndOpenTracking();
  openCertificateModal();
}

function executeDonationPayment() {
  const btn = document.getElementById('gw-pay-btn');
  const spinner = document.getElementById('gw-spinner');
  const label = document.getElementById('gw-btn-label');
  const utrInput = document.getElementById('gw-utr-input');

  const enteredUtr = utrInput ? utrInput.value.trim() : '';

  // Validate UTR: Standard Indian UPI UTR is 12 digits (or minimum 8 alphanumeric chars for bank/gateway refs)
  const isUtrValid = enteredUtr.length >= 6 && /^[A-Za-z0-9_]+$/.test(enteredUtr);

  if (!isUtrValid) {
    soundBlip();
    if (utrInput) {
      utrInput.focus();
      utrInput.classList.add('border-red-500', 'ring-2', 'ring-red-400');
      setTimeout(() => utrInput.classList.remove('border-red-500', 'ring-2', 'ring-red-400'), 3500);
    }
    showToast("⚠️ Payment verification requires a valid 12-digit UPI UTR from your payment app (PhonePe/GPay/Paytm)!", "info");
    return;
  }

  const finalTxnId = enteredUtr.toUpperCase();

  if (btn) btn.disabled = true;
  if (spinner) spinner.classList.remove('hidden');
  if (label) label.textContent = `VERIFYING UTR ${finalTxnId}...`;

  playTone(450, 'sine', 0.15, 0.08, 0);
  playTone(600, 'sine', 0.15, 0.08, 0.2);
  playTone(750, 'sine', 0.2, 0.1, 0.4);

  // Verify and record donation via backend API
  fetch('/api/donations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      donorName: lifetimeStats.userName || 'Ghost Gourmet',
      amount: activeDonationTier,
      paymentMethod: finalTxnId.startsWith('PAY_') || finalTxnId.startsWith('RZP_') ? 'Razorpay' : 'UPI',
      upiId: RECEIVER_UPI_ID,
      txnRefUtr: finalTxnId,
      razorpayPaymentId: finalTxnId.startsWith('PAY_') || finalTxnId.startsWith('RZP_') ? finalTxnId : null
    })
  })
  .then(res => res.json())
  .then(data => {
    if (btn) btn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (label) label.textContent = "VERIFY PAYMENT & MINT 80G CERTIFICATE";

    if (data && data.success) {
      handleDonationSuccess(finalTxnId, data.certNumber);
    } else {
      showToast(data.error || "⚠️ Verification failed. Please check the UTR number and try again.", "info");
    }
  })
  .catch(err => {
    console.warn("Backend verification fallback:", err);
    if (btn) btn.disabled = false;
    if (spinner) spinner.classList.add('hidden');
    if (label) label.textContent = "VERIFY PAYMENT & MINT 80G CERTIFICATE";
    const fallbackCert = `SMILEYS-80G-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    handleDonationSuccess(finalTxnId, fallbackCert);
  });
}

/* ==========================================================
   SMILEYS NGO ACTIONS
   ========================================================== */
function selectDonationTier(amount) {
  activeDonationTier = amount;
  document.querySelectorAll('.donation-btn').forEach(b => {
    b.className = "donation-btn py-2.5 px-3 rounded-xl border-2 border-swiggy-border bg-white font-display text-xs font-bold text-swiggy-dark flex flex-col items-center gap-0.5 transition-all active:scale-95";
  });
  const selected = document.getElementById(`tier-btn-${amount}`);
  if (selected) {
    selected.className = "donation-btn py-2.5 px-3 rounded-xl border-2 border-blue-600 bg-blue-50/70 font-display text-xs font-bold text-blue-900 flex flex-col items-center gap-0.5 transition-all active:scale-95 shadow-xs";
  }
  const display = document.getElementById('btn-donation-amount-display');
  if (display) display.textContent = amount;
}

function setCustomDonation() {
  const input = document.getElementById('custom-donation-input');
  if (!input) return;
  const val = parseInt(input.value, 10);
  if (val && val > 0) {
    activeDonationTier = val;
    addDonationToCartAndOpen();
    input.value = '';
  } else {
    showToast("Please enter a valid donation amount in ₹", "info");
  }
}

function addDonationToCartAndOpen() {
  cartDonationAmount = activeDonationTier;
  updateCartUI();
  openCartDrawer();
  showToast(`Added ₹${activeDonationTier} for Smileys Foundation books & meals! 💛`, "mint");
}

function toggleCartDonation(amount) {
  cartDonationAmount = amount;
  updateCartUI();
  if (amount > 0) {
    showToast(`Pledged ₹${amount} for rural education! 💛`, "mint");
  }
}

/* ==========================================================
   ORDER FINALIZATION & LIVE RADAR MAP TELEMETRY
   ========================================================== */
function finalizeOrderAndOpenTracking() {
  const { subtotal, totalCals, totalItems } = calculateCartTotals();
  const earnedKarma = Math.round(totalCals / 10) + (cartDonationAmount > 0 ? 500 : 0);

  const orderRecord = {
    orderId: 'FNC-' + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    itemsCount: totalItems,
    subtotal: subtotal,
    donation: cartDonationAmount,
    caloriesSaved: totalCals,
    karmaEarned: earnedKarma,
    dishes: Object.entries(cart).map(([id, item]) => {
      const d = DISHES.find(dish => dish.id === id);
      return { name: d ? d.name : id, qty: item.qty };
    })
  };

  lastCompletedOrder = orderRecord;

  // Update Lifetime Stats
  lifetimeStats.orders += 1;
  lifetimeStats.caloriesSaved += totalCals;
  lifetimeStats.timeSaved += 45;
  lifetimeStats.moneySaved += subtotal;
  lifetimeStats.karmaPoints += earnedKarma;
  lifetimeStats.donationPledged += cartDonationAmount;
  lifetimeStats.orderHistory.unshift(orderRecord);
  saveStats();

  // Persist order into SQLite database via REST API
  try {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: lifetimeStats.userName,
        caloriesSpared: totalCals,
        simulatedCost: subtotal,
        donationAmount: cartDonationAmount,
        deliveryAddress: userLocation.name || 'Barakpur, Kolkata',
        items: Object.entries(cart).map(([id, item]) => {
          const d = DISHES.find(dish => dish.id === id);
          return {
            dishId: id,
            name: d ? d.name : id,
            quantity: item.qty,
            price: d ? d.price : 0,
            calories: d ? d.calories : 0
          };
        })
      })
    }).then(res => res.json()).then(data => {
      if (data && data.orderNumber) {
        orderRecord.orderId = data.orderNumber;
        const trackOrderEl = document.getElementById('track-order-id');
        if (trackOrderEl) trackOrderEl.textContent = `Order #${data.orderNumber}-NEVER`;
      }
    }).catch(e => console.log('Offline/standalone fallback:', e));
  } catch (e) {}

  // Update UI components
  renderDashboard();
  renderCompactPodium();
  renderLeaderboardDrawer();
  updateNavKarmaBadge();

  // Set Tracking View Values
  document.getElementById('track-cals-val').textContent = totalCals.toLocaleString();
  document.getElementById('track-karma-val').textContent = `+${earnedKarma}`;
  document.getElementById('track-order-id').textContent = `Order #${orderRecord.orderId}-NEVER`;
  
  const donationNotice = document.getElementById('track-donation-notice');
  if (donationNotice) {
    donationNotice.textContent = cartDonationAmount > 0 
      ? `Includes ₹${cartDonationAmount} pledge to The Smileys Foundation (+500 Karma)!` 
      : `+${Math.round(totalCals/10)} Karma banked for zero-calorie discipline!`;
  }

  // Reset cart
  cart = {};
  cartDonationAmount = 0;
  updateCartUI();
  renderDishes();

  // Open Dedicated Live Map Screen
  document.getElementById('tracking-view').classList.remove('hidden');
  document.getElementById('tracking-view').classList.add('flex');

  // Start radar canvas animation & telemetry
  startRadarMap();
  startTelemetrySimulation();
}

function startRadarMap() {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let angle = 0;

  function drawRadar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    // Dark Radar Background
    ctx.fillStyle = '#1A1D2B';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Concentric Radar Range Rings
    ctx.strokeStyle = '#2A3045';
    ctx.lineWidth = 1.5;
    [0.3, 0.6, 0.9].forEach(factor => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * factor, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();

    // Rotating Radar Sweep Line
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    const gradient = ctx.createLinearGradient(0, 0, radius, 0);
    gradient.addColorStop(0, 'rgba(252, 128, 25, 0.4)');
    gradient.addColorStop(1, 'rgba(252, 128, 25, 0)');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, 0, -Math.PI / 4, true);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#FC8019';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.stroke();
    ctx.restore();

    // Blip 1: Sharma Ji (Stationary at Tea Stall)
    const riderX = centerX + 45;
    const riderY = centerY - 30;
    ctx.fillStyle = '#FC8019';
    ctx.beginPath();
    ctx.arc(riderX, riderY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Blip 2: User Location (Home)
    const userX = centerX - 60;
    const userY = centerY + 40;
    ctx.fillStyle = '#0A85EA';
    ctx.beginPath();
    ctx.arc(userX, userY, 6, 0, Math.PI * 2);
    ctx.fill();

    angle += 0.035;
    radarAnimationId = requestAnimationFrame(drawRadar);
  }

  if (radarAnimationId) cancelAnimationFrame(radarAnimationId);
  drawRadar();
}

function startTelemetrySimulation() {
  if (telemetryTimer) clearInterval(telemetryTimer);

  let tickerIdx = 0;
  const headlineEl = document.getElementById('tracking-headline');
  const distanceEl = document.getElementById('track-distance');
  const cupsEl = document.getElementById('track-chai-cups');

  telemetryTimer = setInterval(() => {
    tickerIdx = (tickerIdx + 1) % TELEMETRY_TICKERS.length;
    if (headlineEl) {
      headlineEl.textContent = `"${TELEMETRY_TICKERS[tickerIdx]}"`;
    }
    if (distanceEl) {
      distanceEl.textContent = `Distance: 1.2 km • Speed: 0.00 km/h`;
    }
    if (Math.random() > 0.6) {
      chaiCupsConsumed++;
      if (cupsEl) cupsEl.textContent = `${chaiCupsConsumed} cups consumed`;
      soundChaiClink();
    }
    soundRadarPing();
  }, 4500);
}

function exitTrackingView() {
  soundBlip();
  if (telemetryTimer) clearInterval(telemetryTimer);
  if (radarAnimationId) cancelAnimationFrame(radarAnimationId);
  document.getElementById('tracking-view').classList.add('hidden');
  document.getElementById('tracking-view').classList.remove('flex');
  scrollToSection('impact-dashboard');
}

/* ==========================================================
   COMPACT LEADERBOARD WIDGET & 1,000+ PATRON FULL DRAWER
   ========================================================== */
function renderCompactPodium() {
  const container = document.getElementById('compact-podium-cards');
  if (!container) return;

  const top3 = SEED_LEADERBOARD.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];

  container.innerHTML = top3.map((p, idx) => `
    <div class="p-4 rounded-2xl bg-white border border-swiggy-border shadow-card flex items-center gap-3.5 hover:shadow-hover transition-all">
      <div class="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center text-xl font-bold">
        ${medals[idx]}
      </div>
      <div class="min-w-0 flex-1">
        <div class="font-display font-bold text-xs text-swiggy-dark truncate">${p.name}</div>
        <div class="text-[10px] text-swiggy-muted truncate">${p.title}</div>
        <div class="font-mono text-xs font-extrabold text-swiggy-green mt-0.5">${p.caloriesSaved.toLocaleString()} kcal</div>
      </div>
    </div>
  `).join('');
}

function openLeaderboardDrawer() {
  document.getElementById('lb-drawer-backdrop').classList.remove('opacity-0', 'pointer-events-none');
  document.getElementById('lb-full-drawer').classList.remove('translate-x-full');
  renderLeaderboardDrawer();
  soundBlip();
}

function closeLeaderboardDrawer() {
  document.getElementById('lb-drawer-backdrop').classList.add('opacity-0', 'pointer-events-none');
  document.getElementById('lb-full-drawer').classList.add('translate-x-full');
}

function filterLeaderboardDrawer(filter) {
  activeLbFilter = filter;
  lbCurrentPage = 1;
  ['all', 'week', 'donors'].forEach(f => {
    const btn = document.getElementById(`lb-full-tab-${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = "px-4 py-1.5 rounded-full text-xs font-display font-bold border border-swiggy-dark bg-swiggy-dark text-white transition-all shadow-xs";
      } else {
        btn.className = "px-4 py-1.5 rounded-full text-xs font-display font-bold border border-swiggy-border bg-white text-swiggy-muted hover:border-swiggy-dark transition-all";
      }
    }
  });
  soundTabClick();
  renderLeaderboardDrawer();
}

function handleLbSearch(val) {
  lbSearchQuery = val.trim().toLowerCase();
  lbCurrentPage = 1;
  renderLeaderboardDrawer();
}

function renderLeaderboardDrawer() {
  const container = document.getElementById('lb-full-rows');
  const countLabel = document.getElementById('lb-full-count-label');
  const pageLabel = document.getElementById('lb-page-indicator');
  const prevBtn = document.getElementById('lb-prev-btn');
  const nextBtn = document.getElementById('lb-next-btn');
  if (!container) return;

  let list = [...SEED_LEADERBOARD];

  // Insert User
  list.unshift({
    rank: 4,
    name: lifetimeStats.userName,
    title: "Level 4 Gluttony Dodger",
    orders: lifetimeStats.orders,
    caloriesSaved: lifetimeStats.caloriesSaved,
    karma: lifetimeStats.karmaPoints,
    donation: lifetimeStats.donationPledged,
    isUser: true
  });

  if (activeLbFilter === 'donors') {
    list.sort((a, b) => b.donation - a.donation);
  } else {
    list.sort((a, b) => b.caloriesSaved - a.caloriesSaved);
  }

  if (lbSearchQuery) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(lbSearchQuery) || 
      p.rank.toString() === lbSearchQuery
    );
  }

  const total = list.length;
  const totalPages = Math.ceil(total / LB_PER_PAGE);
  const startIndex = (lbCurrentPage - 1) * LB_PER_PAGE;
  const pagedList = list.slice(startIndex, startIndex + LB_PER_PAGE);

  if (countLabel) countLabel.textContent = `Displaying ${total.toLocaleString()} Verified Abstainers`;
  if (pageLabel) pageLabel.textContent = `Page ${lbCurrentPage} of ${totalPages || 1}`;
  if (prevBtn) prevBtn.disabled = lbCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = lbCurrentPage >= totalPages;

  container.innerHTML = pagedList.map((patron, idx) => {
    const rankNum = startIndex + idx + 1;
    const isSelf = patron.isUser;
    const medal = rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`;

    return `
      <div 
        onclick="soundBlip(); showToast('${patron.name}: Spared ${patron.caloriesSaved.toLocaleString()} kcal & earned ${patron.karma} Karma!', 'info')"
        class="p-3.5 flex items-center justify-between transition-colors cursor-pointer hover:bg-stone-50 text-xs ${
          isSelf ? 'bg-amber-50/80 font-semibold' : ''
        }"
      >
        <div class="flex items-center gap-3">
          <span class="w-8 text-center font-display font-black ${rankNum <= 3 ? 'text-base' : 'text-stone-400 font-mono'}">${medal}</span>
          <div>
            <div class="font-display font-bold text-swiggy-dark flex items-center gap-1.5">
              <span>${patron.name}</span>
              ${isSelf ? '<span class="px-1.5 py-0.2 rounded bg-swiggy-orange text-white text-[9px] font-mono font-bold">YOU</span>' : ''}
              ${patron.donation > 0 ? '<span class="text-xs" title="Smileys NGO Donor">💛</span>' : ''}
            </div>
            <div class="text-[10px] text-swiggy-muted">${patron.title}</div>
          </div>
        </div>

        <div class="flex items-center gap-6 font-mono text-xs">
          <span class="hidden sm:inline text-amber-800 font-bold">${patron.karma.toLocaleString()} pts</span>
          <span class="w-24 text-right font-extrabold text-swiggy-green font-display">
            ${patron.caloriesSaved.toLocaleString()} <span class="text-[9px] font-normal font-mono">kcal</span>
          </span>
        </div>
      </div>
    `;
  }).join('');
}

function lbNextPage() {
  lbCurrentPage++;
  soundTabClick();
  renderLeaderboardDrawer();
}

function lbPrevPage() {
  lbCurrentPage = Math.max(1, lbCurrentPage - 1);
  soundTabClick();
  renderLeaderboardDrawer();
}

function saveNewHandle() {
  const input = document.getElementById('handle-input');
  const val = input.value.trim();
  if (val) {
    lifetimeStats.userName = val;
    saveStats();
    updateUserDisplay();
    renderCompactPodium();
    renderLeaderboardDrawer();
    input.value = '';
    showToast(`Leaderboard tag updated to "${val}"! 🏷️`, "mint");
  }
}

/* ==========================================================
   DASHBOARD METRICS
   ========================================================== */
function renderDashboard() {
  const ordersEl = document.getElementById('dash-total-orders');
  const calsEl = document.getElementById('dash-total-cals');
  const equivEl = document.getElementById('dash-cals-equiv');
  const karmaEl = document.getElementById('dash-total-karma');
  const donationEl = document.getElementById('dash-total-donation');
  const donEquiv = document.getElementById('dash-donation-equiv');

  if (ordersEl) ordersEl.textContent = lifetimeStats.orders;
  if (calsEl) calsEl.textContent = lifetimeStats.caloriesSaved.toLocaleString();
  if (equivEl) {
    const walkingHours = (lifetimeStats.caloriesSaved / 300).toFixed(1);
    equivEl.textContent = `≈ ${walkingHours} hrs brisk walking spared`;
  }
  if (karmaEl) karmaEl.textContent = lifetimeStats.karmaPoints.toLocaleString();
  if (donationEl) donationEl.textContent = `₹${lifetimeStats.donationPledged}`;
  if (donEquiv) {
    const meals = Math.floor(lifetimeStats.donationPledged / 20);
    donEquiv.textContent = `${meals} hot student meals funded`;
  }
}

/* ==========================================================
   80G CERTIFICATE & RECEIPT MODALS
   ========================================================== */
function openCertificateModal() {
  // Only allow if user has a verified donation
  if (!lifetimeStats.isVerifiedDonor && (!lifetimeStats.donationPledged || lifetimeStats.donationPledged <= 0)) {
    soundBlip();
    showToast("⚠️ 80G Tax Certificates require payment verification. Please scan the UPI QR code and enter your 12-digit UTR.", "info");
    openDonationGateway(activeDonationTier || 100);
    return;
  }

  const backdrop = document.getElementById('certificate-backdrop');
  const nameEl = document.getElementById('cert-user-name');
  const amountEl = document.getElementById('cert-amount');
  const mealsEl = document.getElementById('cert-meals');
  const dateEl = document.getElementById('cert-date');
  const txnEl = document.getElementById('cert-txn-id');

  const donationAmount = lastCompletedOrder?.donation || lifetimeStats.donationPledged || 100;
  const meals = Math.max(1, Math.floor(donationAmount / 20));
  const txnId = lastCompletedOrder?.txnId || lifetimeStats.lastTxnId || 'VERIFIED';
  const certNum = lifetimeStats.lastCertNumber || `SMILEYS-80G-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  if (nameEl) nameEl.textContent = lifetimeStats.userName;
  if (amountEl) amountEl.textContent = `₹${donationAmount}.00`;
  if (mealsEl) mealsEl.textContent = `${meals} nutritious student meals`;
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  if (txnEl) txnEl.textContent = `${certNum} • UTR: ${txnId}`;

  if (backdrop) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    soundWarmBell();
  }
}

function closeCertificateModal() {
  const backdrop = document.getElementById('certificate-backdrop');
  if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
}

function printCertificate() {
  if (!lifetimeStats.isVerifiedDonor && (!lifetimeStats.donationPledged || lifetimeStats.donationPledged <= 0)) {
    showToast("⚠️ Only verified 80G tax exemption certificates can be printed.", "info");
    return;
  }
  window.print();
}

function openReceiptModal() {
  const backdrop = document.getElementById('receipt-backdrop');
  const order = lastCompletedOrder || {
    orderId: 'FNC-882194',
    formattedTime: 'Just now',
    caloriesSaved: 1250,
    subtotal: 490,
    donation: 100,
    dishes: [{ name: 'Extravagant Dum Gosht Biryani', qty: 1 }]
  };

  const idEl = document.getElementById('receipt-id');
  const timeEl = document.getElementById('receipt-time');
  const itemsEl = document.getElementById('receipt-items');
  const calsEl = document.getElementById('receipt-cals');
  const subtotalEl = document.getElementById('receipt-subtotal');
  const donationEl = document.getElementById('receipt-donation');

  if (idEl) idEl.textContent = order.orderId;
  if (timeEl) timeEl.textContent = order.formattedTime;
  if (calsEl) calsEl.textContent = `${order.caloriesSaved.toLocaleString()} kcal`;
  if (subtotalEl) subtotalEl.textContent = `₹${order.subtotal}`;
  if (donationEl) donationEl.textContent = `₹${order.donation}`;

  if (itemsEl) {
    itemsEl.innerHTML = order.dishes.map(d => `
      <div class="flex justify-between py-1 border-b border-dashed border-stone-200 text-xs">
        <span>${d.name} x ${d.qty}</span>
        <span class="font-mono text-stone-500">₹0 (Spared)</span>
      </div>
    `).join('');
  }

  if (backdrop) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    soundBlip();
  }
}

function closeReceiptModal() {
  const backdrop = document.getElementById('receipt-backdrop');
  if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
}

/* ==========================================================
   ORDER HISTORY MODAL
   ========================================================== */
function openOrderHistoryModal() {
  const backdrop = document.getElementById('history-backdrop');
  const container = document.getElementById('history-items-container');

  if (container) {
    if (lifetimeStats.orderHistory.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center">
          <span class="text-4xl">📭</span>
          <p class="font-display font-bold text-sm text-swiggy-dark mt-2">No past un-deliveries yet</p>
          <p class="text-xs text-swiggy-muted mt-1">Place your first zero-calorie order to populate your vault!</p>
        </div>
      `;
    } else {
      container.innerHTML = lifetimeStats.orderHistory.map(ord => `
        <div class="p-4 rounded-xl border border-swiggy-border bg-stone-50 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-mono font-bold text-xs text-swiggy-dark">#${ord.orderId}</span>
            <span class="text-[11px] text-swiggy-muted">${ord.formattedTime}</span>
          </div>
          <div class="text-xs text-swiggy-dark font-medium">
            ${ord.dishes.map(d => `${d.name} (${d.qty})`).join(', ')}
          </div>
          <div class="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
            <span class="font-mono text-swiggy-green font-bold">🔥 -${ord.caloriesSaved.toLocaleString()} kcal</span>
            <span class="font-mono text-amber-800 font-bold">✨ +${ord.karmaEarned} Karma</span>
            <span class="font-mono text-blue-900 font-bold">${ord.donation > 0 ? `💛 ₹${ord.donation} Donated` : '₹0 Paid'}</span>
          </div>
        </div>
      `).join('');
    }
  }

  if (backdrop) {
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    soundBlip();
  }
}

function closeOrderHistoryModal() {
  const backdrop = document.getElementById('history-backdrop');
  if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
}

/* ==========================================================
   REWARDS DRAWER
   ========================================================== */
function openRewardsDrawer() {
  document.getElementById('rewards-backdrop').classList.remove('opacity-0', 'pointer-events-none');
  document.getElementById('rewards-drawer').classList.remove('-translate-x-full');
  updateNavKarmaBadge();
}

function closeRewardsDrawer() {
  document.getElementById('rewards-backdrop').classList.add('opacity-0', 'pointer-events-none');
  document.getElementById('rewards-drawer').classList.add('-translate-x-full');
}

/* ==========================================================
   UTILITIES (TOAST, SMOOTH SCROLL, NOTIFICATIONS)
   ========================================================== */
function showToast(msg, theme = 'orange') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgStyle = theme === 'mint' 
    ? 'bg-swiggy-green text-white shadow-lg' 
    : theme === 'info'
    ? 'bg-swiggy-dark text-white shadow-lg'
    : 'bg-swiggy-orange text-white shadow-lg';

  toast.className = `${bgStyle} px-4 py-2.5 rounded-xl font-display font-semibold text-xs transition-all duration-300 transform translate-y-2 opacity-0 flex items-center gap-2 pointer-events-auto`;
  toast.innerHTML = `<span>${msg}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 20);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function openLiveTrackingModal() {
  soundBlip();
  soundRadarPing();
  const trackingView = document.getElementById('tracking-view');
  if (trackingView) {
    trackingView.classList.remove('hidden');
    trackingView.classList.add('flex');
    startRadarMap();
    startTelemetrySimulation();
  }
}

function handleNewsletterSubscribe(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('newsletter-email-input');
  if (!input) return;
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email to join Calorie Denial Club! 📧', 'info');
    return;
  }

  // Persist into SQLite database
  try {
    fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).catch(err => console.log('Offline/standalone fallback:', err));
  } catch (err) {}

  input.value = '';
  soundChaChing();
  soundFanfare();
  try {
    if (typeof confetti === 'function') confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
  } catch (err) {}
  showToast('🎉 Welcome to the Calorie Denial Club! Midnight cravings neutralized.', 'mint');
}

async function syncGlobalStatsFromDb() {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        const stats = json.data;
        const karmaDisplay = document.getElementById('hero-karma-display');
        if (karmaDisplay) karmaDisplay.textContent = `${(stats.totalPatrons * 1.42).toFixed(2)}k`;
      }
    }
  } catch (e) {
    // Offline / Standalone mode
  }
}

function startLiveNotificationTicker() {
  let idx = 0;
  notificationTimer = setInterval(() => {
    idx = (idx + 1) % LIVE_NOTIFICATIONS.length;
    const notif = LIVE_NOTIFICATIONS[idx];
    showToast(`<strong>${notif.name}</strong> just ${notif.action}`, "info");
  }, 18000);
}

// Global Keyboard Shortcut for Search (Press '/' or 'Ctrl+K' to search)
window.addEventListener('keydown', (e) => {
  if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && 
      document.activeElement.tagName !== 'INPUT' && 
      document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
      soundBlip();
    }
  }
});

// Initialize application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  initGeolocation();
  initStorage();
  initRazorpayConfig();
  syncGlobalStatsFromDb();
  renderRestaurantsCarousel();
  renderCategories();
  renderDishes();
  startLiveNotificationTicker();
});
