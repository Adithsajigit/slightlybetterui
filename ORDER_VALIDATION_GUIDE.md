# Order Validation Rules - Implementation Summary

## ✅ Implementation Complete

Two critical validation rules have been implemented on your website to ensure minimum order quantities:

---

## 🎯 Rule 1: Minimum 10kg Per Product

### How It Works
- When a customer enters a quantity **less than 10kg** for any product in the ordering table:
  - The **product row turns RED**
  - A warning message appears: **"⚠️ Minimum 10kg required"**
  - The quantity is **NOT added to the cart**
  - The row remains white/unhighlighted

- When they enter **10kg or more**:
  - The row turns **YELLOW** (added to cart)
  - The product quantity is saved

### Visual Feedback
```
Entering 5kg:    Row RED     | ⚠️ Minimum 10kg required | NOT in cart
Entering 9.99kg: Row RED     | ⚠️ Minimum 10kg required | NOT in cart
Entering 10kg:   Row YELLOW  | (no message)             | ✓ in cart
Entering 50kg:   Row YELLOW  | (no message)             | ✓ in cart
```

### File Modified
- **components/ProductCard.tsx**
  - Added validation logic in `handleInputChange()`
  - Added validation error state variables
  - Updated row styling based on validation status
  - Displays inline warning message

---

## 🎯 Rule 2: Minimum 100kg Total Order

### How It Works
- When a customer clicks **"REVIEW ORDER"** or **"Finalize Order"** with less than 100kg total:
  - A **RED warning box** appears showing the shortfall
  - The **Submit Order button is DISABLED** (grayed out)
  - The button text changes to show how much more is needed: **"Add X kg"**
  - Example: "Add 75.0 kg" if their order is 25kg

- The warning box displays:
  - `"⚠️ Minimum Order Requirement Not Met"`
  - `"Your order is 25 kg. Minimum required: 100 kg"`
  - `"Add 75 kg more to proceed with checkout"`

- When they reach **100kg or more**:
  - The red warning disappears
  - The Submit Order button becomes **ENABLED** (blue and clickable)
  - Button text returns to: **"Submit Order"**

### Additional Validation on Submit
Even if the total reaches 100kg, the submit button still validates:
- **All products must be at least 10kg**
- If any product is below 10kg, error: **"All products must have at least 10kg quantity"**
- Submit button remains disabled until all conditions are met

### File Modified
- **components/CheckoutModal.tsx**
  - Added `validationError` state
  - Enhanced `handleSubmit()` with 100kg and per-product validation
  - Added red warning boxes for validation failures
  - Updated submit button styling and disabled state based on validation
  - Button text changes to show needed quantity

---

## 📋 Validation Flow Summary

### Scenario 1: Valid Order ✅
```
Customer adds:
  - Anchovy: 25kg
  - Barramundi: 35kg  
  - Mackerel: 45kg
  Total: 105kg

✓ All products ≥ 10kg
✓ Total ≥ 100kg
→ Checkout modal has NO warnings
→ Submit Order button is ENABLED (blue)
→ Customer can submit successfully
```

### Scenario 2: Below 100kg Minimum ❌
```
Customer adds:
  - Anchovy: 10kg
  - Barramundi: 15kg
  Total: 25kg

✓ All products ≥ 10kg
✗ Total < 100kg (need 75kg more)

→ Checkout modal shows RED warning:
  "Your order is 25 kg. Minimum required: 100 kg"
  "Add 75 kg more to proceed"
→ Submit Order button is DISABLED (gray)
→ Button shows: "Add 75.0 kg"
→ Cannot checkout until reaching 100kg
```

### Scenario 3: Product Below 10kg While Typing ❌
```
Customer tries to enter 5kg for Anchovy

→ Row highlights in RED
→ Shows: "⚠️ Minimum 10kg required"
→ Product NOT added to cart
→ When reaching 10kg, row turns yellow and adds to cart
```

### Scenario 4: Mixed Invalid (100kg+ but item <10kg) ❌
```
Customer has:
  - Anchovy: 5kg (INVALID)
  - Barramundi: 60kg
  - Mackerel: 50kg
  Total: 115kg

✗ Anchovy < 10kg (but not shown as warning during typing)
✓ Total ≥ 100kg

→ Opens Checkout Modal
→ No 100kg warning (because 115kg ≥ 100kg)
→ But when clicking Submit Order:
  → Error: "All products must have at least 10kg quantity"
  → Submit button stays DISABLED
→ Customer must go back and fix Anchovy to ≥10kg
```

