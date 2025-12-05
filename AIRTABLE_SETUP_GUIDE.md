# 🐟 Kerala Fresh Fish - Airtable Integration Setup Guide

## 📋 Overview
Your code is **already integrated** with Airtable! You just need to set up the Airtable base and connect it. This guide will walk you through everything step-by-step.

---

## 🎯 What Your System Does

When a customer places an order on your website, the system automatically:
1. ✅ **Saves order to Airtable** (main order record)
2. ✅ **Saves each fish item** (linked to the order)
3. ✅ **Sends confirmation email** with PDF invoice
4. ✅ **Sends WhatsApp notification** (if configured)

---

## 📊 STEP 1: Create Your Airtable Base

### Option A: Use This Prompt with an AI Agent (RECOMMENDED)

Copy this prompt and use it with an AI that can access Airtable or help you create the structure:

```
I need help setting up an Airtable base for a fish wholesale order management system. 

Create a base called "Kerala Fresh Fish Orders" with TWO tables:

TABLE 1: "Orders"
Fields:
- Customer Name (Single line text)
- Company Name (Single line text)
- Email (Email)
- Phone (Phone number)
- Address (Long text)
- Total Weight (Number, 2 decimal precision, format: "0.00 kg")
- Total Price (Currency, GBP £)
- Tier Applied (Single select, options: "Tier 1: £0.00-£10.00/kg", "Tier 2: £10.01-£20.00/kg", "Tier 3: £20.01+/kg")
- Order JSON (Long text) - for backup
- Created Time (Created time)
- Order Items (Link to Order Items table - one to many)

TABLE 2: "Order Items"
Fields:
- Order Link (Link to Orders table - many to one)
- Product Name (Single line text) - e.g., "King Fish", "Prawns"
- Code (Single line text) - e.g., "KF-001"
- Preparation (Single select, options: "Fresh - Whole", "Cleaned", "Skinned", "Filleted", "Steaks")
- Packaging (Single select, options: "Bulk", "Retail Ready", "Vacuum Sealed")
- Quantity KG (Number, 2 decimal precision)
- Price Per KG (Currency, GBP £)
- Line Total (Currency, GBP £)
- Created Time (Created time)

Set up the relationship so that:
- One Order can have many Order Items
- Each Order Item links to one Order
```

### Option B: Manual Setup (Step-by-Step)

1. **Go to Airtable**: https://airtable.com
2. **Sign up/Login** (free account is fine)
3. **Create a new base** called "Kerala Fresh Fish Orders"
4. **Create Table 1: "Orders"**
   - Click "Add or import" → "Create empty table"
   - Name it: `Orders`
   - Add these fields:

   | Field Name | Field Type | Options |
   |------------|-----------|---------|
   | Customer Name | Single line text | - |
   | Company Name | Single line text | - |
   | Email | Email | - |
   | Phone | Phone number | - |
   | Address | Long text | - |
   | Total Weight | Number | 2 decimals, suffix " kg" |
   | Total Price | Currency | GBP (£) |
   | Tier Applied | Single select | Options below* |
   | Order JSON | Long text | - |
   | Created Time | Created time | - |

   *Tier Applied options:
   - `Silver Tier (100-249 kg)`
   - `Gold Tier (250-499 kg)`
   - `Platinum Tier (500-999 kg)`
   - `Diamond Tier (1000+ kg)`

5. **Create Table 2: "Order Items"**
   - Click "+" to add new table
   - Name it: `Order Items`
   - Add these fields:

   | Field Name | Field Type | Options |
   |------------|-----------|---------|
   | Product Name | Single line text | - |
   | Code | Single line text | - |
   | Preparation | Single select | See below** |
   | Packaging | Single select | See below*** |
   | Quantity KG | Number | 2 decimals |
   | Price Per KG | Currency | GBP (£) |
   | Line Total | Currency | GBP (£) |
   | Created Time | Created time | - |

   **Preparation options:
   - `Fresh - Whole`
   - `Cleaned`
   - `Skinned`
   - `Filleted`
   - `Steaks`

   ***Packaging options:
   - `Bulk`
   - `Retail Ready`
   - `Vacuum Sealed`

6. **Link the Tables**
   - In the "Order Items" table, add a new field
   - Field type: "Link to another record"
   - Choose: "Orders" table
   - Name it: `Order Link`
   - This creates a relationship between orders and items

---

## 🔑 STEP 2: Get Your Airtable Credentials

### Get Your Base ID:
1. Open your Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. Copy the part that starts with `app` (e.g., `appABc123dEfGhijk`)
4. This is your **AIRTABLE_BASE_ID**

### Get Your Personal Access Token (PAT):
1. Go to: https://airtable.com/create/tokens
2. Click "Create new token"
3. Give it a name: "Kerala Fish Orders API"
4. Add these scopes:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
5. Add access to your base:
   - Click "Add a base"
   - Select "Kerala Fresh Fish Orders"
