/* Food Never Comes (FNC) — Real Local Restaurants (Google Maps Extracted), Menus & 1,000+ Leaderboard Engine */

const RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Dada Boudi Biryani (Barrackpore)',
    cuisine: 'Kolkata Biryani, Mughlai, Mutton Chaap',
    area: '1, Ghoshpara Road, Barrackpore',
    distance: '0.8 km (Rider Stalled at Station)',
    rating: '4.9',
    ratingCount: '48k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    tag: 'Legendary Barrackpore Biryani'
  },
  {
    id: 'rest-2',
    name: 'Arsalan (Park Circus)',
    cuisine: 'Mughlai, Awadhi, Mutton Rezala, Kebabs',
    area: '28, Circus Avenue, 7-Point Crossing, Kolkata',
    distance: '3.4 km (Permanent Chai Break)',
    rating: '4.8',
    ratingCount: '52k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
    tag: 'Kolkata Biryani Landmark'
  },
  {
    id: 'rest-3',
    name: 'Peter Cat (Park Street)',
    cuisine: 'Chelo Kebabs, Continental Sizzlers, Mughlai',
    area: '18A, Stephen Court, Park Street, Kolkata',
    distance: '4.2 km (Zero Ovens Fired)',
    rating: '4.9',
    ratingCount: '38k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    tag: 'Iconic Chelo Kebab Heritage'
  },
  {
    id: 'rest-4',
    name: 'Aminia (Barrackpore)',
    cuisine: 'Awadhi, Lahori Chicken, Mutton Biryani',
    area: 'SN Banerjee Road, near Great Eastern, Barrackpore',
    distance: '1.1 km (Rider Stalled at Tea Bench)',
    rating: '4.7',
    ratingCount: '21k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    tag: 'Since 1929 Awadhi Legacy'
  },
  {
    id: 'rest-5',
    name: 'Mocambo (Park Street)',
    cuisine: 'Continental, Devilled Crab, Chicken Tetrazzini',
    area: '25B, Park Street, Kolkata',
    distance: '4.5 km (No Rush Protocol)',
    rating: '4.8',
    ratingCount: '29k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    tag: 'Colonial Fine Dining Classic'
  },
  {
    id: 'rest-6',
    name: 'Oudh 1590 (Period Dining)',
    cuisine: 'Awadhi Handi Biryani, Raan Biryani, Galawati',
    area: 'Salt Lake Sector 1 / Deshapriya Park, Kolkata',
    distance: '5.1 km (Dum Intercepted)',
    rating: '4.8',
    ratingCount: '26k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    tag: 'Authentic Nawabi Feast'
  },
  {
    id: 'rest-7',
    name: 'Chowman (Kolkata Chinese)',
    cuisine: 'Kolkata Chilli Chicken, Hakka Noodles, Dimsums',
    area: 'Salt Lake / Ballygunge, Kolkata',
    distance: '3.9 km (Wok Cold & Safe)',
    rating: '4.7',
    ratingCount: '19k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
    tag: 'Tangra-Style Indo-Chinese'
  },
  {
    id: 'rest-8',
    name: 'Balaram Mullick & Radharaman Mullick',
    cuisine: 'Baked Rosogolla, Mishti Doi, Nolen Gur Sandesh',
    area: '2, Paddapukur Road, Bhowanipore, Kolkata',
    distance: '4.8 km (Zero Sugar In Blood)',
    rating: '4.9',
    ratingCount: '34k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
    tag: 'Heritage Bengal Sweetmakers Since 1885'
  },
  {
    id: 'rest-9',
    name: 'Flurys (Park Street)',
    cuisine: 'Rum Balls, Heritage Pastries, English Breakfast',
    area: '18, Park Street, Kolkata',
    distance: '4.1 km (Tearoom Intercept)',
    rating: '4.7',
    ratingCount: '31k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    tag: 'Legendary Tearoom Since 1927'
  },
  {
    id: 'rest-10',
    name: 'Shiraz Golden Restaurant',
    cuisine: 'Shiraz Mutton Biryani, Pasinda, Chicken Bharta',
    area: '135, Park Street / Mullick Bazar, Kolkata',
    distance: '3.6 km (Rider Ground Zero)',
    rating: '4.8',
    ratingCount: '27k+ Google Reviews',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    tag: 'Golden Era Mughlai Tradition'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Local Cravings' },
  { id: 'biryani', label: 'Biryani & Chaap' },
  { id: 'kebabs', label: 'Chelo Kebabs & Tandoor' },
  { id: 'continental', label: 'Continental Sizzlers' },
  { id: 'chinese', label: 'Kolkata Chinese' },
  { id: 'desserts', label: 'Mishti & Pastries' }
];

