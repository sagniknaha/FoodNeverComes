// Food Never Comes (FNC) — Full-Stack Server & REST API
// Built with Node.js 24 Native SQLite & HTTP Server

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const dbManager = require('./db/database');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper: parse JSON request body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  /* ==========================================================
     REST API ROUTES (/api/*)
     ========================================================== */
  if (pathname.startsWith('/api/')) {
    try {
      // 1. GET /api/stats
      if (method === 'GET' && pathname === '/api/stats') {
        const stats = dbManager.getGlobalStats();
        return sendJson(res, 200, { success: true, data: stats });
      }

      // 2. GET /api/restaurants
      if (method === 'GET' && pathname === '/api/restaurants') {
        const restaurants = dbManager.getRestaurants();
        return sendJson(res, 200, { success: true, count: restaurants.length, data: restaurants });
      }

      // 3. GET /api/dishes
      if (method === 'GET' && pathname === '/api/dishes') {
        const { category, restaurantId, isVeg, search, sortBy, page, limit } = parsedUrl.query;
        const result = dbManager.getDishes({
          category,
          restaurantId,
          isVeg,
          search,
          sortBy,
          page: Number(page) || 1,
          limit: Number(limit) || 24
        });
        return sendJson(res, 200, { success: true, ...result });
      }

      // 4. POST /api/orders (Create Phantom Order)
      if (method === 'POST' && pathname === '/api/orders') {
        const body = await parseJsonBody(req);
        const orderResult = dbManager.createOrder(body);
        return sendJson(res, 201, orderResult);
      }

      // 5. GET /api/orders (List Past Orders)
      if (method === 'GET' && pathname === '/api/orders') {
        const limit = Number(parsedUrl.query.limit) || 20;
        const orders = dbManager.getOrders(limit);
        return sendJson(res, 200, { success: true, count: orders.length, data: orders });
      }

      // 6. POST /api/donations (Record Smileys NGO Donation)
      if (method === 'POST' && pathname === '/api/donations') {
        const body = await parseJsonBody(req);
        if (!body.amount || body.amount <= 0) {
          return sendJson(res, 400, { success: false, error: 'Valid donation amount required' });
        }
        const donResult = dbManager.recordDonation(body);
        return sendJson(res, 201, donResult);
      }

      // 7. GET /api/donations/:certOrId (Fetch 80G Certificate / Donation)
      if (method === 'GET' && pathname.startsWith('/api/donations/')) {
        const certOrId = pathname.replace('/api/donations/', '').trim();
        const don = dbManager.getDonationByCert(certOrId);
        if (!don) {
          return sendJson(res, 404, { success: false, error: 'Donation or Certificate not found' });
        }
        return sendJson(res, 200, { success: true, data: don });
      }

      // 8. GET /api/leaderboard (1,000+ Patrons)
      if (method === 'GET' && pathname === '/api/leaderboard') {
        const { filter, search, page, limit } = parsedUrl.query;
        const result = dbManager.getLeaderboard({
          filter: filter || 'all',
          search: search || '',
          page: Number(page) || 1,
          limit: Number(limit) || 50
        });
        return sendJson(res, 200, { success: true, ...result });
      }

      // 9. POST /api/newsletter (Subscribe)
      if (method === 'POST' && pathname === '/api/newsletter') {
        const body = await parseJsonBody(req);
        if (!body.email || !body.email.includes('@')) {
          return sendJson(res, 400, { success: false, error: 'Valid email address required' });
        }
        const subResult = dbManager.addSubscriber(body.email);
        return sendJson(res, 200, subResult);
      }

      // 10. GET /api/razorpay/config (Fetch Razorpay Key ID & Beneficiary UPI ID)
      if (method === 'GET' && pathname === '/api/razorpay/config') {
        const keyId = process.env.RAZORPAY_KEY_ID || null;
        return sendJson(res, 200, {
          success: true,
          keyId: keyId,
          receiverUpi: '9874958471@superyes',
          merchantName: 'The Smileys Foundation',
          hasServerKey: Boolean(keyId)
        });
      }

      // 11. POST /api/razorpay/create-order (Create Razorpay Order for Donation)
      if (method === 'POST' && pathname === '/api/razorpay/create-order') {
        const body = await parseJsonBody(req);
        const amount = Number(body.amount) || 100;
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (keyId && keySecret) {
          try {
            const https = require('https');
            const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
            const postData = JSON.stringify({
              amount: Math.round(amount * 100),
              currency: 'INR',
              receipt: `rcpt_${Date.now()}`,
              notes: {
                receiver_upi: '9874958471@superyes',
                beneficiary: 'The Smileys Foundation'
              }
            });

            const rzpReq = https.request({
              hostname: 'api.razorpay.com',
              path: '/v1/orders',
              method: 'POST',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
              }
            }, (rzpRes) => {
              let rzpBody = '';
              rzpRes.on('data', chunk => rzpBody += chunk);
              rzpRes.on('end', () => {
                try {
                  const parsed = JSON.parse(rzpBody);
                  return sendJson(res, rzpRes.statusCode || 200, {
                    success: true,
                    order: parsed,
                    keyId: keyId,
                    receiverUpi: '9874958471@superyes'
                  });
                } catch (e) {
                  return sendJson(res, 200, {
                    success: true,
                    orderId: `order_sim_${Date.now()}`,
                    keyId: keyId,
                    receiverUpi: '9874958471@superyes'
                  });
                }
              });
            });

            rzpReq.on('error', (err) => {
              console.warn('Razorpay API error, returning simulated order:', err.message);
              return sendJson(res, 200, {
                success: true,
                orderId: `order_sim_${Date.now()}`,
                keyId: keyId,
                receiverUpi: '9874958471@superyes'
              });
            });

            rzpReq.write(postData);
            rzpReq.end();
            return;
          } catch (e) {
            console.error('Razorpay order creation error:', e);
          }
        }

        return sendJson(res, 200, {
          success: true,
          orderId: `order_sim_${Date.now()}`,
          keyId: keyId || null,
          receiverUpi: '9874958471@superyes',
          notes: 'No server-side RAZORPAY_KEY_ID configured; client-key or direct UPI active'
        });
      }

      // Unknown API endpoint
      return sendJson(res, 404, { success: false, error: `API endpoint ${pathname} not found` });

    } catch (apiErr) {
      console.error('API Error:', apiErr);
      return sendJson(res, 500, { success: false, error: apiErr.message || 'Internal Server Error' });
    }
  }

  /* ==========================================================
     STATIC FILE SERVING
     ========================================================== */
  let reqPath = decodeURIComponent(pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(ROOT, reqPath);

  // Security check: ensure filePath is within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Food Never Comes full-stack server running at http://localhost:${PORT}/`);
  console.log(`📊 REST API ready at http://localhost:${PORT}/api/stats`);
  console.log(`Preview screen directly at http://localhost:${PORT}/screens/Food_Never_Comes_Razorpay_Checkout_Smileys_NGO_Animated_Leaderboard_34f075bc.html`);
});
