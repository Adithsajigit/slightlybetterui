import { products } from './data';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';

// Configuration
const API_URL = 'http://localhost:3000/api/submit-order';
const NUM_ORDERS = 100;

// Sample customer data
const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer', 'William', 'Patricia', 'Richard', 'Linda', 'Thomas'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
const companies = ['Fresh Foods Co', 'Seafood Traders', 'Coastal Imports', 'Ocean Harvest', 'Gourmet Supply', 'Premium Catch', 'Trade Merchants', 'Fisheries Ltd', 'Wholesale Distributors', 'Marine Products'];

interface CartItem {
  product: typeof products[0];
  quantity: number;
  price: number;
  lineTotal: number;
}

interface CartSummary {
  items: CartItem[];
  totalWeight: number;
  subtotal: number;
  tier: string;
}

interface Customer {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
}

// Helper to calculate tier
function calculateTier(totalWeight: number): string {
  if (totalWeight >= 1000) return 'Diamond';
  if (totalWeight >= 500) return 'Platinum';
  if (totalWeight >= 250) return 'Gold';
  if (totalWeight >= 100) return 'Silver';
  return 'Base';
}

// Helper to get price for tier
function getPrice(product: typeof products[0], tier: string): number {
  switch (tier) {
    case 'Diamond': return product.priceDiamond;
    case 'Platinum': return product.pricePlatinum;
    case 'Gold': return product.priceGold;
    case 'Silver': return product.priceSilver;
    default: return product.priceSilver;
  }
}

// Generate random customer
function generateCustomer(): Customer {
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
function generateOrder(): { summary: CartSummary; customer: Customer } {
  const customer = generateCustomer();
  
  // Random number of items (3-12)
  const numItems = Math.floor(Math.random() * 10) + 3;
  
  // Randomly select products, ensuring we get some variety
  const selectedProducts: typeof products[0][] = [];
  for (let i = 0; i < numItems; i++) {
    selectedProducts.push(products[Math.floor(Math.random() * products.length)]);
  }

  // Build cart items with random quantities
  const items: CartItem[] = selectedProducts.map(product => {
    // Random quantity between 5-50 kg
    const quantity = Math.floor(Math.random() * 46) + 5;
    
    // We'll calculate price after tier is determined
    return {
      product,
      quantity,
      price: 0, // Will be updated after tier calculation
      lineTotal: 0 // Will be updated after tier calculation
    };
  });

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Determine tier
  const tier = calculateTier(totalWeight);

  // Update prices based on tier
  items.forEach(item => {
    item.price = getPrice(item.product, tier);
    item.lineTotal = item.price * item.quantity;
  });

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const summary: CartSummary = {
    items,
    totalWeight,
    subtotal,
    tier
  };

  return { summary, customer };
}

// Send order to API
function sendOrder(orderData: { summary: CartSummary; customer: Customer }): Promise<void> {
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

      // Add small delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      failureCount++;
      console.log(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
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
