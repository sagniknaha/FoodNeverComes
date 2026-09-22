// Food Never Comes (FNC) — Database Seeder
// Dual-Engine: Seeds SQLite if active, or JSON Store if node:sqlite is unavailable.

const { db, useSqlite, jsonStore, saveJsonStore } = require('./database');

const RESTAURANTS_DATA = [
  {
    id: 'rest-1',
    name: 'Dada Boudi Biryani (Barrackpore)',
    locality: 'Barakpur',
    address: '1, Ghoshpara Road, Barrackpore Railway Station, Kolkata 700120',
    rating: 4.9,
    rating_count: '48k+ Google Reviews',
    delivery_time: 'Never (Stalled at Station)',
    cost_for_two: 450,
    cuisines: 'Kolkata Biryani, Mughlai, Mutton Chaap',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98301 23456',
    lat: 22.7601,
    lng: 88.3712,
    is_ghost: 1
  },
  {
    id: 'rest-2',
    name: 'Arsalan (Park Circus)',
    locality: 'Park Circus',
    address: '28, Circus Avenue, 7-Point Crossing, Kolkata 700017',
    rating: 4.8,
    rating_count: '52k+ Google Reviews',
    delivery_time: 'Never (Permanent Chai Break)',
    cost_for_two: 550,
    cuisines: 'Mughlai, Awadhi, Mutton Rezala, Kebabs',
    image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98302 34567',
    lat: 22.5412,
    lng: 88.3639,
    is_ghost: 1
  },
  {
    id: 'rest-3',
    name: 'Peter Cat (Park Street)',
    locality: 'Park Street',
    address: '18A, Stephen Court, Park Street, Kolkata 700016',
    rating: 4.9,
    rating_count: '38k+ Google Reviews',
    delivery_time: 'Never (Zero Ovens Fired)',
    cost_for_two: 800,
    cuisines: 'Chelo Kebabs, Continental Sizzlers, Mughlai',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98303 45678',
    lat: 22.5516,
    lng: 88.3524,
    is_ghost: 1
  },
  {
    id: 'rest-4',
    name: 'Aminia (Barrackpore)',
    locality: 'Barakpur',
    address: 'SN Banerjee Road, near Great Eastern, Barrackpore 700120',
    rating: 4.7,
    rating_count: '21k+ Google Reviews',
    delivery_time: 'Never (Rider Stalled at Tea Bench)',
    cost_for_two: 400,
    cuisines: 'Awadhi, Lahori Chicken, Mutton Biryani',
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98304 56789',
    lat: 22.7634,
    lng: 88.3745,
    is_ghost: 1
  },
  {
    id: 'rest-5',
    name: 'Mocambo (Park Street)',
    locality: 'Park Street',
    address: '25B, Park Street, Kolkata 700016',
    rating: 4.8,
    rating_count: '29k+ Google Reviews',
    delivery_time: 'Never (No Rush Protocol)',
    cost_for_two: 900,
    cuisines: 'Continental, Devilled Crab, Chicken Tetrazzini',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98305 67890',
    lat: 22.5521,
    lng: 88.3533,
    is_ghost: 1
  },
  {
    id: 'rest-6',
    name: 'Oudh 1590 (Period Dining)',
    locality: 'Deshapriya Park',
    address: 'Salt Lake Sector 1 / Deshapriya Park, Kolkata',
    rating: 4.8,
    rating_count: '26k+ Google Reviews',
    delivery_time: 'Never (Dum Intercepted)',
    cost_for_two: 750,
    cuisines: 'Awadhi Handi Biryani, Raan Biryani, Galawati',
    image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98306 78901',
    lat: 22.5188,
    lng: 88.3582,
    is_ghost: 1
  },
  {
    id: 'rest-7',
    name: 'Chowman (Kolkata Chinese)',
    locality: 'Salt Lake',
    address: 'Salt Lake Sector 1 / Ballygunge, Kolkata',
    rating: 4.7,
    rating_count: '19k+ Google Reviews',
    delivery_time: 'Never (Wok Cold & Safe)',
    cost_for_two: 450,
    cuisines: 'Kolkata Chilli Chicken, Hakka Noodles, Dimsums',
    image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98307 89012',
    lat: 22.5847,
    lng: 88.4124,
    is_ghost: 1
  },
  {
    id: 'rest-8',
    name: 'Balaram Mullick & Radharaman Mullick',
    locality: 'Bhowanipore',
    address: '2, Paddapukur Road, Bhowanipore, Kolkata 700020',
    rating: 4.9,
    rating_count: '34k+ Google Reviews',
    delivery_time: 'Never (Zero Sugar In Blood)',
    cost_for_two: 250,
    cuisines: 'Baked Rosogolla, Mishti Doi, Nolen Gur Sandesh',
    image_url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98308 90123',
    lat: 22.5319,
    lng: 88.3496,
    is_ghost: 1
  },
  {
    id: 'rest-9',
    name: 'Flurys (Park Street)',
    locality: 'Park Street',
    address: '18, Park Street, Kolkata 700071',
    rating: 4.7,
    rating_count: '31k+ Google Reviews',
    delivery_time: 'Never (Tearoom Intercept)',
    cost_for_two: 600,
    cuisines: 'Rum Balls, Heritage Pastries, English Breakfast',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98309 01234',
    lat: 22.5519,
    lng: 88.3529,
    is_ghost: 1
  },
  {
    id: 'rest-10',
    name: 'Shiraz Golden Restaurant',
    locality: 'Park Street',
    address: '135, Park Street / Mullick Bazar, Kolkata 700017',
    rating: 4.8,
    rating_count: '27k+ Google Reviews',
    delivery_time: 'Never (Rider Ground Zero)',
    cost_for_two: 500,
    cuisines: 'Shiraz Mutton Biryani, Pasinda, Chicken Bharta',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    phone: '+91 98310 12345',
    lat: 22.5489,
    lng: 88.3615,
    is_ghost: 1
  }
];

