# 💎 Pricing Tier System - Kerala Fresh Fish

## 🎯 How Your Tier System Works

Your wholesale business uses a **volume-based pricing tier system** where customers get **better prices the more they buy**.

---

## 📊 The 4 Pricing Tiers

### 🥈 **Silver Tier** (Entry Level)
- **Weight Range:** 100 - 249 kg
- **Pricing:** Standard wholesale prices (priceSilver in data.ts)
- **Minimum Order:** 100 kg required to place order
- **Description:** Good starting tier for smaller restaurants and shops

### 🥇 **Gold Tier** (Mid Level)
- **Weight Range:** 250 - 499 kg
- **Pricing:** Reduced prices (priceGold in data.ts)
- **Discount:** Lower than Silver tier
- **Description:** Popular tier for medium-sized businesses

### 💍 **Platinum Tier** (High Volume)
- **Weight Range:** 500 - 999 kg
- **Pricing:** Even lower prices (pricePlatinum in data.ts)
- **Discount:** Significantly lower than Gold
- **Description:** For large restaurants and distributors

### 💎 **Diamond Tier** (Best Value)
- **Weight Range:** 1000+ kg
- **Pricing:** Lowest prices (priceDiamond in data.ts)
- **Discount:** Maximum discount available
- **Description:** VIP pricing for major buyers

---

## 📈 Price Progression Example

### King Fish (നെയ്മീൻ) - Product Code: 16/CL/TH/1

| Tier | Weight Range | Price per KG | Savings vs Silver |
|------|-------------|--------------|-------------------|
| 🥈 Silver | 100-249 kg | £18.00/kg | - (baseline) |
| 🥇 Gold | 250-499 kg | £16.50/kg | **£1.50/kg saved** |
| 💍 Platinum | 500-999 kg | £15.20/kg | **£2.80/kg saved** |
| 💎 Diamond | 1000+ kg | £14.00/kg | **£4.00/kg saved** |

**Example Savings:**
- If you buy 1000 kg of King Fish at Diamond tier: **£4,000 savings** compared to Silver!
- That's (£18.00 - £14.00) × 1000 kg = **£4,000 less!**

---

## 🔄 How Tier Changes Affect Your Order

### Important: **ALL prices update when you change tiers!**

When you add more fish to reach a new tier:
1. ✅ **Your entire cart** recalculates at the new tier prices
2. ✅ **Every fish** gets the lower price
3. ✅ **Your total** decreases (even though you added more)
4. ✅ **You save money** on everything you already had in cart

### Example Scenario:

**Starting Cart (Silver Tier - 150 kg):**
```
King Fish: 50 kg × £18.00 = £900.00
Prawns: 50 kg × £22.00 = £1,100.00
Salmon: 50 kg × £9.50 = £475.00
                Total: £2,475.00 (Silver Tier)
```

**After Adding 100kg More (Gold Tier - 250 kg):**
```
King Fish: 50 kg × £16.50 = £825.00  (-£75 saved!)
Prawns: 50 kg × £20.00 = £1,000.00   (-£100 saved!)
Salmon: 50 kg × £8.80 = £440.00      (-£35 saved!)
Tuna: 100 kg × £12.00 = £1,200.00    (new item)
                Total: £3,465.00 (Gold Tier)
```

**Savings Breakdown:**
- Old items now cheaper: £210 saved
- Added 100kg at Gold prices
- Net result: Better unit price on everything!

---

## 🎯 Strategic Buying Tips

### Tip 1: **Check "Add X kg more" message**
Your website shows: "Add 23.5 kg more to unlock Gold Tier!"
- This helps customers see how close they are
- Encourages adding just a bit more for savings

### Tip 2: **Mix and Match**
- Combine different fish types
- All contribute to total weight
- All benefit from tier pricing

### Tip 3: **Plan Ahead**
- If you need 240 kg, consider buying 250 kg
- Small extra purchase unlocks Gold tier
- Saves money on entire order

### Tip 4: **Bulk Orders = Maximum Savings**
- Diamond tier (1000+ kg) offers best value
- Perfect for:
  - Large restaurants
  - Fish markets
  - Distributors
  - Catering companies

---

## 💡 Real-World Examples

### Restaurant Owner - Sarah
**Monthly Need:** 180 kg

**Option A (Silver Tier):**
- Orders: 180 kg at Silver prices
- Total: ~£3,240/month

**Option B (Gold Tier - Smart!):**
- Orders: 260 kg at Gold prices
- Can freeze the extra 80 kg
- Total: ~£4,160/month
- **But**: Lower cost per kg means better margins
- **Plus**: Always have backup stock

---

### Fish Market - John
**Weekly Need:** 400 kg

**Current (Platinum Tier):**
- Orders: 400 kg weekly at Platinum prices
- Monthly: 1,600 kg
- Total: ~£28,800/month

**Better Option (Diamond Tier):**
- Orders: 1,000 kg bi-weekly at Diamond prices
- Monthly: 2,000 kg
- Total: ~£28,000/month
- **Same monthly spend but 400 kg more fish!**
- **Or**: Buy 1,600 kg and save £3,200/month

