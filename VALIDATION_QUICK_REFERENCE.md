# 📊 Validation Rules - Visual Quick Reference

## Rule 1: 10kg Minimum Per Product

### Real-Time Feedback (While Typing in Product Row)

```
CUSTOMER ENTERS 5kg FOR ANCHOVY:
┌─────────────────────────────────────────────────────────────┐
│ 01  │ Anchovy / നെത്തോലി      │ Cleaned │ £9.62 │ [5] kg │
│     │ 40-50 pcs                              │              │
│     │ 🔴 ⚠️ Minimum 10kg required             │              │
│     │ (Row background = RED)                 │              │
│     │ INPUT NOT ACCEPTED - Item NOT in cart  │              │
└─────────────────────────────────────────────────────────────┘

CUSTOMER INCREASES TO 10kg:
┌─────────────────────────────────────────────────────────────┐
│ 01  │ Anchovy / നെത്തോലി      │ Cleaned │ £9.62 │ [10] kg│
│     │ 40-50 pcs                              │              │
│     │ (Row background = YELLOW)              │              │
│     │ ✅ Item accepted - Added to cart       │              │
└─────────────────────────────────────────────────────────────┘
```

---

## Rule 2: 100kg Minimum Total Order

### Checkout Modal - Below Minimum

```
CUSTOMER HAS 25kg TOTAL AND CLICKS "REVIEW ORDER":

┌───────────────────────────────────────────────────────────────┐
│              🛒 Finalize Order                           [×]   │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐
│ │ 📋 Order Summary                                    25 kg    │
│ │ 25.0 kg | £147.50                                  BASE TIER │
│ └─────────────────────────────────────────────────────────────┘
│
│ ┌─────────────────────────────────────────────────────────────┐ 🔴
│ │ ⚠️ Minimum Order Requirement Not Met                        │ RED
│ │                                                              │ BOX
│ │ Your order is 25 kg. Minimum required: 100 kg               │
│ │                                                              │
│ │ Add 75 kg more to proceed with checkout.                    │
│ └─────────────────────────────────────────────────────────────┘
│
│ [Customer Details Form...]
│
├───────────────────────────────────────────────────────────────┤
│ [Cancel]  [🔒 Add 75.0 kg]                          DISABLED  │
│           (Gray button, cannot click)                          │
└───────────────────────────────────────────────────────────────┘
```

### Checkout Modal - At/Above Minimum

```
CUSTOMER HAS 105kg TOTAL AND CLICKS "REVIEW ORDER":

┌───────────────────────────────────────────────────────────────┐
│              🛒 Finalize Order                           [×]   │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐
│ │ 📋 Order Summary                                  105 kg     │
│ │ 105.0 kg | £962.50                            GOLD TIER      │
│ └─────────────────────────────────────────────────────────────┘
│
│ (No red warning box - validation passed!)
│
│ [Customer Details Form...]
│
├───────────────────────────────────────────────────────────────┤
│ [Cancel]  [✅ Submit Order]                         ENABLED    │
│           (Blue button, clickable)                             │
└───────────────────────────────────────────────────────────────┘
```

---

## Complete Validation Scenarios

### ✅ VALID - Can Checkout

**Order:**
- Anchovy: 25kg ✓
- Barramundi: 40kg ✓
- Mackerel: 50kg ✓
- **Total: 115kg** ✓

**Result:** ✅ Green light - Submit button enabled

---

### ❌ INVALID - Cannot Checkout

**Scenario A: Below 100kg Total**

**Order:**
- Anchovy: 15kg ✓
- Barramundi: 20kg ✓
- **Total: 35kg** ✗ (Need 65kg more)

**Result:** ❌ Red warning - Submit button disabled
```
[Button disabled]
Show: "Add 65.0 kg"
```

---

### ❌ INVALID - Cannot Checkout

**Scenario B: Product Below 10kg**

**Order:**
- Anchovy: 5kg ✗
- Barramundi: 110kg ✓
- **Total: 115kg** ✓ (total OK but item invalid)

**Result:** ❌ Red warning during typing - Won't accept 5kg
```
Row turns RED
Show: "⚠️ Minimum 10kg required"
Not added to cart
```

---

### ❌ INVALID - Cannot Checkout

**Scenario C: Multiple Products Below 10kg**

**Order:**
- Anchovy: 8kg ✗
- Barramundi: 5kg ✗
- Mackerel: 95kg ✓
- **Total: 108kg** ✓ (total OK but items invalid)

