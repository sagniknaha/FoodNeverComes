/* Food Never Comes (FNC) — Real Local Restaurants by City, Authentic Menus, Randomized Riders & Leaderboard Engine */

/* Geodesic Distance Calculation (Haversine Formula in Kilometers) */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.3;
  const R = 6371; // Earth radius in km
  const dLat = (Number(lat2) - Number(lat1)) * Math.PI / 180;
  const dLon = (Number(lon2) - Number(lon1)) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(Number(lat1) * Math.PI / 180) * Math.cos(Number(lat2) * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* Authentic Regional Restaurant Database */
const CITY_RESTAURANTS = {
  kolkata: [
    {
      id: 'rest-kol-1',
      name: 'Dada Boudi Biryani (Barrackpore)',
      cuisine: 'Kolkata Biryani, Mughlai, Mutton Chaap',
      area: '1, Ghoshpara Road, Barrackpore, Kolkata',
      lat: 22.7630,
      lng: 88.3685,
      rating: '4.9',
      ratingCount: '48k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      tag: 'Legendary Barrackpore Biryani'
    },
    {
      id: 'rest-kol-2',
      name: 'Aminia (Barrackpore)',
      cuisine: 'Awadhi, Lahori Chicken, Mutton Biryani',
      area: 'SN Banerjee Road, near Great Eastern, Barrackpore',
      lat: 22.7605,
      lng: 88.3712,
      rating: '4.7',
      ratingCount: '21k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
      tag: 'Since 1929 Awadhi Legacy'
    },
    {
      id: 'rest-kol-3',
      name: 'Arsalan (Park Circus)',
      cuisine: 'Mughlai, Awadhi, Mutton Rezala, Kebabs',
      area: '28, Circus Avenue, 7-Point Crossing, Kolkata',
      lat: 22.5412,
      lng: 88.3653,
      rating: '4.8',
      ratingCount: '52k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
      tag: 'Kolkata Biryani Landmark'
    },
    {
      id: 'rest-kol-4',
      name: 'Peter Cat (Park Street)',
      cuisine: 'Chelo Kebabs, Continental Sizzlers, Mughlai',
      area: '18A, Stephen Court, Park Street, Kolkata',
      lat: 22.5516,
      lng: 88.3524,
      rating: '4.9',
      ratingCount: '38k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      tag: 'Iconic Chelo Kebab Heritage'
    },
    {
      id: 'rest-kol-5',
      name: 'Mocambo (Park Street)',
      cuisine: 'Continental, Devilled Crab, Chicken Tetrazzini',
      area: '25B, Park Street, Kolkata',
      lat: 22.5519,
      lng: 88.3527,
      rating: '4.8',
      ratingCount: '29k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      tag: 'Colonial Fine Dining Classic'
    },
    {
      id: 'rest-kol-6',
      name: 'Shiraz Golden Restaurant',
      cuisine: 'Shiraz Mutton Biryani, Pasinda, Chicken Bharta',
      area: '135, Park Street / Mullick Bazar, Kolkata',
      lat: 22.5448,
      lng: 88.3601,
      rating: '4.8',
      ratingCount: '27k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
      tag: 'Golden Era Mughlai Tradition'
    },
    {
      id: 'rest-kol-7',
      name: 'Oudh 1590 (Period Dining)',
      cuisine: 'Awadhi Handi Biryani, Raan Biryani, Galawati',
      area: 'Salt Lake Sector 1 / Deshapriya Park, Kolkata',
      lat: 22.5855,
      lng: 88.4110,
      rating: '4.8',
      ratingCount: '26k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
      tag: 'Authentic Nawabi Feast'
    },
    {
      id: 'rest-kol-8',
      name: 'Chowman (Kolkata Chinese)',
      cuisine: 'Kolkata Chilli Chicken, Hakka Noodles, Dimsums',
      area: 'Salt Lake / Ballygunge, Kolkata',
      lat: 22.5840,
      lng: 88.4150,
      rating: '4.7',
      ratingCount: '19k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80',
      tag: 'Tangra-Style Indo-Chinese'
    },
    {
      id: 'rest-kol-9',
      name: 'Balaram Mullick & Radharaman Mullick',
      cuisine: 'Baked Rosogolla, Mishti Doi, Nolen Gur Sandesh',
      area: '2, Paddapukur Road, Bhowanipore, Kolkata',
      lat: 22.5320,
      lng: 88.3490,
      rating: '4.9',
      ratingCount: '34k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
      tag: 'Heritage Bengal Sweetmakers Since 1885'
    },
    {
      id: 'rest-kol-10',
      name: 'Flurys (Park Street)',
      cuisine: 'Rum Balls, Heritage Pastries, English Breakfast',
      area: '18, Park Street, Kolkata',
      lat: 22.5515,
      lng: 88.3523,
      rating: '4.7',
      ratingCount: '31k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      tag: 'Legendary Tearoom Since 1927'
    }
  ],
  bangalore: [
    {
      id: 'rest-blr-1',
      name: 'Meghana Foods (Koramangala)',
      cuisine: 'Andhra Biryani, Chicken 65, Paneer Biryani',
      area: '1st Block, Koramangala, Bangalore',
      lat: 12.9345,
      lng: 77.6242,
      rating: '4.8',
      ratingCount: '62k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      tag: 'Bangalore Biryani Sensation'
    },
    {
      id: 'rest-blr-2',
      name: 'Truffles (Koramangala)',
      cuisine: 'All-American Burgers, Steaks, Peri Peri Pasta',
      area: '5th Block, Koramangala, Bangalore',
      lat: 12.9338,
      lng: 77.6231,
      rating: '4.7',
      ratingCount: '58k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      tag: 'Iconic Burger Mecca'
    },
    {
      id: 'rest-blr-3',
      name: 'Toit Brewpub & Kitchen (Indiranagar)',
      cuisine: 'Woodfired Pizzas, Brew Bites, BBQ Chicken',
      area: '100 Feet Road, Indiranagar, Bangalore',
      lat: 12.9793,
      lng: 77.6406,
      rating: '4.8',
      ratingCount: '45k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
      tag: 'Legendary Craft & Bites'
    },
    {
      id: 'rest-blr-4',
      name: 'Empire Restaurant (Indiranagar)',
      cuisine: 'Empire Special Chicken Kebab, Ghee Rice, Grill',
      area: 'CMH Road / 80 Feet Road, Indiranagar, Bangalore',
      lat: 12.9785,
      lng: 77.6395,
      rating: '4.6',
      ratingCount: '39k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
      tag: 'Taste of Bengaluru Late Night'
    },
    {
      id: 'rest-blr-5',
      name: 'Nagarjuna (Residency Road)',
      cuisine: 'Traditional Andhra Meals, Chilli Chicken, Sholay',
      area: 'Residency Road, Ashok Nagar, Bangalore',
      lat: 12.9734,
      lng: 77.6074,
      rating: '4.7',
      ratingCount: '35k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
      tag: 'Fiery Andhra Tradition Since 1984'
    },
    {
      id: 'rest-blr-6',
      name: 'Vidyarthi Bhavan (Gandhi Bazaar)',
      cuisine: 'Crispy Benne Masala Dosa, Filter Coffee, Vada',
      area: 'Gandhi Bazaar Main Road, Basavanagudi, Bangalore',
      lat: 12.9448,
      lng: 77.5701,
      rating: '4.9',
      ratingCount: '75k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      tag: 'Heritage Dosa Legend Since 1943'
    },
    {
      id: 'rest-blr-7',
      name: 'CTR - Shri Sagar (Malleshwaram)',
      cuisine: 'Benne Dosa, Mangalore Bajji, Filter Kaapi',
      area: '7th Cross, Margosa Road, Malleshwaram, Bangalore',
      lat: 13.0031,
      lng: 77.5714,
      rating: '4.8',
      ratingCount: '48k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      tag: 'Golden Crispy Butter Dosa'
    },
    {
      id: 'rest-blr-8',
      name: 'MTR - Mavalli Tiffin Room (Lalbagh)',
      cuisine: 'Rava Idli, Bisibelebath, Pure Ghee Sweets',
      area: '14, Lalbagh Road, Mavalli, Bangalore',
      lat: 12.9554,
      lng: 77.5861,
      rating: '4.8',
      ratingCount: '68k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      tag: 'Original Inventor of Rava Idli 1924'
    },
    {
      id: 'rest-blr-9',
      name: 'Corner House Ice Cream (Koramangala)',
      cuisine: 'Death By Chocolate (DBC), Hot Chocolate Fudge',
      area: '1st Block / 5th Block, Koramangala, Bangalore',
      lat: 12.9351,
      lng: 77.6225,
      rating: '4.9',
      ratingCount: '54k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      tag: 'Iconic DBC Sundae Destination'
    },
    {
      id: 'rest-blr-10',
      name: "Glen's Bakehouse (Indiranagar)",
      cuisine: 'Red Velvet Cupcakes, Cheesecakes, Sourdough',
      area: 'Lavelle Road / Indiranagar, Bangalore',
      lat: 12.9719,
      lng: 77.6412,
      rating: '4.7',
      ratingCount: '31k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      tag: 'Artisan Bakery & Desserts'
    }
  ],
  mumbai: [
    {
      id: 'rest-mum-1',
      name: 'Bastian (Bandra West)',
      cuisine: 'Gourmet Seafood, Lobster Rolls, Cheesecakes',
      area: 'Linking Road, Bandra West, Mumbai',
      lat: 19.0601,
      lng: 72.8338,
      rating: '4.8',
      ratingCount: '32k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      tag: 'Celebrity Seafood & Brunch'
    },
    {
      id: 'rest-mum-2',
      name: 'Bademiya (Colaba)',
      cuisine: 'Mutton Seekh Kebab, Baida Roti, Chicken Roll',
      area: 'Tulloch Road, Apollo Bandar, Colaba, Mumbai',
      lat: 18.9220,
      lng: 72.8335,
      rating: '4.7',
      ratingCount: '55k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
      tag: 'Midnight Kebab Haven Since 1946'
    },
    {
      id: 'rest-mum-3',
      name: 'Sardar Pav Bhaji (Tardeo)',
      cuisine: 'Extra Butter Amul Pav Bhaji, Cheese Pav Bhaji',
      area: '166, Tardeo Road, Junction, Mumbai',
      lat: 18.9696,
      lng: 72.8164,
      rating: '4.6',
      ratingCount: '48k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
      tag: 'Swimming in Butter Since 1966'
    },
    {
      id: 'rest-mum-4',
      name: 'Britannia & Co. (Ballard Estate)',
      cuisine: 'Berry Pulao, Sali Boti, Caramel Custard',
      area: 'Wakefield House, Ballard Estate, Fort, Mumbai',
      lat: 18.9372,
      lng: 72.8391,
      rating: '4.8',
      ratingCount: '28k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      tag: 'Legendary Parsi Heritage Cafe'
    },
    {
      id: 'rest-mum-5',
      name: 'Leopold Cafe (Colaba)',
      cuisine: 'Irani Chai, Roast Chicken, Draught Beer Bites',
      area: 'Colaba Causeway, Apollo Bandar, Mumbai',
      lat: 18.9226,
      lng: 72.8317,
      rating: '4.7',
      ratingCount: '44k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      tag: 'World-Famous Historic Landmark 1871'
    },
    {
      id: 'rest-mum-6',
      name: "Joey's Pizza (Andheri West)",
      cuisine: 'Meat Craver Pizza, Tornado Pizza, Garlic Bread',
      area: '6&7, Upvan Building, DN Nagar, Andheri West, Mumbai',
      lat: 19.1298,
      lng: 72.8310,
      rating: '4.9',
      ratingCount: '41k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
      tag: 'Mumbai Cult Favorite Deep Dish Pizza'
    },
    {
      id: 'rest-mum-7',
      name: 'Kyani & Co. (Marine Lines)',
      cuisine: 'Bun Maska, Mutton Pattice, Irani Chai, Akuri',
      area: 'Jermahal Estate, JSS Road, Marine Lines, Mumbai',
      lat: 18.9432,
      lng: 72.8277,
      rating: '4.8',
      ratingCount: '31k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      tag: 'Oldest Surviving Parsi Cafe 1904'
    },
    {
      id: 'rest-mum-8',
      name: 'Gajalee Seafood (Vile Parle)',
      cuisine: 'Bombil Fry, Butter Garlic Crab, Fish Thali',
      area: 'Hanuman Road, Vile Parle East, Mumbai',
      lat: 19.1028,
      lng: 72.8524,
      rating: '4.8',
      ratingCount: '26k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      tag: 'Coastal Malvani Seafood Excellence'
    },
    {
      id: 'rest-mum-9',
      name: 'Lucky Restaurant (Bandra West)',
      cuisine: 'Mumbai Dum Biryani, Mutton Chaap, Caramel Custard',
      area: 'SV Road & Hill Road Junction, Bandra West, Mumbai',
      lat: 19.0560,
      lng: 72.8390,
      rating: '4.7',
      ratingCount: '36k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      tag: 'Bandra Biryani Institution Since 1938'
    },
    {
      id: 'rest-mum-10',
      name: 'Theobroma Patisserie (Bandra / Colaba)',
      cuisine: 'Overload Brownie, Millionaire Brownie, Tarts',
      area: 'Cusrow Baug, Colaba / Pali Hill, Bandra, Mumbai',
      lat: 19.0550,
      lng: 72.8300,
      rating: '4.9',
      ratingCount: '49k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      tag: 'Home of the Original Mumbai Brownie'
    }
  ],
  delhi: [
    {
      id: 'rest-del-1',
      name: "Karim's (Jama Masjid)",
      cuisine: 'Mutton Korma, Seekh Kebab, Mutton Burra, Sheermal',
      area: 'Gali Kababian, Jama Masjid, Old Delhi',
      lat: 28.6508,
      lng: 77.2334,
      rating: '4.8',
      ratingCount: '78k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
      tag: 'Royal Mughlai Heritage Since 1913'
    },
    {
      id: 'rest-del-2',
      name: 'Gulati Restaurant (Pandara Road)',
      cuisine: 'Butter Chicken, Dal Makhani, Kakori Kebab',
      area: '6, Pandara Road Market, New Delhi',
      lat: 28.6062,
      lng: 77.2341,
      rating: '4.9',
      ratingCount: '65k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
      tag: 'Capital Butter Chicken Benchmark'
    },
    {
      id: 'rest-del-3',
      name: 'Kake Da Dhaba (Connaught Place)',
      cuisine: 'Dahi Meat, Kadhai Chicken, Keema Naan',
      area: 'Connaught Circus, Outer Circle, CP, New Delhi',
      lat: 28.6328,
      lng: 77.2201,
      rating: '4.7',
      ratingCount: '42k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      tag: 'Hearty Punjabi Dhaba Legend 1931'
    },
    {
      id: 'rest-del-4',
      name: 'Saravana Bhavan (Connaught Place)',
      cuisine: 'Ghee Roast Dosa, Mini Idli Sambhar, Filter Coffee',
      area: 'P-13, Connaught Circus / Janpath, New Delhi',
      lat: 28.6292,
      lng: 77.2185,
      rating: '4.8',
      ratingCount: '51k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      tag: 'Pure South Indian Vegetarian Gold'
    },
    {
      id: 'rest-del-5',
      name: 'Moti Mahal (Daryaganj)',
      cuisine: 'Original Butter Chicken, Tandoori Murgh, Burra',
      area: '3703, Netaji Subhash Marg, Daryaganj, New Delhi',
      lat: 28.6443,
      lng: 77.2410,
      rating: '4.7',
      ratingCount: '38k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
      tag: 'Birthplace of Butter Chicken 1947'
    },
    {
      id: 'rest-del-6',
      name: "Wenger's Deli & Bakery (Connaught Place)",
      cuisine: 'Shamia Kebab, Chicken Patties, Chocolate Mousse',
      area: 'A-16, Inner Circle, Connaught Place, New Delhi',
      lat: 28.6331,
      lng: 77.2195,
      rating: '4.9',
      ratingCount: '47k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      tag: 'Oldest Confectionery in Delhi 1926'
    },
    {
      id: 'rest-del-7',
      name: 'Bukhara (ITC Maurya)',
      cuisine: 'Dal Bukhara (18-hr slow cook), Sikandari Raan',
      area: 'Diplomatic Enclave, Sadar Patel Marg, New Delhi',
      lat: 28.5975,
      lng: 77.1738,
      rating: '4.9',
      ratingCount: '29k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      tag: 'World-Renowned Clay Oven Royalty'
    },
    {
      id: 'rest-del-8',
      name: 'Rajinder Da Dhaba (Safdarjung)',
      cuisine: 'Galouti Kebab, Tawa Mutton, Malai Tikka',
      area: 'AB-6, Safdarjung Enclave Market, New Delhi',
      lat: 28.5670,
      lng: 77.1990,
      rating: '4.8',
      ratingCount: '58k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
      tag: 'South Delhi Street Meat Sensation'
    },
    {
      id: 'rest-del-9',
      name: 'Andhra Bhavan Canteen (Ashoka Road)',
      cuisine: 'Unlimited South Indian Thali, Mutton Fry, Biryani',
      area: '1, Ashoka Road, Feroze Shah Road, New Delhi',
      lat: 28.6180,
      lng: 77.2245,
      rating: '4.8',
      ratingCount: '49k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
      tag: 'Capital Cult Thali Destination'
    },
    {
      id: 'rest-del-10',
      name: 'Natraj Dahi Bhalle Corner (Chandni Chowk)',
      cuisine: 'Dahi Bhalla, Aloo Tikki with Piquant Chutney',
      area: '1396, Main Road, Chandni Chowk, Old Delhi',
      lat: 28.6570,
      lng: 77.2305,
      rating: '4.7',
      ratingCount: '34k+ Google Reviews',
      image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
      tag: 'Old Delhi Chaat Legend Since 1940'
    }
  ]
};

/* Randomized Delivery Rider Partners Pool */
const DELIVERY_RIDERS = [
  {
    name: "Sharma Ji",
    rating: "4.9 ★",
    skips: "2,400+ skipped",
    vehicle: "Honda Activa (WB-24-CHAI-007)",
    phone: "+91 98749 58471",
    statusText: "☕ Savoring cutting chai #4 at roadside stall • Samosa in hand",
    callReply: "Haan bhai, cutting chai pe raha hoon, bilkul deliver nahi hoga! Araam se raho.",
    messageReply: "Sharma Ji acknowledged: 'Order safe, food untouched, 0 calories delivered!'"
  },
  {
    name: "Ramesh Kumar",
    rating: "4.8 ★",
    skips: "3,120+ skipped",
    vehicle: "Hero Splendor (KA-05-CHILL-420)",
    phone: "+91 98451 88234",
    statusText: "🏏 Watching India vs Australia test match replay at pan shop",
    callReply: "Sir, last over chal raha hai! Deliver karna cancel samjho.",
    messageReply: "Ramesh Kumar: 'Match khatam hone tak scooter start nahi hoga, zero tension!'"
  },
  {
    name: "Manoj Tiwari",
    rating: "4.9 ★",
    skips: "1,890+ skipped",
    vehicle: "Bajaj Pulsar (MH-12-GHOST-99)",
    phone: "+91 98203 55412",
    statusText: "🗣️ In deep philosophical debate about why biryani has potato",
    callReply: "Bhaiya aalu biryani ka mudda solve ho jaye pehle, phir baat karte hain!",
    messageReply: "Manoj Tiwari: 'Philosophy over calories, delivery safely neutralized!'"
  },
  {
    name: "Bunty Singh",
    rating: "5.0 ★",
    skips: "4,250+ skipped",
    vehicle: "Royal Enfield Bullet (DL-03-DETOUR-777)",
    phone: "+91 98114 99012",
    statusText: "😴 Taking 45-minute power nap on his parked scooter seat",
    callReply: "Zzzz... Bunty here... zero calories delivered... go back to sleep... zzzz",
    messageReply: "Bunty Singh: 'Nap in progress. Zero calories delivered successfully.'"
  },
  {
    name: "Subhash Da",
    rating: "4.9 ★",
    skips: "3,800+ skipped",
    vehicle: "TVS Jupiter (WB-02-LAZY-333)",
    phone: "+91 98308 12765",
    statusText: "🍬 Savoring hot mishti and rabri with zero rush protocol",
    callReply: "Arey dada, mishti khachhi! Ekhon delivery hobe na, calorie bachiye dilam!",
    messageReply: "Subhash Da: 'Mishti devoured by rider, calories spared for patron!'"
  },
  {
    name: "Pradeep Bhai",
    rating: "4.8 ★",
    skips: "2,980+ skipped",
    vehicle: "Honda Dio (KA-01-STOP-108)",
    phone: "+91 99002 67431",
    statusText: "⛽ Refueling ₹50 petrol & discussing budget with pump attendant",
    callReply: "Boss, petrol daal raha hoon aur rate pe charcha chal rahi hai. Nahi aa raha!",
    messageReply: "Pradeep Bhai: 'Fuel talks ongoing. Enjoy your guilt-free meal!'"
  },
  {
    name: "Vikram Rathore",
    rating: "4.9 ★",
    skips: "2,150+ skipped",
    vehicle: "Hero Glamour (DL-08-REST-555)",
    phone: "+91 98711 34980",
    statusText: "🚦 Waiting at red light that has been red since 2021",
    callReply: "Bhai red signal kab green hoga pata nahi, aap fitness enjoy karo!",
    messageReply: "Vikram Rathore: 'Signal still red. Calories permanently halted.'"
  },
  {
    name: "Abdul Sheikh",
    rating: "5.0 ★",
    skips: "3,640+ skipped",
    vehicle: "Suzuki Access (MH-01-CHAI-888)",
    phone: "+91 98920 44319",
    statusText: "🥪 Eating bun maska with Irani chai at corner bakery",
    callReply: "Maska bun garam hai sir, delivery cold ho chuki hai. No worry!",
    messageReply: "Abdul Sheikh: 'Irani chai session on. Your weight remains intact!'"
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

/* Regional Dish Templates */
const REGIONAL_DISH_TEMPLATES = {
  kolkata: [
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
  ],
  bangalore: [
    { name: 'Meghana Special Chicken Biryani', cat: 'biryani', isVeg: false, basePrice: 340, baseCals: 1280, desc: 'Fiery Andhra-style spiced chicken pieces layered with aromatic basmati rice and rich spicy gravy.' },
    { name: 'Crispy Benne Masala Dosa with Chutneys & Sambar', cat: 'kebabs', isVeg: true, basePrice: 130, baseCals: 520, desc: 'Golden crust butter dosa loaded with spiced potato filling, served with fresh coconut chutney.' },
    { name: 'All-American Lamb Burger with Peri Peri Wedges', cat: 'continental', isVeg: false, basePrice: 390, baseCals: 1150, desc: 'Juicy chargrilled lamb patty topped with melted cheddar, gherkins, and smoked caramelized onions.' },
    { name: 'Woodfired BBQ Chicken & Jalapeno Pizza', cat: 'continental', isVeg: false, basePrice: 520, baseCals: 1320, desc: 'Thin-crust sourdough pizza blistered in a stone oven with smoky chicken, mozzarella, and jalapenos.' },
    { name: 'Nagarjuna Andhra Chilli Chicken (Dry)', cat: 'chinese', isVeg: false, basePrice: 310, baseCals: 740, desc: 'Classic fiery green chilli tossed chicken bites cooked with curry leaves and Andhra spices.' },
    { name: 'Empire Special Ghee Rice with Mutton Pepper Fry', cat: 'biryani', isVeg: false, basePrice: 360, baseCals: 1200, desc: 'Fragrant jeera samba rice tossed in pure desi ghee, served with crushed black pepper mutton.' },
    { name: 'CTR Golden Butter Masala Dosa', cat: 'kebabs', isVeg: true, basePrice: 120, baseCals: 490, desc: 'The legendary Malleshwaram crispy butter dosa served with hot mint and coconut chutneys.' },
    { name: 'Death By Chocolate (DBC) Sundae', cat: 'desserts', isVeg: true, basePrice: 240, baseCals: 920, desc: 'Warm Dutch chocolate cake smothered in vanilla ice cream, hot chocolate fudge, and roasted peanuts.' },
    { name: 'MTR Steamed Rava Idli with Potato Sagu', cat: 'kebabs', isVeg: true, basePrice: 110, baseCals: 380, desc: 'Semolina idli tempered with mustard, cashews, and curry leaves, served with pure ghee.' },
    { name: "Glen's Red Velvet Cupcake with Cream Cheese", cat: 'desserts', isVeg: true, basePrice: 140, baseCals: 460, desc: 'Velvety crimson sponge topped with luscious whipped cream cheese frosting.' }
  ],
  mumbai: [
    { name: 'Bastian Butter Poached Lobster Roll', cat: 'continental', isVeg: false, basePrice: 750, baseCals: 850, desc: 'Succulent fresh lobster tossed in clarified herb butter, tucked inside a toasted brioche roll.' },
    { name: 'Bademiya Mutton Seekh Kebab with Mint Dip', cat: 'kebabs', isVeg: false, basePrice: 340, baseCals: 680, desc: 'Charcoal-grilled minced mutton skewers infused with garlic, cumin, and ground spices.' },
    { name: 'Sardar Extra Butter Amul Pav Bhaji', cat: 'continental', isVeg: true, basePrice: 220, baseCals: 1150, desc: 'Slow-simmered spiced mashed vegetables swimming under a golden slab of melting Amul butter.' },
    { name: 'Britannia Classic Mutton Berry Pulao', cat: 'biryani', isVeg: false, basePrice: 580, baseCals: 1240, desc: 'Tender mutton layered with fragrant basmati, fried cashews, and imported tart Iranian zereshk berries.' },
    { name: "Joey's Meat Craver Deep Dish Pizza", cat: 'continental', isVeg: false, basePrice: 560, baseCals: 1450, desc: 'Heavyweight pan crust loaded with pepperoni, sausage, barbecue chicken, and three cheeses.' },
    { name: 'Kyani Bun Maska with Special Irani Chai', cat: 'desserts', isVeg: true, basePrice: 90, baseCals: 410, desc: 'Freshly baked soft bun lathered with creamy salted butter, paired with slow-brewed sweet Irani tea.' },
    { name: 'Gajalee Butter Garlic Crab (Mangalorean Style)', cat: 'continental', isVeg: false, basePrice: 850, baseCals: 980, desc: 'Whole mud crab tossed in silky garlic-infused butter sauce with freshly cracked black pepper.' },
    { name: 'Lucky Special Mutton Dum Biryani', cat: 'biryani', isVeg: false, basePrice: 380, baseCals: 1310, desc: 'Layered Mumbai-style dum biryani with marinated mutton, saffron milk, and crisp brown onions.' },
    { name: 'Theobroma Overload Brownie Slab', cat: 'desserts', isVeg: true, basePrice: 150, baseCals: 580, desc: 'Dense, fudgy dark chocolate brownie packed with melted Belgian chocolate chunks.' },
    { name: 'Colaba Crispy Chicken Baida Roti', cat: 'kebabs', isVeg: false, basePrice: 280, baseCals: 720, desc: 'Flaky pan-fried paratha parcel stuffed with spiced minced chicken, beaten egg, and coriander.' }
  ],
  delhi: [
    { name: "Karim's Royal Mutton Korma & Khamiri Roti", cat: 'biryani', isVeg: false, basePrice: 420, baseCals: 1380, desc: 'Heritage slow-braised mutton in deep onion, yogurt, and cardamom gravy, served with fluffy khamiri.' },
    { name: 'Gulati Original Butter Chicken (Murgh Makhani)', cat: 'biryani', isVeg: false, basePrice: 490, baseCals: 1260, desc: 'Clay-oven tandoori chicken simmered in rich satin tomato, cream, and fenugreek butter sauce.' },
    { name: 'Kake Da Dhaba Special Dahi Meat with Butter Naan', cat: 'biryani', isVeg: false, basePrice: 380, baseCals: 1190, desc: 'Hearty Delhi dhaba mutton curry slow-cooked with spiced whipped yogurt and whole spices.' },
    { name: 'Saravana Bhavan Special Ghee Roast Masala Dosa', cat: 'kebabs', isVeg: true, basePrice: 190, baseCals: 590, desc: 'Crispy paper-thin dosa roasted in pure cow ghee, served with four varieties of coconut chutneys.' },
    { name: 'Moti Mahal Classic Tandoori Murgh (Half)', cat: 'kebabs', isVeg: false, basePrice: 360, baseCals: 780, desc: 'Whole chicken steeped in Kashmiri chilli and yogurt marinade, roasted over smoking charcoal.' },
    { name: "Wenger's Classic Shamia Kebab & Chicken Patty", cat: 'continental', isVeg: false, basePrice: 210, baseCals: 540, desc: 'Colonial heritage bakery patties stuffed with spiced minced chicken and flaky puff pastry.' },
    { name: 'ITC Maurya Bukhara Dal Bukhara (18-Hour Slow Cook)', cat: 'biryani', isVeg: true, basePrice: 650, baseCals: 920, desc: 'Whole black lentils, tomatoes, ginger, and garlic simmered overnight over slow charcoal embers.' },
    { name: 'Rajinder Da Dhaba Creamy Malai Tikka', cat: 'kebabs', isVeg: false, basePrice: 320, baseCals: 850, desc: 'Juicy boneless chicken chunks marinated in heavy cream, cashew paste, green cardamom, and grilled.' },
    { name: 'Andhra Bhavan Unlimited South Indian Meals', cat: 'continental', isVeg: true, basePrice: 200, baseCals: 1050, desc: 'Unlimited hot rice, gunpowder podi, pure ghee, pappu, sambar, rasam, curds, and sweet payasam.' },
    { name: 'Natraj Famous Dahi Bhalla with Saunth Chutney', cat: 'desserts', isVeg: true, basePrice: 120, baseCals: 420, desc: 'Soft lentil dumplings soaked in sweet churned curd, topped with tangy dry ginger and cumin chutney.' }
  ]
};

/* City Key Detector */
function detectCityKey(userLoc) {
  const str = `${userLoc.name || ''} ${userLoc.city || ''} ${userLoc.locality || ''}`.toLowerCase();
  if (str.includes('bangalore') || str.includes('bengaluru') || str.includes('koramangala') || str.includes('indiranagar')) return 'bangalore';
  if (str.includes('mumbai') || str.includes('bombay') || str.includes('bandra') || str.includes('colaba') || str.includes('andheri')) return 'mumbai';
  if (str.includes('delhi') || str.includes('connaught') || str.includes('noida') || str.includes('gurgaon') || str.includes('daryaganj')) return 'delhi';
  if (str.includes('kolkata') || str.includes('calcutta') || str.includes('barakpur') || str.includes('barrackpore') || str.includes('howrah')) return 'kolkata';

  // Fallback: match by closest coordinates
  if (userLoc.lat && userLoc.lng) {
    const cityCoords = {
      kolkata: { lat: 22.5726, lng: 88.3639 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      mumbai: { lat: 19.0760, lng: 72.8777 },
      delhi: { lat: 28.6139, lng: 77.2090 }
    };
    let closestKey = 'kolkata';
    let minD = Infinity;
    for (const [key, coords] of Object.entries(cityCoords)) {
      const d = calculateHaversineDistance(userLoc.lat, userLoc.lng, coords.lat, coords.lng);
      if (d < minD) {
        minD = d;
        closestKey = key;
      }
    }
    return closestKey;
  }
  return 'kolkata';
}

/* 500+ Procedural Dish Generation Engine based on Active Restaurants & Regional Menus */
function generateDishesForRestaurants(restaurants, cityKey = 'kolkata') {
  const dishes = [];
  const templates = REGIONAL_DISH_TEMPLATES[cityKey] || REGIONAL_DISH_TEMPLATES.kolkata;
  const descriptors = ['Grand', 'Signature', 'Royal', 'Authentic', 'Crispy', 'Smoky', 'Velvet', 'Midnight', 'Supreme', 'Tandoori', 'Zero-Calorie', 'Phantom'];

  let idCounter = 1;

  for (const rest of restaurants) {
    for (let i = 0; i < 50; i++) {
      const template = templates[i % templates.length];
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
        price: Math.max(120, template.basePrice + priceVariation),
        calories: Math.max(380, template.baseCals + calVariation),
        bestseller: (i % 6 === 0),
        customizable: (i % 3 === 0),
        desc: `${template.desc} Prepared at ${rest.name}, safely prevented from reaching your doorstep.`,
        addons: [
          { id: `addon-${dishId}-1`, name: 'Extra Special Portion & Egg', calories: 260, price: 50 },
          { id: `addon-${dishId}-2`, name: 'Rider Cutting Chai & Samosa', calories: 290, price: 35 }
        ]
      });

      idCounter++;
    }
  }

  return dishes;
}

/* Active State Arrays */
let RESTAURANTS = [...CITY_RESTAURANTS.kolkata];
let DISHES = generateDishesForRestaurants(RESTAURANTS, 'kolkata');

/* Dynamic Location-Based Restaurant Updater */
function updateLocationRestaurants(userLoc) {
  const cityKey = detectCityKey(userLoc);
  const baseRests = CITY_RESTAURANTS[cityKey] || CITY_RESTAURANTS.kolkata;

  // Compute real geodesic distance for each restaurant from user's current GPS / detected coordinates
  const computedRests = baseRests.map(r => {
    const rawDist = calculateHaversineDistance(userLoc.lat, userLoc.lng, r.lat, r.lng);
    const distKm = Math.max(0.8, rawDist).toFixed(1);
    return {
      ...r,
      distanceValue: parseFloat(distKm),
      distance: `${distKm} km from ${userLoc.locality || userLoc.city || 'you'} (Rider Stalled)`
    };
  });

  // Sort by nearest first
  computedRests.sort((a, b) => a.distanceValue - b.distanceValue);

  RESTAURANTS = computedRests;
  DISHES = generateDishesForRestaurants(RESTAURANTS, cityKey);
  return RESTAURANTS;
}

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
  "Rider ordered 2nd cutting chai with extra ginger.",
  "Rider is passionately debating the local cricket match at the pan shop.",
  "Rider spotted an old school friend at the tea stall and pulled up a wooden bench.",
  "GPS speed reading: 0.00 km/h (engine switched off for cooling).",
  "Rider ordered a plate of hot samosas with tangy tamarind chutney.",
  "Rider is checking WhatsApp group messages about local weather.",
  "Rider has initiated chai cup #4. No rush whatsoever.",
  "Satellite lock confirms rider has entered deep philosophical contemplation."
];

const LIVE_NOTIFICATIONS = [
  { name: "Subhash from Barrackpore", action: "intercepted 1,350 kcal of Dada Boudi Special Mutton Biryani!" },
  { name: "Debolina from Park Street", action: "donated ₹100 to The Smileys Foundation! 💛" },
  { name: "Sourav from Indiranagar", action: "spared 1,280 kcal of Meghana Special Biryani!" },
  { name: "Ananya from Bandra", action: "earned 350 FNC Karma points!" },
  { name: "Priyanka from Connaught Place", action: "pledged ₹250 for rural student schoolbooks! 📚" },
  { name: "Anirban from Kolkata", action: "dodged midnight Arsalan Mutton Chaap cravings!" }
];

if (typeof window !== 'undefined') {
  window.RESTAURANTS = RESTAURANTS;
  window.DISHES = DISHES;
  window.CITY_RESTAURANTS = CITY_RESTAURANTS;
  window.DELIVERY_RIDERS = DELIVERY_RIDERS;
  window.CATEGORIES = CATEGORIES;
  window.calculateHaversineDistance = calculateHaversineDistance;
  window.updateLocationRestaurants = updateLocationRestaurants;
} else if (typeof global !== 'undefined') {
  global.RESTAURANTS = RESTAURANTS;
  global.DISHES = DISHES;
  global.CITY_RESTAURANTS = CITY_RESTAURANTS;
  global.DELIVERY_RIDERS = DELIVERY_RIDERS;
  global.CATEGORIES = CATEGORIES;
  global.calculateHaversineDistance = calculateHaversineDistance;
  global.updateLocationRestaurants = updateLocationRestaurants;
}
