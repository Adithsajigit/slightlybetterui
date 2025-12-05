# 🎨 Airtable Structure Visualization

## Your Current System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOMER PLACES ORDER                        │
│                    (Your Website Frontend)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              POST /api/submit-order (Next.js API)               │
│                                                                  │
│  Receives:                                                       │
│  - Customer info (name, email, phone, address, company)         │
│  - Cart items (fish products with quantities)                   │
│  - Calculated totals (weight, price, tier)                      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
        ┌────────────────────┐  ┌────────────────────┐
        │   1. AIRTABLE      │  │   2. EMAIL         │
        │   Save Order       │  │   Send Invoice     │
        └─────────┬──────────┘  └────────────────────┘
                  │
          ┌───────┴────────┐
          ▼                ▼
    ┌─────────┐      ┌──────────────┐
    │ Orders  │◄─────┤ Order Items  │
    │ Table   │      │ Table        │
    └─────────┘      └──────────────┘
```

---

## 📊 Airtable Database Schema

### Table 1: Orders (Parent)
```
┌──────────────────────────────────────────────────┐
│                    ORDERS                        │
├──────────────────┬───────────────────────────────┤
│ Field            │ Example Value                 │
├──────────────────┼───────────────────────────────┤
│ 🔑 Record ID     │ recABC123DEF456              │
│ 👤 Customer Name │ John Smith                   │
│ 🏢 Company Name  │ Smith Seafood Ltd            │
│ 📧 Email         │ john@smithseafood.com        │
│ 📞 Phone         │ +44 7700 900000              │
│ 📍 Address       │ 123 Fish Street, London...   │
│ ⚖️  Total Weight │ 45.50 kg                     │
│ 💰 Total Price   │ £687.50                      │
│ 🎯 Tier Applied  │ Silver Tier (100-249 kg)     │
│ 📦 Order JSON    │ {"items":[...]}              │
│ 🕐 Created Time  │ 05/12/2024 14:30             │
│ 🔗 Order Items   │ → 3 linked records           │
└──────────────────┴───────────────────────────────┘
```

### Table 2: Order Items (Children)
```
┌──────────────────────────────────────────────────┐
│                 ORDER ITEMS                      │
├──────────────────┬───────────────────────────────┤
│ Field            │ Example Value                 │
├──────────────────┼───────────────────────────────┤
│ 🔑 Record ID     │ recXYZ789GHI012              │
│ 🔗 Order Link    │ ← recABC123DEF456 (Order #1) │
│ 🐟 Product Name  │ King Fish                    │
│ 🏷️  Code         │ 16/CL/TH/1                   │
│ 🔪 Preparation   │ Filleted                     │
│ 📦 Packaging     │ Vacuum Pack                  │
│ ⚖️  Quantity KG  │ 15.00                        │
│ 💷 Price Per KG  │ £18.00                       │
│ 💰 Line Total    │ £270.00                      │
│ 🕐 Created Time  │ 05/12/2024 14:30             │
└──────────────────┴───────────────────────────────┘
```

---

## 🔗 Relationship Structure

```
ONE Order → MANY Order Items

Example:

Order #1 (recABC123)
├─ Order Item 1 (King Fish)    → £270.00
├─ Order Item 2 (Prawns)       → £231.00
└─ Order Item 3 (Salmon)       → £186.50
                         Total: £687.50

Order #2 (recDEF456)
├─ Order Item 4 (Tuna)         → £156.00
├─ Order Item 5 (Crab)         → £345.00
├─ Order Item 6 (Lobster)      → £780.00
└─ Order Item 7 (Sea Bass)     → £120.00
                         Total: £1,401.00
```

---

## 📝 Sample Order Flow (Step-by-Step)

### When Customer Orders:

**Step 1: Order Created in Airtable**
```json
POST https://api.airtable.com/v0/appXXXXXX/Orders
{
  "fields": {
    "Customer Name": "Mary Johnson",
    "Company Name": "Ocean Fresh",
    "Email": "mary@oceanfresh.co.uk",
    "Phone": "+44 7800 123456",
    "Address": "456 Harbor Road\nPortsmouth\nPO1 2AB",
    "Total Weight": 120.50,
    "Total Price": 2145.75,
    "Tier Applied": "Tier 2: £10.01-£20.00/kg",
    "Order JSON": "[{...}]"
  }
}

Response: { "id": "recNEW123456" } ✅
```

**Step 2: Items Linked to Order**
```json
POST https://api.airtable.com/v0/appXXXXXX/Order Items
{
  "records": [
    {
      "fields": {
        "Order Link": ["recNEW123456"],
        "Product Name": "King Fish",
        "Code": "16/CL/TH/1",
        "Preparation": "Filleted",
        "Packaging": "Vacuum Pack",
        "Quantity KG": 25.00,
        "Price Per KG": 18.00,
        "Line Total": 450.00
      }
    },
    {
      "fields": {
        "Order Link": ["recNEW123456"],
        "Product Name": "Prawns",
        "Code": "33/WH/TH/1",
        "Preparation": "Cleaned",
        "Packaging": "Thermal Box",
        "Quantity KG": 30.50,
        "Price Per KG": 22.50,
        "Line Total": 686.25
      }
    },
    // ... more items
  ]
}
```

**Step 3: Email Sent**
```
✅ Invoice PDF Generated: INV-20251205-1234
✅ Email sent to: mary@oceanfresh.co.uk
✅ BCC copy sent to: sebinsajiabraham@gmail.com
```

---

## 🎯 What You See in Airtable

### Orders Table View:
```
┌────────────┬───────────────┬────────────┬──────────┬───────────┐
│ Created    │ Company       │ Total      │ Tier     │ Items     │
├────────────┼───────────────┼────────────┼──────────┼───────────┤
│ 2h ago     │ Smith Seafood │ £687.50    │ Tier 2   │ 🔗 3      │
│ 5h ago     │ Ocean Fresh   │ £2,145.75  │ Tier 2   │ 🔗 5      │
│ 1d ago     │ Fish Market   │ £456.00    │ Tier 1   │ 🔗 2      │
└────────────┴───────────────┴────────────┴──────────┴───────────┘
```

### Order Items Table View:
```
┌────────────┬───────────────┬────────────┬─────────┬───────────┐
│ Created    │ Product       │ Qty (kg)   │ Price/kg│ Total     │
├────────────┼───────────────┼────────────┼─────────┼───────────┤
│ 2h ago     │ King Fish     │ 15.00      │ £18.00  │ £270.00   │
│ 2h ago     │ Prawns        │ 10.50      │ £22.00  │ £231.00   │
│ 2h ago     │ Salmon        │ 20.00      │ £9.35   │ £187.00   │
│ 5h ago     │ Tuna          │ 12.00      │ £13.00  │ £156.00   │
└────────────┴───────────────┴────────────┴─────────┴───────────┘
```

---

## 📈 Airtable Views You Can Create

**1. Today's Orders**
- Filter: Created Time is today
- Sort: Created Time (newest first)

**2. High Value Orders**
- Filter: Total Price ≥ £1,000
- Sort: Total Price (largest first)

**3. By Customer**
- Group by: Company Name
- Sort: Total Price (sum, descending)

**4. Pending Orders**
- Filter: Status = "Pending" (if you add status field)

**5. Monthly Sales**
- Filter: Created Time is this month
- Summary: Sum of Total Price

---

## 🎨 Pro Tips

### Color Code Your Orders
Add a **Status** field (Single Select) with colors:
- 🟢 New (Green)
- 🟡 Processing (Yellow)
- 🔵 Shipped (Blue)
- ✅ Delivered (Gray)

### Add Formulas
- **Order Number**: `DATETIME_FORMAT(Created, 'YYYYMMDD') & '-' & RECORD_ID()`
- **Days Since Order**: `DATETIME_DIFF(NOW(), Created, 'days')`
- **Profit Margin**: `Total Price * 0.25` (if 25% margin)

### Create Automation
- Send Slack notification when new order
- Update inventory in another table
- Email yourself daily sales summary

---

## 🔐 Your Credentials Setup

In `.env.local`:
```bash
# Get Base ID from URL: https://airtable.com/appXXXXXX/...
AIRTABLE_BASE_ID=appYourBaseIdHere

# Get PAT from: https://airtable.com/create/tokens
AIRTABLE_PAT=patYourToken.abc123def456
```

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Airtable base created
- [ ] "Orders" table exists with all fields
- [ ] "Order Items" table exists with all fields
- [ ] Tables are linked (Order Items → Orders)
- [ ] Base ID copied from URL
- [ ] PAT token created with correct scopes
- [ ] PAT has access to your base
- [ ] `.env.local` updated
- [ ] Dev server restarted
- [ ] Test order placed
- [ ] Order appears in Airtable ✅
- [ ] Items are linked to order ✅
- [ ] Email received ✅

---

**All working?** You now have a complete order management system! 🎉🐟
