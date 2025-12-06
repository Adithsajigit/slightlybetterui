# Dummy Order Generator

This tool generates realistic dummy orders to populate your Airtable with test data for analytics and development.

## What It Does

- Generates **100 orders** (configurable)
- Creates random customers with realistic names and companies
- Assigns 3-8 random fish products per order
- Automatically calculates pricing tiers (Base, Silver, Gold, Platinum, Diamond)
- Sends orders through your `/api/submit-order` endpoint
- Logs progress and results

## Requirements

Your Next.js development server must be running:
```bash
npm run dev
```

## How to Use

### Option 1: Using Node.js (Easiest)

1. **Ensure your Next.js server is running** in a terminal:
   ```bash
   npm run dev
   ```

2. **In another terminal, run the generator**:
   ```bash
   node generate-dummy-orders.js
   ```

That's it! The script will:
- Generate 100 orders
- Send them to your local API
- Show progress in real-time
- Display results when complete

### Option 2: Using npx (If you want to run it directly)

Add this to your `package.json` scripts section:
```json
"scripts": {
  "generate-orders": "node generate-dummy-orders.js"
}
```

Then run:
```bash
npm run generate-orders
```

## Customization

To change the number of orders, edit `generate-dummy-orders.js` and change this line:
```javascript
const NUM_ORDERS = 100;  // Change this number
```

## What Gets Created

Each order includes:
- **Random Customer**: Name, company, email, phone, address
- **Multiple Products**: 3-8 fish items per order
- **Random Quantities**: 5-50 kg per product
- **Automatic Tier Calculation**: Based on total weight
- **Correct Pricing**: Prices adjust based on tier
- **Email Confirmation**: Sent to dummy email
- **PDF Invoice**: Generated (stored on server)
- **Airtable Records**: Orders table + Order Items linked records

## Expected Output

```
🎯 Starting generation of 100 dummy orders...

📦 Order 1/100: John Smith - Gold tier (312.5 kg)
   ✅ Successfully submitted
📦 Order 2/100: Sarah Johnson - Silver tier (145.3 kg)
   ✅ Successfully submitted
...

✨ Complete!

📊 Results:
   ✅ Successful: 98/100
   ❌ Failed: 2/100
   ⏱️  Time taken: 45.23s
```

## Troubleshooting

**"Connection refused" error?**
- Make sure your Next.js server is running: `npm run dev`
- Check it's running on port 3000

**"HTTP 500" errors?**
- Check your `.env.local` has correct Airtable credentials
- Check your Airtable base ID and PAT token are valid
- Look at server logs in the `npm run dev` terminal

**Want to stop early?**
- Press `Ctrl+C` in the terminal running the script

## After Generation

Check your Airtable:
1. Go to your Orders table - should have ~100 new records
2. Go to your Order Items table - should have ~400-800 linked items
3. Use these for testing analytics and dashboards!

---

**Tips:**
- Start with `const NUM_ORDERS = 10` to test before generating 100
- Check your Airtable rate limits (they're generous for test data)
- Emails are dummy so they won't actually send (check your backend logs)