const DISH_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'
];

const DISH_TEMPLATES = [
  { name: 'Special Mutton Biryani (with Jumbo Potato & Egg)', cat: 'biryani', isVeg: 0, basePrice: 350, baseCals: 1350, desc: 'Aromatic long-grain basmati cooked with tender Kolkata mutton cut, melt-in-mouth potato, and boiled egg.' },
  { name: 'Legendary Chelo Kebab with Buttered Saffron Rice', cat: 'kebabs', isVeg: 0, basePrice: 520, baseCals: 1180, desc: 'Juicy minced mutton seekh and grilled chicken cubes served over saffron butter rice topped with a poached egg.' },
  { name: 'Kolkata Mutton Chaap in Slow-Cooked Gravy', cat: 'biryani', isVeg: 0, basePrice: 320, baseCals: 1050, desc: 'Tender mutton ribs simmered in a velvety gravy of poppy seeds, cashew paste, mace, and saffron.' },
  { name: 'Murgh Rezala with Aromatic Kewra Essence', cat: 'biryani', isVeg: 0, basePrice: 340, baseCals: 960, desc: 'Rich yogurt and cashew white gravy simmered with whole dry red chilies, tender chicken, and fragrant kewra.' },
  { name: 'Crispy Bhetki Fish Fry with Kasundi Mustard', cat: 'continental', isVeg: 0, basePrice: 260, baseCals: 620, desc: 'Fresh Kolkata Bhetki fillet crumb-fried to golden crunch, served with authentic pungent Bengali Kasundi.' },
  { name: 'Devilled Crab in Baked Shell (Mocambo Classic)', cat: 'continental', isVeg: 0, basePrice: 590, baseCals: 840, desc: 'Sweet shredded crabmeat tossed in mustard béchamel, stuffed back into the crab shell and baked with cheese.' },
  { name: 'Sizzling Chicken Steak with Brown Sauce & Mash', cat: 'continental', isVeg: 0, basePrice: 480, baseCals: 1120, desc: 'Smoking hot sizzler platter with grilled chicken breast, buttered seasonal vegetables, and mashed potato.' },
  { name: 'Kolkata Chilli Chicken (Tangra Style)', cat: 'chinese', isVeg: 0, basePrice: 320, baseCals: 780, desc: 'Crispy chicken chunks tossed with green chilies, dark soy sauce, crunchy capsicum, and spring onions.' },
  { name: 'Wok-Tossed Mixed Hakka Noodles (Prawn, Chicken, Egg)', cat: 'chinese', isVeg: 0, basePrice: 340, baseCals: 890, desc: 'Smoky wok-charred noodles tossed with shredded chicken, juicy prawns, egg ribbons, and julienne veggies.' },
  { name: 'Baked Rosogolla in Thick Cream (Balaram Mullick Special)', cat: 'desserts', isVeg: 1, basePrice: 180, baseCals: 580, desc: 'Spongy cottage cheese balls slow-baked in rich caramelized rabdi with saffron and cardamom.' },
  { name: 'Authentic Kolkata Mishti Doi in Earthen Pot', cat: 'desserts', isVeg: 1, basePrice: 140, baseCals: 460, desc: 'Thick, creamy, caramelized fermented sweet yogurt set naturally in traditional terracotta pots.' },
  { name: 'Flurys Legendary Rum Ball with Dark Chocolate Glaze', cat: 'desserts', isVeg: 1, basePrice: 160, baseCals: 510, desc: 'Rich chocolate sponge cake soaked in aromatic Jamaican rum essence, coated in silky dark chocolate ganache.' }
];