---

## 🖥️ How It Works on Your Website

### Visual Indicators:

**1. Tier Progress Bar** (Top of page)
```
┌────────────────────────────────────────────────┐
│  🥈 SILVER PRICING                            │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 150 / 250 kg         │
│  Add 100.0 KG more to unlock GOLD pricing!    │
└────────────────────────────────────────────────┘
```

**2. Price Updates** (Real-time)
- As you add items, prices automatically adjust
- See savings immediately
- No page refresh needed

**3. Cart Summary**
```
Total Weight: 150.00 kg
🥈 SILVER TIER
Subtotal: £2,475.00

💡 Tip: Add 100 kg more to save with Gold pricing!
```

**4. Checkout Display**
- Shows current tier
- Displays tier-adjusted prices
- Calculates final total

---

## 🔧 Technical Implementation

Your tier system is implemented in:

### 1. **constants.ts** - Tier Thresholds
```typescript
export const TIER_THRESHOLDS = {
  SILVER: 100,    // Starting tier
  GOLD: 250,      // Better pricing
  PLATINUM: 500,  // Great pricing
  DIAMOND: 1000,  // Best pricing
};

export const MIN_ORDER_WEIGHT = 100; // KG
```

### 2. **CartContext.tsx** - Tier Calculation Logic
```typescript
// Automatically determines tier based on total weight
if (totalWeight >= TIER_THRESHOLDS.DIAMOND) {
  tier = PricingTier.Diamond;
} else if (totalWeight >= TIER_THRESHOLDS.PLATINUM) {
  tier = PricingTier.Platinum;
} else if (totalWeight >= TIER_THRESHOLDS.GOLD) {
  tier = PricingTier.Gold;
} else if (totalWeight >= TIER_THRESHOLDS.SILVER) {
  tier = PricingTier.Silver;
}
```

### 3. **data.ts** - Product Pricing
Every fish has 4 prices:
```typescript
{
  englishName: "King Fish",
  malayalamName: "നെയ്മീൻ",
  priceSilver: 18.00,   // 100-249 kg
  priceGold: 16.50,     // 250-499 kg
  pricePlatinum: 15.20, // 500-999 kg
  priceDiamond: 14.00,  // 1000+ kg
}
```

### 4. **Automatic Recalculation**
- Happens instantly as cart changes
- No page reload needed
- Real-time price updates
- Tier badges update automatically

---

## 📱 Customer Experience Flow

### Step 1: Browse Products
- Customer sees fish catalog
- Initial prices shown at Silver tier (default)

### Step 2: Add to Cart
- Add King Fish: 50 kg
- Cart shows: 50 kg total (Silver Tier)
- Price: £18.00/kg

### Step 3: Add More Items
- Add Prawns: 60 kg
- Cart shows: 110 kg total (Still Silver Tier)
- Prices: Same

### Step 4: Reach New Tier!
- Add Salmon: 150 kg
- Cart shows: 260 kg total (**Gold Tier unlocked!** 🥇)
- **All prices drop automatically**
- Progress bar updates
- Savings message appears

### Step 5: See Savings
- Original items repriced at Gold rates
- Total recalculated
- Customer sees immediate benefit
- Encouraged to continue shopping

### Step 6: Checkout
- Final tier displayed
- PDF invoice shows tier
- Email confirmation includes tier info
- Airtable record saves tier data

---

## 📊 Business Benefits

### For You (Seller):
1. **Higher Order Values:** Customers buy more to reach tiers
2. **Customer Loyalty:** Better prices for bulk buyers
3. **Inventory Management:** Move more stock faster
4. **Competitive Advantage:** Transparent volume discounts
5. **Analytics:** Track which tiers customers prefer

### For Customers (Buyers):
1. **Cost Savings:** Bulk buying rewards
2. **Transparency:** Clear pricing structure
3. **Flexibility:** Choose their tier
4. **Incentive:** Visual progress to next tier
5. **Fair:** Same rules for everyone

---

## ✅ Current Status

**Your tier system is:**
- ✅ Fully implemented
- ✅ Working correctly
- ✅ Real-time calculations
- ✅ Airtable integration ready
- ✅ Email/PDF includes tier info
- ✅ Visual progress indicators
- ✅ Mobile responsive

**No changes needed!** System is working as designed.

---

## 🎓 Tier System Summary

```
┌─────────────────────────────────────────────────┐
│         KERALA FRESH FISH TIER SYSTEM           │
├─────────────┬───────────────┬──────────────────┤
│ Tier        │ Weight Range  │ Benefit          │
├─────────────┼───────────────┼──────────────────┤
│ 🥈 Silver   │ 100-249 kg    │ Standard Pricing │
│ 🥇 Gold     │ 250-499 kg    │ Lower Prices     │
│ 💍 Platinum │ 500-999 kg    │ Great Prices     │
│ 💎 Diamond  │ 1000+ kg      │ Best Prices      │
└─────────────┴───────────────┴──────────────────┘

More Weight = Better Prices for EVERYTHING in Cart!
```

---

**Your tier system encourages customers to buy more while rewarding them with real savings!** 🚀🐟
