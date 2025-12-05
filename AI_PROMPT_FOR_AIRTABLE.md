# 🤖 AI Prompt for Airtable Setup

## Copy this entire prompt and use it with Claude, ChatGPT, or any AI assistant that can help you set up Airtable:

---

## PROMPT START ⬇️

I need help setting up an Airtable base for my Kerala Fresh Fish wholesale business. This is an order management system for tracking customer orders of fresh seafood.

### REQUIREMENTS:

**Create a new Airtable base called:** "Kerala Fresh Fish Orders"

**Create TWO tables with the following exact specifications:**

---

### TABLE 1: "Orders"

This table stores the main order records from customers.

**Fields to create:**

1. **Customer Name**
   - Type: Single line text
   - Description: Full name of the person placing the order

2. **Company Name**
   - Type: Single line text
   - Description: Business/company name of the customer

3. **Email**
   - Type: Email
   - Description: Customer's email address for order confirmation

4. **Phone**
   - Type: Phone number
   - Description: Customer's contact number

5. **Address**
   - Type: Long text
   - Description: Full delivery address including street, city, postal code

6. **Total Weight**
   - Type: Number
   - Precision: 2 decimal places
   - Allow negative numbers: No
   - Format: Show as "0.00 kg" (add suffix " kg")
   - Description: Total weight of all fish in the order

7. **Total Price**
   - Type: Currency
   - Format: Pound Sterling (GBP £)
   - Precision: 2 decimal places
   - Description: Final total price for the entire order

8. **Tier Applied**
   - Type: Single select
   - Options to add:
     * Silver Tier (100-249 kg)
     * Gold Tier (250-499 kg)
     * Platinum Tier (500-999 kg)
     * Diamond Tier (1000+ kg)
   - Description: Pricing tier based on order volume (higher tier = lower prices)

9. **Order JSON**
   - Type: Long text
   - Description: Backup JSON data of the complete order

10. **Created Time**
    - Type: Created time
    - Format: Local (Date and time)
    - Description: Automatically records when order was placed

11. **Order Items**
    - Type: Link to another record
    - Link to: "Order Items" table
    - Relationship: Allow linking to multiple records
    - Description: Links to all fish items in this order

---

### TABLE 2: "Order Items"

This table stores individual fish products within each order.

**Fields to create:**

1. **Order Link**
   - Type: Link to another record
   - Link to: "Orders" table
   - Relationship: Allow linking to multiple records
   - Description: Links back to the parent order

2. **Product Name**
   - Type: Single line text
   - Description: English name of the fish (e.g., "King Fish", "Prawns", "Salmon")

3. **Code**
   - Type: Single line text
   - Description: Product SKU/code (e.g., "16/CL/TH/1")

4. **Preparation**
   - Type: Single select
   - Options to add:
     * Fresh - Whole
     * Cleaned
     * Skinned
     * Filleted
     * Steaks
   - Description: How the fish is prepared

5. **Packaging**
   - Type: Single select
   - Options to add:
     * Bulk
     * Retail Ready
     * Vacuum Sealed
   - Description: Packaging type for the fish

6. **Quantity KG**
   - Type: Number
   - Precision: 2 decimal places
   - Allow negative numbers: No
   - Description: Weight of this specific fish item in kilograms

7. **Price Per KG**
   - Type: Currency
   - Format: Pound Sterling (GBP £)
   - Precision: 2 decimal places
   - Description: Price per kilogram for this fish

8. **Line Total**
   - Type: Currency
   - Format: Pound Sterling (GBP £)
   - Precision: 2 decimal places
   - Description: Total price for this line item (Quantity × Price Per KG)

9. **Created Time**
   - Type: Created time
   - Format: Local (Date and time)
   - Description: Automatically records when item was added

---

### RELATIONSHIP SETUP:

- **One Order** can have **many Order Items** (one-to-many relationship)
- **Each Order Item** belongs to **one Order** (many-to-one relationship)
- The "Order Items" field in Orders table automatically links to "Order Link" field in Order Items table

---

### SAMPLE DATA TO ADD:

Please add 4 sample orders to demonstrate the system:

**Sample Order 1:**
- Customer Name: John Smith
- Company Name: Smith Seafood Ltd
- Email: john@smithseafood.com
- Phone: +44 7700 900000
- Address: 123 Fish Street, London, SW1A 1AA
- Total Weight: 45.50 kg
- Total Price: £687.50
- Tier Applied: Silver Tier (100-249 kg)

Order Items:
1. Product: King Fish, Code: 16/CL/TH/1, Preparation: Filleted, Packaging: Vacuum Sealed, Qty: 15.00 kg, Price: £18.00/kg, Total: £270.00
2. Product: Prawns, Code: 33/WH/TH/1, Preparation: Cleaned, Packaging: Thermal Box, Qty: 10.50 kg, Price: £22.00/kg, Total: £231.00
3. Product: Salmon, Code: 42/FI/VA/1, Preparation: Filleted, Packaging: Vacuum Sealed, Qty: 20.00 kg, Price: £9.35/kg, Total: £187.00

---

**Sample Order 2:**
- Customer Name: Mary Johnson
- Company Name: Ocean Fresh
- Email: mary@oceanfresh.co.uk
- Phone: +44 7800 123456
- Address: 456 Harbor Road, Portsmouth, PO1 2AB
- Total Weight: 120.00 kg
- Total Price: £2,400.00
- Tier Applied: Silver Tier (100-249 kg)

