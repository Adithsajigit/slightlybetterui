# 🐟 Quick Start: Airtable Setup for Kerala Fresh Fish

## ✨ TL;DR - 5 Minute Setup

Your code is **already integrated**! Just need 3 things:

1. **Create Airtable base** with 2 tables (see below)
2. **Get credentials** (Base ID + Personal Access Token)
3. **Update `.env.local`** with your credentials

---

## 🚀 FASTEST WAY: Copy-Paste Airtable Structure

### Create Base: "Kerala Fresh Fish Orders"

**Table 1: Orders**
```
Field Name          | Type              | Format/Options
--------------------|-------------------|----------------------------------
Customer Name       | Single line text  | -
Company Name        | Single line text  | -
Email              | Email             | -
Phone              | Phone number      | -
Address            | Long text         | -
Total Weight       | Number            | Precision: 2, Suffix: " kg"
Total Price        | Currency          | GBP (£)
Tier Applied       | Single select     | See options below
Order JSON         | Long text         | -
Created Time       | Created time      | -
Order Items        | Link to records   | Link to "Order Items" table
```

**Tier Applied Options:**
- Silver Tier (100-249 kg)
- Gold Tier (250-499 kg)
- Platinum Tier (500-999 kg)
- Diamond Tier (1000+ kg)

---

**Table 2: Order Items**
```
Field Name          | Type              | Format/Options
--------------------|-------------------|----------------------------------
Order Link         | Link to records   | Link to "Orders" table
Product Name       | Single line text  | -
Code               | Single line text  | -
Preparation        | Single select     | See options below
Packaging          | Single select     | See options below
Quantity KG        | Number            | Precision: 2
Price Per KG       | Currency          | GBP (£)
Line Total         | Currency          | GBP (£)
Created Time       | Created time      | -
```

**Preparation Options:**
- Fresh - Whole
- Cleaned
- Skinned
- Filleted
- Steaks

**Packaging Options:**
- Bulk
- Retail Ready
- Vacuum Sealed

---

## 🔑 Get Credentials (2 minutes)

### Step 1: Get Base ID
1. Open your Airtable base
2. URL looks like: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. Copy the `appXXXXXXXXXXXXXX` part

### Step 2: Get Personal Access Token
1. Go to: https://airtable.com/create/tokens
2. Create new token: "Kerala Fish API"
3. Scopes: `data.records:read` + `data.records:write`
4. Add your base
5. Copy the token (starts with `pat`)

### Step 3: Update .env.local
```bash
AIRTABLE_BASE_ID=appYourActualBaseId
AIRTABLE_PAT=patYourActualToken.1234567890
```

---

## 📊 Sample Data (For Testing)

Here are 4 fish from your catalog you can manually add to test:

**Anchovy** (നെത്തോലി/കൊഴുവ)
- Code: 01/CL/TH/1
- Preparation: Cleaned
- Packaging: Thermal Box
- Price: £8.51/kg

**Barramundi** (കാളാഞ്ചി)
- Code: 02/WH/TH/1
- Preparation: Whole
- Packaging: Thermal Box
- Price: £9.26/kg

**King Fish** (നെയ്മീൻ)
- Code: 16/CL/TH/1
- Preparation: Cleaned
- Packaging: Thermal Box
- Price: £15.50/kg (example)

**Prawns** (കൊഞ്ച്)
- Code: 33/WH/TH/1
- Preparation: Whole
- Packaging: Thermal Box
- Price: £18.00/kg (example)

*(Note: Your website already has 100+ fish products hardcoded in `data.ts` - these are just examples for Airtable testing)*

---

## 🧪 Test It

1. **Start server:** `npm run dev`
2. **Place order** on http://localhost:3000
3. **Check Airtable** → New order should appear!
4. **Check email** → PDF invoice sent!

---

## 📱 What You Get

**In Airtable:**
- Real-time order tracking
- Customer database
- Sales analytics
- Export to Excel/CSV
- Mobile app access

**Automatic Features:**
- ✅ Order saved to Airtable
- ✅ Email with PDF invoice sent to customer
- ✅ BCC copy sent to you (sebinsajiabraham@gmail.com)
- 🔜 WhatsApp notification (when configured)

---

## 🎯 Current Data Flow

```
Customer Places Order
        ↓
1. Saved to Airtable (Orders + Order Items tables)
        ↓
2. Generate PDF Invoice (INV-20251205-XXXX)
        ↓
3. Send Email (HTML template + PDF attachment)
        ↓
4. [Optional] Send WhatsApp notification
        ↓
Customer receives confirmation
You receive BCC copy + Airtable record
```

---

## 🆘 Common Issues

**"Orders not saving"**
→ Check `.env.local` credentials and restart server

**"401 Unauthorized"**
→ PAT token wrong/expired, create new one

**"Field doesn't exist"**
→ Table/field names must match EXACTLY (case-sensitive!)

**"Email not sending"**
→ Different issue, check SMTP settings (already working for you)

---

## 📋 Your Current Fish Catalog

You have **100+ products** in `data.ts` including:
- Anchovy, Barramundi, Barracuda, Black Pomfret
- Crab, Cuttlefish, Emperor Fish, King Fish
- Lobster, Mackerel, Mahi Mahi, Mullet
- Prawns, Red Snapper, Ribbon Fish, Salmon
- Sardines, Sea Bass, Shark, Squid
- Tuna, Wahoo, and many more!

All with Malayalam names, multiple preparations, and pricing tiers!

---

**Need the full detailed guide?** Check `AIRTABLE_SETUP_GUIDE.md`

**Ready?** Create your Airtable base now: https://airtable.com/create 🚀