**Result:** ❌ Red warnings on both items
```
Both Anchovy and Barramundi rows show:
"🔴 ⚠️ Minimum 10kg required"

When trying to submit anyway:
Red error box: "All products must have at least 10kg quantity"
```

---

## User Decision Tree

```
                        START: Customer Ordering
                               |
                    ┌──────────┴──────────┐
                    |                     |
              Enter quantity        Product row
              for product             validation
                    |                     |
            ┌───────┴─────┐         Has valid
            |             |         value?
          < 10kg      ≥ 10kg        |    |
            |             |         NO  YES
         RED 🔴         YELLOW 🟡    |    |
        Row + Warning     Row      RED  YELLOW
        NOT in cart      IN CART    Row  Row
            |             |         |    |
            └─────────────┴────────────┴─────┐
                                   |
                           Click "Review Order"
                                   |
                    ┌──────────────┴──────────────┐
                    |                            |
              Check total weight            Check all items
                    |                            |
            ┌───────┴────────┐         ┌─────────┴─────────┐
            |                |         |                   |
          < 100kg        ≥ 100kg     < 10kg            ≥ 10kg
            |               |          |                   |
         RED ❌           GREEN ✅    RED ❌             GREEN ✅
        Warning box    No warning    Error box      No error
        Disabled btn    Enabled btn   Disabled btn   Enabled btn
            |               |          |               |
            └────────────┬──────────────┴───────────────┘
                         |
        Meets all requirements? Then: ✅ SUBMIT ORDER
                         |
                    Success screen
```

---

## Error Message Reference

### Message 1: Product Below 10kg (While Typing)
```
🔴 Location: Below product name in table row
⚠️ Message: "⚠️ Minimum 10kg required"
📍 Row Color: RED (#FEE2E2 background, red text)
🔧 Action: Increase quantity to 10kg or higher
```

### Message 2: Total Below 100kg (In Checkout Modal)
```
🔴 Location: Red box in checkout modal
📋 Title: "⚠️ Minimum Order Requirement Not Met"
💬 Details: "Your order is X kg. Minimum required: 100 kg"
            "Add Y kg more to proceed with checkout."
🔧 Action: Add more products to reach 100kg
🔘 Button: Disabled - shows "Add Y kg"
```

### Message 3: Product Below 10kg on Submit (In Checkout Modal)
```
🔴 Location: Red box when clicking Submit
❌ Message: "All products must have at least 10kg quantity"
🔧 Action: Go back to product table and increase quantities
🔘 Button: Stays disabled until fixed
```

---

## Testing Checklist - Copy & Paste for QA

```
✓ TEST 1: Enter 5kg for product → Red warning appears
✓ TEST 2: Increase to 10kg → Row turns yellow
✓ TEST 3: Try 9.5kg → Still red warning
✓ TEST 4: Add 3 products with 25kg each = 75kg total
✓ TEST 5: Click "Review Order" → Red 100kg warning shown
✓ TEST 6: Submit button shows "Add 25.0 kg"
✓ TEST 7: Submit button is disabled (cannot click)
✓ TEST 8: Add 4th product with 30kg = 105kg total
✓ TEST 9: Red warning disappears
✓ TEST 10: Submit button turns blue and says "Submit Order"
✓ TEST 11: Submit button is enabled (can click)
✓ TEST 12: Add products: 5kg + 100kg + 10kg = 115kg
✓ TEST 13: 5kg item shows red warning during typing
✓ TEST 14: Fix to 10kg + 100kg + 10kg = 120kg
✓ TEST 15: No warnings, can submit
✓ TEST 16: Fill customer details and submit
✓ TEST 17: See success confirmation screen
```

---

## Color Legend

| Color | Meaning | Action |
|-------|---------|--------|
| 🟡 YELLOW | Valid product qty (≥10kg) | Added to cart ✓ |
| 🔴 RED | Invalid product qty (<10kg) | Not added, fix needed |
| 🟢 GREEN | Valid order (all checks pass) | Can submit |
| ⚪ WHITE/GRAY | Disabled/Inactive | Cannot interact |
| 🔵 BLUE | Active button (enabled) | Click to proceed |

---

**Need to change the minimums?** 
Edit these files:
- 10kg minimum: `components/ProductCard.tsx` line 59
- 100kg minimum: `components/CheckoutModal.tsx` line 32