Order Items:
1. Product: Tuna, Code: 56/ST/TH/1, Preparation: Steaks, Packaging: Thermal Box, Qty: 30.00 kg, Price: £24.00/kg, Total: £720.00
2. Product: Sea Bass, Code: 45/WH/VA/1, Preparation: Whole, Packaging: Vacuum Sealed, Qty: 25.00 kg, Price: £20.50/kg, Total: £512.50
3. Product: Red Snapper, Code: 39/CL/TH/1, Preparation: Cleaned, Packaging: Thermal Box, Qty: 35.00 kg, Price: £18.50/kg, Total: £647.50
4. Product: Crab, Code: 65/WH/BU/1, Preparation: Whole, Packaging: Bulk, Qty: 15.00 kg, Price: £22.00/kg, Total: £330.00
5. Product: Squid, Code: 71/CL/VA/1, Preparation: Cleaned, Packaging: Vacuum Sealed, Qty: 15.00 kg, Price: £12.67/kg, Total: £190.00

---

**Sample Order 3:**
- Customer Name: David Chen
- Company Name: Chen's Fish Market
- Email: david@chenfish.com
- Phone: +44 7900 234567
- Address: 789 Market Street, Birmingham, B1 1AA
- Total Weight: 30.00 kg
- Total Price: £285.00
- Tier Applied: Below Minimum (Need 100kg minimum)

Order Items:
1. Product: Mackerel, Code: 24/WH/TH/1, Preparation: Whole, Packaging: Thermal Box, Qty: 20.00 kg, Price: £8.50/kg, Total: £170.00
2. Product: Sardines, Code: 44/WH/BU/1, Preparation: Whole, Packaging: Bulk, Qty: 10.00 kg, Price: £11.50/kg, Total: £115.00

---

**Sample Order 4:**
- Customer Name: Sarah Williams
- Company Name: Coastal Seafood Distributors
- Email: sarah@coastalseafood.co.uk
- Phone: +44 7700 345678
- Address: 321 Pier Avenue, Brighton, BN1 1AA
- Total Weight: 75.50 kg
- Total Price: £1,432.50
- Tier Applied: Below Minimum (Need 100kg minimum)

Order Items:
1. Product: Lobster, Code: 22/WH/TH/1, Preparation: Whole, Packaging: Thermal Box, Qty: 10.00 kg, Price: £45.00/kg, Total: £450.00
2. Product: King Fish, Code: 16/CL/VA/1, Preparation: Cleaned, Packaging: Vacuum Sealed, Qty: 25.00 kg, Price: £16.50/kg, Total: £412.50
3. Product: Barramundi, Code: 02/CL/TH/1, Preparation: Cleaned, Packaging: Thermal Box, Qty: 18.50 kg, Price: £10.41/kg, Total: £192.59
4. Product: Black Pomfret, Code: 05/WH/VA/1, Preparation: Whole, Packaging: Vacuum Sealed, Qty: 12.00 kg, Price: £19.50/kg, Total: £234.00
5. Product: Cuttlefish, Code: 09/CL/TH/1, Preparation: Cleaned, Packaging: Thermal Box, Qty: 10.00 kg, Price: £14.34/kg, Total: £143.41

---

### ADDITIONAL SETUP (OPTIONAL BUT RECOMMENDED):

1. **Create Views:**
   - "All Orders" (default grid view)
   - "Today's Orders" (filter: Created Time is today)
   - "High Value Orders" (filter: Total Price ≥ £1,000)
   - "By Customer" (grouped by Company Name)

2. **In Order Items table, create views:**
   - "All Items" (default grid view)
   - "By Product" (grouped by Product Name)
   - "This Week" (filter: Created Time is within last 7 days)

3. **Color Coding:**
   - If possible, add conditional coloring:
     * Tier 1 orders: Light blue
     * Tier 2 orders: Light green
     * Tier 3 orders: Light gold

---

### WHAT THIS BASE WILL DO:

This Airtable base integrates with a Next.js website where customers place fish orders. When an order is submitted:

1. The website API automatically creates a record in the "Orders" table
2. All fish items in the order are created in "Order Items" table
3. Items are automatically linked to their parent order
4. An email confirmation with PDF invoice is sent to the customer
5. The business owner can view all orders in Airtable in real-time

---

### DELIVERABLES I NEED:

Once you've set this up, please provide me with:

1. ✅ Confirmation that both tables are created with all fields
2. ✅ Confirmation that the relationship between tables is set up correctly
3. ✅ Confirmation that sample data is added
4. ✅ Instructions on how to get my Base ID (from the URL)
5. ✅ Instructions on how to create a Personal Access Token with the correct permissions

---

## PROMPT END ⬆️

---

## Alternative: Manual CSV Import

If the AI can't set it up directly, you can also:

1. Create the base manually following the tables above
2. Use this CSV for sample Orders data:
3. Use this CSV for sample Order Items data:

(See the detailed CSV templates in AIRTABLE_SETUP_GUIDE.md)

---

## After Setup

Once the AI confirms setup is complete, you need to:

1. **Get your Base ID:**
   - Open your Airtable base
   - Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   
   - Copy the `appXXXXXXXXXXXXXX` part

2. **Create Personal Access Token:**
   - Go to: https://airtable.com/create/tokens
   - Click "Create new token"
   - Name it: "Kerala Fish Orders API"
   - Add scopes: `data.records:read` and `data.records:write`
   - Add access to your base
   - Copy the token (starts with `pat`)

3. **Update your `.env.local`:**
   ```bash
   AIRTABLE_BASE_ID=appYourActualBaseId
   AIRTABLE_PAT=patYourActualToken.abc123
   ```

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

5. **Test by placing an order on your website!**

---

**Pro Tip:** You can also use this prompt with Airtable's own AI features or with automation tools like Zapier/Make.com to help set things up!

Good luck! 🚀🐟