/* Real High-Resolution Culinary Photography Pools */
const DISH_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', // Royal Dum Biryani
  'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80', // Handi Biryani Pot
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80', // Peter Cat Chelo Kebab with Saffron Rice
  'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80', // Rich Chaap & Gravy
  'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80', // Tandoori Reshmi Kebab
  'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&auto=format&fit=crop&q=80', // Kolkata Fish Fry / Cutlet
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80', // Continental Steak / Sizzler
  'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80', // Chowman Hakka Noodles & Chilli Chicken
  'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80', // Steamed Dim Sums
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80', // Baked Rosogolla / Mishti Doi
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80', // Flurys Heritage Rum Ball
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'  // Kolkata Kathi Kebab Roll
];

/* 500+ Procedural Dish Generation Engine based on Real Local Menus */
function generate500Dishes() {
  const dishes = [];
  const dishTemplates = [
    { name: 'Special Mutton Biryani (with Jumbo Potato & Egg)', cat: 'biryani', isVeg: false, basePrice: 350, baseCals: 1350, desc: 'Aromatic long-grain basmati cooked with tender Kolkata mutton cut, melt-in-mouth potato, and boiled egg.' },
    { name: 'Legendary Chelo Kebab with Buttered Saffron Rice', cat: 'kebabs', isVeg: false, basePrice: 520, baseCals: 1180, desc: 'Juicy minced mutton seekh and grilled chicken cubes served over saffron butter rice topped with a poached egg.' },
    { name: 'Kolkata Mutton Chaap in Slow-Cooked Gravy', cat: 'biryani', isVeg: false, basePrice: 320, baseCals: 1050, desc: 'Tender mutton ribs simmered in a velvety gravy of poppy seeds, cashew paste, mace, and saffron.' },
    { name: 'Murgh Rezala with Aromatic Kewra Essence', cat: 'biryani', isVeg: false, basePrice: 340, baseCals: 960, desc: 'Rich yogurt and cashew white gravy simmered with whole dry red chilies, tender chicken, and fragrant kewra.' },
    { name: 'Crispy Bhetki Fish Fry with Kasundi Mustard', cat: 'continental', isVeg: false, basePrice: 260, baseCals: 620, desc: 'Fresh Kolkata Bhetki fillet crumb-fried to golden crunch, served with authentic pungent Bengali Kasundi.' },
    { name: 'Devilled Crab in Baked Shell (Mocambo Classic)', cat: 'continental', isVeg: false, basePrice: 590, baseCals: 840, desc: 'Sweet shredded crabmeat tossed in mustard béchamel, stuffed back into the crab shell and baked with cheese.' },
    { name: 'Sizzling Chicken Steak with Brown Sauce & Mash', cat: 'continental', isVeg: false, basePrice: 480, baseCals: 1120, desc: 'Smoking hot sizzler platter with grilled chicken breast, buttered seasonal vegetables, and mashed potato.' },
    { name: 'Kolkata Chilli Chicken (Tangra Style)', cat: 'chinese', isVeg: false, basePrice: 320, baseCals: 780, desc: 'Crispy chicken chunks tossed with green chilies, dark soy sauce, crunchy capsicum, and spring onions.' },
    { name: 'Wok-Tossed Mixed Hakka Noodles (Prawn, Chicken, Egg)', cat: 'chinese', isVeg: false, basePrice: 340, baseCals: 890, desc: 'Smoky wok-charred noodles tossed with shredded chicken, juicy prawns, egg ribbons, and julienne veggies.' },
    { name: 'Baked Rosogolla in Thick Cream (Balaram Mullick Special)', cat: 'desserts', isVeg: true, basePrice: 180, baseCals: 580, desc: 'Spongy cottage cheese balls slow-baked in rich caramelized rabdi with saffron and cardamom.' },
    { name: 'Authentic Kolkata Mishti Doi in Earthen Pot', cat: 'desserts', isVeg: true, basePrice: 140, baseCals: 460, desc: 'Thick, creamy, caramelized fermented sweet yogurt set naturally in traditional terracotta pots.' },
    { name: 'Flurys Legendary Rum Ball with Dark Chocolate Glaze', cat: 'desserts', isVeg: true, basePrice: 160, baseCals: 510, desc: 'Rich chocolate sponge cake soaked in aromatic Jamaican rum essence, coated in silky dark chocolate ganache.' }
  ];

  const descriptors = ['Grand', 'Signature', 'Royal', 'Authentic', 'Crispy', 'Smoky', 'Velvet', 'Midnight', 'Supreme', 'Tandoori', 'Zero-Calorie', 'Phantom'];

  let idCounter = 1;

  for (const rest of RESTAURANTS) {
    for (let i = 0; i < 50; i++) {
      const template = dishTemplates[i % dishTemplates.length];
      const descWord = descriptors[(i + idCounter) % descriptors.length];
      const dishId = `dish-${idCounter}`;
      const imgIdx = (idCounter - 1) % DISH_IMAGE_POOL.length;
      const priceVariation = ((i * 15) % 80) - 20;
      const calVariation = ((i * 40) % 280) - 60;

      dishes.push({
        id: dishId,
        name: `${descWord} ${template.name}`,
        restaurant: rest.name,
        restaurantId: rest.id,
        category: template.cat,
        isVeg: template.isVeg,
        rating: (4.6 + ((i % 4) * 0.1)).toFixed(1),
        ratingCount: `${(1.2 + (i * 0.4)).toFixed(1)}k+`,
        image: DISH_IMAGE_POOL[imgIdx],
        price: Math.max(140, template.basePrice + priceVariation),
        calories: Math.max(380, template.baseCals + calVariation),
        bestseller: (i % 6 === 0),
        customizable: (i % 3 === 0),
        desc: `${template.desc} Prepared at ${rest.name}, safely prevented from reaching your doorstep.`,
        addons: [
          { id: `addon-${dishId}-1`, name: 'Extra Kolkata Mutton Potato & Egg', calories: 280, price: 60 },
          { id: `addon-${dishId}-2`, name: 'Sharma Ji Cutting Chai & Samosa', calories: 310, price: 35 }
        ]
      });

      idCounter++;
    }
  }

  return dishes;
}