6. Click "Create token"
7. **COPY THE TOKEN** (you won't see it again!)
8. This is your **AIRTABLE_PAT**

---

## ⚙️ STEP 3: Configure Your Website

Edit your `.env.local` file and update these lines:

```bash
AIRTABLE_BASE_ID=appYourBaseIdHere
AIRTABLE_PAT=patYourTokenHere.1234567890abcdef
```

Replace with your actual credentials from Step 2.

---

## 🧪 STEP 4: Test Your Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Place a test order** on your website:
   - Go to http://localhost:3000
   - Add some fish to cart
   - Complete the checkout form
   - Submit order

3. **Check Airtable:**
   - Go to your Airtable base
   - Check the "Orders" table → should have 1 new record
   - Check the "Order Items" table → should have multiple items linked to that order

4. **Check your terminal logs:**
   ```
   ✅ Order saved to Airtable: rec123abc456
   ✅ Order items saved to Airtable: 3 items
   ✅ Email sent successfully to: customer@email.com
   ✅ Invoice PDF generated: INV-20251205-1234
   ```

---

## 📊 OPTIONAL: Add Sample Fish Data to Airtable

If you want to store your **product catalog** in Airtable too (currently it's in your code), you can create a third table:

**TABLE 3: "Products"**
Fields:
- English Name (Single line text) - "King Fish"
- Malayalam Name (Single line text) - "നെയ്മീൻ"
- Code (Single line text) - "KF-001"
- Base Price (Currency, GBP £)
- Available (Checkbox)
- Image URL (URL)
- Description (Long text)

Then use Airtable API to **fetch products** instead of hardcoding them. This makes it easier to:
- Add new fish without coding
- Update prices
- Enable/disable products
- Manage inventory

---

## 🎨 Example: What Your Airtable Will Look Like

### Orders Table:
| Customer Name | Company Name | Email | Total Weight | Total Price | Tier Applied | Order Items |
|---------------|--------------|-------|--------------|-------------|--------------|-------------|
| John Smith | Smith Seafood Ltd | john@smith.com | 45.50 kg | £687.50 | Tier 2 | 🔗 3 items |
| Mary Johnson | Ocean Fresh | mary@ocean.com | 120.00 kg | £2,400.00 | Tier 3 | 🔗 5 items |

### Order Items Table:
| Order Link | Product Name | Preparation | Quantity KG | Price Per KG | Line Total |
|------------|--------------|-------------|-------------|--------------|------------|
| 🔗 Order #1 | King Fish | Filleted | 15.00 | £18.00 | £270.00 |
| 🔗 Order #1 | Prawns | Cleaned | 10.50 | £22.00 | £231.00 |
| 🔗 Order #1 | Salmon | Fresh - Whole | 20.00 | £9.35 | £187.00 |

---

## 🚨 Troubleshooting

### Issue: "Orders not saving to Airtable"
**Check:**
1. Are your credentials in `.env.local` correct?
2. Did you restart the dev server after updating `.env.local`?
3. Check browser console and terminal for error messages
4. Verify table names are EXACTLY: "Orders" and "Order Items"

### Issue: "401 Unauthorized"
- Your PAT token is wrong or expired
- Create a new token and update `.env.local`

### Issue: "404 Not Found"
- Your Base ID is wrong
- Double-check the URL in Airtable

### Issue: "Field name doesn't exist"
- Your field names in Airtable don't match the code
- Field names are case-sensitive!

---

## 🎯 What Happens Now?

Every time a customer places an order:

1. **Airtable** → New order record + linked items
2. **Email** → Customer receives beautiful HTML email with PDF invoice
3. **You** → Get BCC copy of email + can view all orders in Airtable
4. **Reports** → Use Airtable's built-in charts/views to analyze sales

---

## 📈 Next Level Features

Once basic setup is working, you can:
- **Airtable Automations**: Send yourself Slack/Email when new order arrives
- **Views**: Create filtered views (Today's Orders, High Value Orders, etc.)
- **Forms**: Create Airtable forms for manual order entry
- **Sync**: Connect to other tools (Zapier, Make.com)
- **Mobile App**: Use Airtable mobile app to manage orders on-the-go

---

## 🆘 Need Help?

Your current code location:
- **Airtable Integration**: `app/api/submit-order/route.ts` (lines 14-75)
- **Environment Variables**: `.env.local`

If something doesn't work, check the terminal logs after placing a test order - it will show exactly where the error is.

---

**Remember:** Your code is ALREADY set up! You just need to:
1. ✅ Create the Airtable base with correct tables/fields
2. ✅ Get your Base ID and PAT
3. ✅ Update `.env.local`
4. ✅ Restart server
5. ✅ Test with an order

Good luck! 🚀🐟