---

## 🎨 UI/UX Details

### Product Table (ProductCard)
| Element | State | Appearance |
|---------|-------|-----------|
| Row Background | Empty (0kg) | White |
| Row Background | Valid (≥10kg) | Yellow |
| Row Background | Invalid (<10kg while typing) | Red |
| Input Border | Invalid | Red border |
| Warning Message | Below product name | Red text: "⚠️ Minimum 10kg required" |

### Checkout Modal (CheckoutModal)
| Element | Condition | Appearance |
|---------|-----------|-----------|
| Warning Box | Total < 100kg | Red border, red background, detailed message |
| Submit Button | Total < 100kg | Gray, disabled, text: "Add X kg" |
| Submit Button | All valid | Blue, enabled, text: "Submit Order" |
| Submit Button | Processing | Blue, disabled, spinning loader |
| Error Box | Validation fails on submit | Red border, error message |

---

## 🔧 Technical Implementation Details

### ProductCard Component
```typescript
// Validation logic
const hasInvalidInput = inputValue !== '' && !isNaN(inputNum) && inputNum > 0 && inputNum < 10;

// In handleInputChange:
if (numVal < 10) {
  return; // Don't add to cart, just show UI feedback
}

// Styling:
className={`${hasInvalidInput ? 'bg-red-50' : currentQty > 0 ? 'bg-yellow-100' : 'bg-white'}`}
```

### CheckoutModal Component
```typescript
// Validation on submit
if (summary.totalWeight < 100) {
  setValidationError(`Order must be at least 100kg. Current: ${summary.totalWeight.toFixed(1)}kg`);
  return;
}

const invalidItems = summary.items.filter(item => item.quantity < 10);
if (invalidItems.length > 0) {
  setValidationError('All products must have at least 10kg quantity');
  return;
}

// Button disabled state
disabled={loading || summary.totalWeight < 100 || validationError !== ''}

// Button label changes dynamically
{summary.totalWeight < 100 ? `Add ${(100 - summary.totalWeight).toFixed(1)} kg` : 'Submit Order'}
```

---

## 📝 Testing Your Implementation

Test these scenarios to verify everything works:

1. **Test 10kg minimum per product:**
   - [ ] Enter 5kg for Anchovy → Row should turn red with warning
   - [ ] Increase to 10kg → Row should turn yellow (in cart)
   - [ ] Try 9.5kg → Should show red warning

2. **Test 100kg minimum total:**
   - [ ] Add products totaling 50kg
   - [ ] Click Review Order
   - [ ] In checkout modal, should see red warning
   - [ ] Submit button should be disabled
   - [ ] Button should show "Add 50.0 kg"

3. **Test valid order:**
   - [ ] Add 3 products each with 35kg = 105kg total
   - [ ] Click Review Order
   - [ ] No red warnings
   - [ ] Submit button is blue and enabled
   - [ ] Can successfully submit

4. **Test mixed invalid:**
   - [ ] Add: Anchovy 5kg + Barramundi 100kg + Mackerel 10kg = 115kg
   - [ ] Click Review Order → No warning (total OK)
   - [ ] Try to Submit → Should show error about Anchovy being < 10kg
   - [ ] Go back to table → See Anchovy in red
   - [ ] Fix Anchovy to 10kg → Try again → Should work

---

## 🚀 Next Steps

Your website now has complete order validation. Customers will:
1. ✅ See immediate feedback when entering quantities below 10kg
2. ✅ Be prevented from placing orders under 100kg total
3. ✅ Understand exactly what's needed to complete their order
4. ✅ Have clear, user-friendly error messages

The dummy order generator script is still available if you want to populate test data in Airtable!

---

## 📞 Support

If you need to adjust the minimums:
- **10kg minimum per product**: Edit line 59 in `components/ProductCard.tsx` (change `< 10` to your desired minimum)
- **100kg minimum total**: Edit line 32 in `components/CheckoutModal.tsx` (change `< 100` to your desired minimum)