const DESCRIPTORS = ['Grand', 'Signature', 'Royal', 'Authentic', 'Crispy', 'Smoky', 'Velvet', 'Midnight', 'Supreme', 'Tandoori', 'Zero-Calorie', 'Phantom'];

function seedDatabase() {
  console.log('🌱 Starting Database Seeding (Engine:', useSqlite ? 'SQLite' : 'JSON Store', ')...');

  if (useSqlite) {
    // 1. Seed Restaurants
    const restCount = db.prepare('SELECT COUNT(*) as count FROM restaurants').get().count;
    if (restCount === 0) {
      console.log('Seeding 10 authentic local restaurants...');
      const insertRest = db.prepare(`
        INSERT INTO restaurants (id, name, locality, address, rating, rating_count, delivery_time, cost_for_two, cuisines, image_url, phone, lat, lng, is_ghost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const r of RESTAURANTS_DATA) {
        insertRest.run(r.id, r.name, r.locality, r.address, r.rating, r.rating_count, r.delivery_time, r.cost_for_two, r.cuisines, r.image_url, r.phone, r.lat, r.lng, r.is_ghost);
      }
      console.log(`✅ Seeded ${RESTAURANTS_DATA.length} restaurants.`);
    }

    // 2. Seed 500+ Dishes
    const dishCount = db.prepare('SELECT COUNT(*) as count FROM dishes').get().count;
    if (dishCount === 0) {
      console.log('Generating and seeding 500+ authentic local dishes...');
      const insertDish = db.prepare(`
        INSERT INTO dishes (restaurant_id, name, description, category, price, calories, is_veg, rating, rating_count, image_url, is_bestseller)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let totalDishes = 0;
      for (const rest of RESTAURANTS_DATA) {
        for (let i = 0; i < 50; i++) {
          const template = DISH_TEMPLATES[i % DISH_TEMPLATES.length];
          const descWord = DESCRIPTORS[(i + totalDishes) % DESCRIPTORS.length];
          const imgIdx = totalDishes % DISH_IMAGE_POOL.length;
          const priceVariation = ((i * 15) % 80) - 20;
          const calVariation = ((i * 40) % 280) - 60;

          const name = `${descWord} ${template.name}`;
          const description = `${template.desc} Prepared at ${rest.name}, safely prevented from reaching your doorstep.`;
          const price = Math.max(140, template.basePrice + priceVariation);
          const calories = Math.max(380, template.baseCals + calVariation);
          const rating = Number((4.6 + ((i % 4) * 0.1)).toFixed(1));
          const ratingCount = Math.floor(1200 + (i * 400));
          const isBestseller = (i % 6 === 0) ? 1 : 0;

          insertDish.run(rest.id, name, description, template.cat, price, calories, template.isVeg, rating, ratingCount, DISH_IMAGE_POOL[imgIdx], isBestseller);
          totalDishes++;
        }
      }
      console.log(`✅ Seeded ${totalDishes} authentic dishes across all restaurants.`);
    }

    // 3. Seed 1,000 Patrons Leaderboard
    const lbCount = db.prepare('SELECT COUNT(*) as count FROM leaderboard').get().count;
    if (lbCount === 0) {
      console.log('Seeding 1,000 verified patrons into leaderboard...');
      const insertPatron = db.prepare(`
        INSERT INTO leaderboard (rank, name, title, orders_count, calories_saved, karma_points, donation_pledged, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const firstNames = ["Arjun", "Priya", "Vikram", "Sneha", "Rohan", "Ananya", "Kabir", "Tanvi", "Siddharth", "Meera", "Aarav", "Divya", "Aditya", "Ishita", "Rahul", "Pooja", "Nikhil", "Neha", "Varun", "Rhea", "Subhash", "Debolina", "Sourav", "Priyanka", "Anirban"];
      const lastNames = ["Mehta", "Sharma", "Das", "Kapur", "Verma", "Reddy", "Nair", "Patel", "Iyer", "Rao", "Joshi", "Bhat", "Chopra", "Gupta", "Malhotra", "Kulkarni", "Sen", "Bose", "Banerjee", "Chatterjee", "Mukherjee"];
      const titles = ["Grandmaster of Restraint", "Biryani Dodger", "Samosa Resister", "Chelo Kebab Evader", "Chaap Dodger", "Zero-Calorie Monk", "Carb Evader", "Ghost Feast Champion", "Midnight Abstainer", "Rosogolla Denier"];

      insertPatron.run(1, "Arjun Mehta", "🥇 Grandmaster of Restraint", 48, 68400, 8240, 2500, 1);
      insertPatron.run(2, "Priya Sharma", "🥈 Samosa Resister", 41, 54200, 6800, 1850, 1);
      insertPatron.run(3, "Vikram Das", "🥉 Biryani Dodger", 36, 46800, 5420, 1200, 1);

      let curCals = 45000;
      for (let i = 4; i <= 1000; i++) {
        const fn = firstNames[i % firstNames.length];
        const ln = lastNames[(i * 3) % lastNames.length];
        const t = titles[i % titles.length];
        curCals = Math.max(1200, curCals - Math.floor(Math.random() * 45) - 25);
        const curKarma = Math.round(curCals / 10) + ((i % 5 === 0) ? 500 : 0);
        const curOrders = Math.max(1, Math.floor(curCals / 1100));
        const donation = (i % 6 === 0) ? (50 * (1 + (i % 8))) : 0;

        insertPatron.run(i, `${fn} ${ln}`, `Level ${Math.max(1, 10 - Math.floor(i / 100))} ${t}`, curOrders, curCals, curKarma, donation, 1);
      }
      console.log('✅ Seeded 1,000 verified patrons into leaderboard.');
    }
  } else {
    // JSON Store Seeding
    if (jsonStore.restaurants.length === 0) {
      jsonStore.restaurants = [...RESTAURANTS_DATA];
    }
    if (jsonStore.dishes.length === 0) {
      let totalDishes = 0;
      for (const rest of RESTAURANTS_DATA) {
        for (let i = 0; i < 50; i++) {
          const template = DISH_TEMPLATES[i % DISH_TEMPLATES.length];
          const descWord = DESCRIPTORS[(i + totalDishes) % DESCRIPTORS.length];
          const imgIdx = totalDishes % DISH_IMAGE_POOL.length;
          const priceVariation = ((i * 15) % 80) - 20;
          const calVariation = ((i * 40) % 280) - 60;

          jsonStore.dishes.push({
            id: totalDishes + 1,
            restaurant_id: rest.id,
            name: `${descWord} ${template.name}`,
            description: `${template.desc} Prepared at ${rest.name}, safely prevented from reaching your doorstep.`,
            category: template.cat,
            price: Math.max(140, template.basePrice + priceVariation),
            calories: Math.max(380, template.baseCals + calVariation),
            is_veg: template.isVeg,
            rating: Number((4.6 + ((i % 4) * 0.1)).toFixed(1)),
            rating_count: Math.floor(1200 + (i * 400)),
            image_url: DISH_IMAGE_POOL[imgIdx],
            is_bestseller: (i % 6 === 0) ? 1 : 0
          });
          totalDishes++;
        }
      }
    }
    if (jsonStore.leaderboard.length === 0) {
      const firstNames = ["Arjun", "Priya", "Vikram", "Sneha", "Rohan", "Ananya", "Kabir", "Tanvi", "Siddharth", "Meera", "Aarav", "Divya", "Aditya", "Ishita", "Rahul", "Pooja", "Nikhil", "Neha", "Varun", "Rhea", "Subhash", "Debolina", "Sourav", "Priyanka", "Anirban"];
      const lastNames = ["Mehta", "Sharma", "Das", "Kapur", "Verma", "Reddy", "Nair", "Patel", "Iyer", "Rao", "Joshi", "Bhat", "Chopra", "Gupta", "Malhotra", "Kulkarni", "Sen", "Bose", "Banerjee", "Chatterjee", "Mukherjee"];
      const titles = ["Grandmaster of Restraint", "Biryani Dodger", "Samosa Resister", "Chelo Kebab Evader", "Chaap Dodger", "Zero-Calorie Monk", "Carb Evader", "Ghost Feast Champion", "Midnight Abstainer", "Rosogolla Denier"];

      jsonStore.leaderboard.push({ id: 1, rank: 1, name: "Arjun Mehta", title: "🥇 Grandmaster of Restraint", orders_count: 48, calories_saved: 68400, karma_points: 8240, donation_pledged: 2500, is_verified: 1 });
      jsonStore.leaderboard.push({ id: 2, rank: 2, name: "Priya Sharma", title: "🥈 Samosa Resister", orders_count: 41, calories_saved: 54200, karma_points: 6800, donation_pledged: 1850, is_verified: 1 });
      jsonStore.leaderboard.push({ id: 3, rank: 3, name: "Vikram Das", title: "🥉 Biryani Dodger", orders_count: 36, calories_saved: 46800, karma_points: 5420, donation_pledged: 1200, is_verified: 1 });

      let curCals = 45000;
      for (let i = 4; i <= 1000; i++) {
        const fn = firstNames[i % firstNames.length];
        const ln = lastNames[(i * 3) % lastNames.length];
        const t = titles[i % titles.length];
        curCals = Math.max(1200, curCals - Math.floor(Math.random() * 45) - 25);
        const curKarma = Math.round(curCals / 10) + ((i % 5 === 0) ? 500 : 0);
        const curOrders = Math.max(1, Math.floor(curCals / 1100));
        const donation = (i % 6 === 0) ? (50 * (1 + (i % 8))) : 0;

        jsonStore.leaderboard.push({ id: i, rank: i, name: `${fn} ${ln}`, title: `Level ${Math.max(1, 10 - Math.floor(i / 100))} ${t}`, orders_count: curOrders, calories_saved: curCals, karma_points: curKarma, donation_pledged: donation, is_verified: 1 });
      }
      saveJsonStore();
    }
  }

  console.log('🎉 Database seeding complete!');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