const DISHES = generate500Dishes();

/* 1,000+ Patrons Leaderboard Generator */
function generate1000Leaderboard() {
  const firstNames = ["Arjun", "Priya", "Vikram", "Sneha", "Rohan", "Ananya", "Kabir", "Tanvi", "Siddharth", "Meera", "Aarav", "Divya", "Aditya", "Ishita", "Rahul", "Pooja", "Nikhil", "Neha", "Varun", "Rhea", "Subhash", "Debolina", "Sourav", "Priyanka", "Anirban"];
  const lastNames = ["Mehta", "Sharma", "Das", "Kapur", "Verma", "Reddy", "Nair", "Patel", "Iyer", "Rao", "Joshi", "Bhat", "Chopra", "Gupta", "Malhotra", "Kulkarni", "Sen", "Bose", "Banerjee", "Chatterjee", "Mukherjee"];
  const titles = [
    "Grandmaster of Restraint",
    "Biryani Dodger",
    "Samosa Resister",
    "Chelo Kebab Evader",
    "Chaap Dodger",
    "Zero-Calorie Monk",
    "Carb Evader",
    "Ghost Feast Champion",
    "Midnight Abstainer",
    "Rosogolla Denier"
  ];

  const patrons = [];

  // Seed top 3
  patrons.push({ rank: 1, name: "Arjun Mehta", title: "🥇 Grandmaster of Restraint", orders: 48, caloriesSaved: 68400, karma: 8240, donation: 2500 });
  patrons.push({ rank: 2, name: "Priya Sharma", title: "🥈 Samosa Resister", orders: 41, caloriesSaved: 54200, karma: 6800, donation: 1850 });
  patrons.push({ rank: 3, name: "Vikram Das", title: "🥉 Biryani Dodger", orders: 36, caloriesSaved: 46800, karma: 5420, donation: 1200 });

  let curCals = 45000;
  let curKarma = 5200;
  let curOrders = 34;

  for (let i = 4; i <= 1000; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const t = titles[i % titles.length];
    curCals = Math.max(1200, curCals - Math.floor(Math.random() * 45) - 25);
    curKarma = Math.round(curCals / 10) + ((i % 5 === 0) ? 500 : 0);
    curOrders = Math.max(1, Math.floor(curCals / 1100));
    const donation = (i % 6 === 0) ? (50 * (1 + (i % 8))) : 0;

    patrons.push({
      rank: i,
      name: `${fn} ${ln}`,
      title: `Level ${Math.max(1, 10 - Math.floor(i / 100))} ${t}`,
      orders: curOrders,
      caloriesSaved: curCals,
      karma: curKarma,
      donation: donation
    });
  }

  return patrons;
}

const SEED_LEADERBOARD = generate1000Leaderboard();

const TELEMETRY_TICKERS = [
  "Rider Sharma Ji ordered 2nd cutting chai with extra ginger.",
  "Rider is passionately debating the local football match with Sharma Ji.",
  "Rider spotted an old friend at the tea stall and pulled up a wooden bench.",
  "GPS speed reading: 0.00 km/h (engine switched off for cooling).",
  "Rider Sharma Ji ordered a plate of hot samosas with tangy tamarind chutney.",
  "Rider is checking WhatsApp group messages about local weather.",
  "Rider Sharma Ji has initiated chai cup #4. No rush whatsoever.",
  "Satellite lock confirms rider has entered deep philosophical contemplation."
];

const LIVE_NOTIFICATIONS = [
  { name: "Subhash from Barrackpore", action: "intercepted 1,350 kcal of Dada Boudi Special Mutton Biryani!" },
  { name: "Debolina from Park Street", action: "donated ₹100 to The Smileys Foundation! 💛" },
  { name: "Sourav from Salt Lake", action: "spared 1,180 kcal of Peter Cat Chelo Kebab!" },
  { name: "Ananya from New Town", action: "earned 350 FNC Karma points!" },
  { name: "Priyanka from Bhowanipore", action: "pledged ₹250 for rural student schoolbooks! 📚" },
  { name: "Anirban from Kolkata", action: "dodged midnight Arsalan Mutton Chaap cravings!" }
];
