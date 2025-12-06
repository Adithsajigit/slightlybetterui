const http = require('http');
const fs = require('fs');
const path = require('path');

// Read and parse the data.ts file to get products
const dataPath = path.join(__dirname, 'data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf-8');

// Extract products array using regex - simplified approach
// We'll import it differently

// Configuration
const NUM_ORDERS = 100;
const API_URL = 'http://localhost:3000/api/submit-order';

// Sample customer data
const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer', 'William', 'Patricia', 'Richard', 'Linda', 'Thomas', 'Charles', 'Barbara', 'Christopher'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore'];
const companies = ['Fresh Foods Co', 'Seafood Traders', 'Coastal Imports', 'Ocean Harvest', 'Gourmet Supply', 'Premium Catch', 'Trade Merchants', 'Fisheries Ltd', 'Wholesale Distributors', 'Marine Products', 'Fish Market Pro', 'Aquatic Solutions'];

// Sample fish products (extracted from data.ts pattern)
const sampleProducts = [
  { name: 'Anchovy', code: '01/CL/TH/1', prices: { Diamond: 8.51, Platinum: 8.88, Gold: 9.25, Silver: 9.62 } },
  { name: 'Barramundi', code: '02/WH/TH/2', prices: { Diamond: 9.49, Platinum: 9.90, Gold: 10.31, Silver: 10.73 } },
  { name: 'Black Pomfret', code: '03/WH/TH/1', prices: { Diamond: 7.80, Platinum: 8.13, Gold: 8.47, Silver: 8.80 } },
  { name: 'Crevalle Jack', code: '04/SK/TH/1', prices: { Diamond: 4.95, Platinum: 5.16, Gold: 5.37, Silver: 5.58 } },
  { name: 'Dory', code: '05/FI/TH/1', prices: { Diamond: 12.50, Platinum: 13.03, Gold: 13.56, Silver: 14.09 } },
  { name: 'Emperors', code: '06/WH/TH/1', prices: { Diamond: 8.47, Platinum: 8.83, Gold: 9.19, Silver: 9.55 } },
  { name: 'Flounder', code: '07/CL/TH/1', prices: { Diamond: 6.05, Platinum: 6.30, Gold: 6.56, Silver: 6.81 } },
  { name: 'Grouper', code: '08/ST/TH/1', prices: { Diamond: 14.95, Platinum: 15.58, Gold: 16.21, Silver: 16.84 } },
  { name: 'Horse Mackerel', code: '09/WH/TH/1', prices: { Diamond: 3.95, Platinum: 4.12, Gold: 4.28, Silver: 4.45 } },
  { name: 'Indian Mackerel', code: '10/WH/TH/1', prices: { Diamond: 4.50, Platinum: 4.69, Gold: 4.88, Silver: 5.07 } },
  { name: 'King Prawns', code: '11/WH/TH/1', prices: { Diamond: 22.95, Platinum: 23.92, Gold: 24.90, Silver: 25.88 } },
  { name: 'Leather Jacket', code: '12/CL/TH/1', prices: { Diamond: 6.95, Platinum: 7.24, Gold: 7.53, Silver: 7.82 } },
  { name: 'Mackerel', code: '13/WH/TH/1', prices: { Diamond: 5.95, Platinum: 6.20, Gold: 6.45, Silver: 6.70 } },
  { name: 'Mullet', code: '14/WH/TH/1', prices: { Diamond: 4.95, Platinum: 5.16, Gold: 5.37, Silver: 5.58 } },
  { name: 'Needlefish', code: '15/WH/TH/1', prices: { Diamond: 3.50, Platinum: 3.65, Gold: 3.80, Silver: 3.95 } },
];

// Helper to calculate tier
function calculateTier(totalWeight) {
  if (totalWeight >= 1000) return 'Diamond';
  if (totalWeight >= 500) return 'Platinum';
  if (totalWeight >= 250) return 'Gold';
  if (totalWeight >= 100) return 'Silver';
  return 'Base';
}

// Helper to get price for tier
function getPrice(product, tier) {
  return product.prices[tier] || product.prices['Silver'];
}

// Generate random customer
function generateCustomer() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const randomNum = Math.floor(Math.random() * 10000);

  return {
    name: `${firstName} ${lastName}`,
    companyName: `${company} ${randomNum}`,
    email: `customer${randomNum}@example.com`,
    phone: `+44${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    address: `${Math.floor(Math.random() * 999) + 1} Market Street, London, UK`
  };
}

// Generate random order with varied products
function generateOrder() {
  const customer = generateCustomer();
  
  // Random number of items (3-8)
  const numItems = Math.floor(Math.random() * 6) + 3;
  
  // Randomly select products
  const selectedProducts = [];
  for (let i = 0; i < numItems; i++) {
    selectedProducts.push(sampleProducts[Math.floor(Math.random() * sampleProducts.length)]);
  }

  // Build cart items with random quantities
  const items = selectedProducts.map(product => {
    // Random quantity between 5-50 kg
    const quantity = Math.floor(Math.random() * 46) + 5;
    
    return {
      product: {
        code: product.code,
        englishName: product.name,
        preparation: 'Whole',
        packaging: 'Thermal Box'
      },
      quantity,
      price: 0,
      lineTotal: 0
    };
  });

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Determine tier
  const tier = calculateTier(totalWeight);

  // Update prices based on tier
  items.forEach(item => {
    const product = sampleProducts.find(p => p.code === item.product.code);
    if (product) {
      item.price = getPrice(product, tier);
      item.lineTotal = item.price * item.quantity;
    }
  });

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const summary = {
    items,
    totalWeight,
    subtotal,
    tier
  };

  return { summary, customer };
}

// Send order to API
function sendOrder(orderData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(orderData);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/submit-order',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Main function
async function generateDummyOrders() {
  console.log(`\n🎯 Starting generation of ${NUM_ORDERS} dummy orders...\n`);

  let successCount = 0;
  let failureCount = 0;
  const startTime = Date.now();

  for (let i = 1; i <= NUM_ORDERS; i++) {
    try {
      const orderData = generateOrder();
      
      console.log(`📦 Order ${i}/${NUM_ORDERS}: ${orderData.customer.name} - ${orderData.summary.tier} tier (${orderData.summary.totalWeight.toFixed(1)} kg)`);
      
      await sendOrder(orderData);
      
      successCount++;
      console.log(`   ✅ Successfully submitted`);

      // Add small delay between requests
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      failureCount++;
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✨ Complete!\n`);
  console.log(`📊 Results:`);
  console.log(`   ✅ Successful: ${successCount}/${NUM_ORDERS}`);
  console.log(`   ❌ Failed: ${failureCount}/${NUM_ORDERS}`);
  console.log(`   ⏱️  Time taken: ${duration}s\n`);
}

generateDummyOrders().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
