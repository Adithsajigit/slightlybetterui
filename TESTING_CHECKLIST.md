# ✅ IMPLEMENTATION CHECKLIST & TESTING GUIDE

## Phase 1: ✅ IMPLEMENTATION COMPLETE

### Code Changes
- ✅ `components/ProductCard.tsx` - 10kg minimum validation added
- ✅ `components/CheckoutModal.tsx` - 100kg minimum validation added
- ✅ Real-time validation logic implemented
- ✅ Error message display components added
- ✅ Button state management updated
- ✅ Styling applied for visual feedback
- ✅ No TypeScript errors
- ✅ Development server running

### Documentation
- ✅ `VALIDATION_RULES.md` created
- ✅ `ORDER_VALIDATION_GUIDE.md` created
- ✅ `VALIDATION_QUICK_REFERENCE.md` created
- ✅ `VALIDATION_IMPLEMENTATION_COMPLETE.md` created
- ✅ `README_VALIDATION_LIVE.md` created

---

## Phase 2: 🧪 TESTING - Run These Tests

### Test Suite 1: 10kg Minimum Per Product

#### Test 1.1: Below Minimum Feedback
```
Steps:
1. Open http://localhost:3000
2. Scroll to product table (Section 2: ENTER QUANTITIES)
3. Find "Anchovy" row
4. Click quantity input field
5. Type: 5
6. Tab or click elsewhere

Expected Results:
✓ Row background turns LIGHT RED (#FEE2E2)
✓ Warning message appears: "⚠️ Minimum 10kg required"
✓ Warning is displayed below product name
✓ Product is NOT added to cart (row not highlighted yellow overall)

Pass? ☐ Yes ☐ No
```

#### Test 1.2: Minimum Value Acceptance
```
Steps:
1. Same row as Test 1.1
2. Clear the field
3. Type: 10
4. Tab or click elsewhere

Expected Results:
✓ Red warning disappears
✓ Row background turns LIGHT YELLOW (#FEF08A)
✓ Product appears in sticky bottom bar: "REVIEW ORDER (1)"
✓ Total weight shows in sticky bar

Pass? ☐ Yes ☐ No
```

#### Test 1.3: Edge Case - 9.99kg
```
Steps:
1. Clear field
2. Type: 9.99
3. Tab or click elsewhere

Expected Results:
✓ Still shows red warning (not >= 10)
✓ Row turns red
✓ NOT added to cart

Pass? ☐ Yes ☐ No
```

#### Test 1.4: Above Minimum
```
Steps:
1. Clear field
2. Type: 25
3. Tab or click elsewhere

Expected Results:
✓ No warning
✓ Row turns YELLOW
✓ Product in cart
✓ Sticky bar shows quantity

Pass? ☐ Yes ☐ No
```

#### Test 1.5: Zero/Empty Removal
```
Steps:
1. Product is in cart with 25kg
2. Clear the field (make it empty)
3. Tab or click elsewhere

Expected Results:
✓ Product removed from cart
✓ Row returns to WHITE
✓ No warning shown
✓ Sticky bar updates (or disappears if no items)

Pass? ☐ Yes ☐ No
```

---

### Test Suite 2: 100kg Total Minimum

#### Test 2.1: Below Minimum - Checkout Modal
```
Steps:
1. Add products: 10kg Anchovy + 15kg Barramundi = 25kg total
2. See sticky bar at bottom: "25 kg | ... | REVIEW ORDER (2)"
3. Click "REVIEW ORDER" button
4. Checkout modal opens

Expected Results:
✓ Modal title: "Finalize Order"
✓ Order Summary box shows: "25.0 kg | ... | BASE TIER"
✓ RED WARNING BOX appears with:
  - Title: "⚠️ Minimum Order Requirement Not Met"
  - Text: "Your order is 25 kg. Minimum required: 100 kg"
  - Help text: "Add 75 kg more to proceed with checkout."
✓ Submit button is GRAY (disabled)
✓ Submit button text shows: "Add 75.0 kg"
✓ Cannot click submit button

Pass? ☐ Yes ☐ No
```

#### Test 2.2: At Minimum - Checkout Modal
```
Steps:
1. Go back to product table
2. Add more products until total is exactly 100kg
3. Click "REVIEW ORDER"

Expected Results:
✓ Red warning box DISAPPEARS
✓ Order Summary shows: "100.0 kg | ... | TIER"
✓ Submit button is BLUE (enabled)
✓ Submit button text: "Submit Order"
✓ Can click submit button ✓

Pass? ☐ Yes ☐ No
```

#### Test 2.3: Above Minimum
```
Steps:
1. Go back and add even more: total 150kg
2. Click "REVIEW ORDER"

Expected Results:
✓ No red warning
✓ Order Summary shows: "150.0 kg | ..."
✓ Submit button is BLUE (enabled)
✓ Button text: "Submit Order"

Pass? ☐ Yes ☐ No
```

---

### Test Suite 3: Combined Validation

#### Test 3.1: Total OK but Item Invalid
```
Steps:
1. Add: 5kg Anchovy + 100kg Barramundi = 105kg total
2. Note: Anchovy shows RED warning (< 10kg)
3. Click "REVIEW ORDER"

Expected Results:
✓ Modal opens
✓ No "100kg minimum" warning (total is OK)
✓ Order Summary shows: "105.0 kg | ..."
✓ Try to submit (click Submit Order button)

Expected on Submit Attempt:
✓ Error box appears: "❌ All products must have at least 10kg quantity"
✓ Submit button STAYS DISABLED
✓ Cannot proceed until all items are >= 10kg

Pass? ☐ Yes ☐ No
```

#### Test 3.2: Fix Invalid Item
```
Steps (continuing from 3.1):
1. Close modal (click Cancel or X)
2. Go back to product table
3. Fix Anchovy: change 5kg to 10kg
4. Row should turn yellow now
5. Click "REVIEW ORDER" again

Expected Results:
✓ Anchovy now shows 10kg (yellow row)
✓ Modal opens
✓ No warnings at all
✓ Submit button is BLUE and enabled
✓ Can click submit ✓

Pass? ☐ Yes ☐ No
```

#### Test 3.3: Multiple Invalid Items
```
Steps:
1. Add: 8kg Anchovy + 9kg Barramundi + 100kg Mackerel = 117kg
2. Note: Anchovy RED, Barramundi RED, but total is 117kg
3. Click "REVIEW ORDER"

Expected Results:
✓ No 100kg warning (total OK at 117kg)
✓ Try to submit
✓ Error box: "All products must have at least 10kg quantity"
✓ Submit stays disabled
✓ Must fix BOTH items

Pass? ☐ Yes ☐ No
```

---

### Test Suite 4: Edge Cases

#### Test 4.1: Decimal Values
```
Steps:
1. Enter: 10.5kg for a product
2. Enter: 9.9kg for another

Expected Results:
✓ 10.5kg → YELLOW (valid, >= 10)
✓ 9.9kg → RED (invalid, < 10)

Pass? ☐ Yes ☐ No
```

#### Test 4.2: Very Large Quantities
```
Steps:
1. Enter: 1000kg for one product
2. Check order summary

Expected Results:
✓ Accepted (no upper limit)
✓ Shows in summary: "1000 kg"
✓ Pricing tier updates correctly
✓ Sticky bar shows total weight

Pass? ☐ Yes ☐ No
```

#### Test 4.3: Exactly 100kg
```
Steps:
1. Order exactly: 10kg + 90kg = 100.0kg
2. Click Review Order

Expected Results:
✓ No warning (100kg is minimum, so 100 >= 100 ✓)
✓ Submit button enabled
✓ Can submit

Pass? ☐ Yes ☐ No
```

#### Test 4.4: 99.99kg (Just Below)
```
Steps:
1. Order: 50kg + 49.99kg = 99.99kg
2. Click Review Order

Expected Results:
✓ Red warning appears: "Add 0.01 kg more"
✓ Submit button disabled
✓ Shows: "Add 0.01 kg"

Pass? ☐ Yes ☐ No
```

---

### Test Suite 5: UI/UX Tests

#### Test 5.1: Visual Feedback Responsiveness
```
Steps:
1. Add product with 10kg
2. Immediately see yellow row
3. Sticky bar updates in real-time
4. Add another product
5. Watch tier change in sticky bar

Expected Results:
✓ All updates are instant (no lag)
✓ Visual feedback is clear and immediate
✓ Yellow rows are clearly visible
✓ Red warnings are prominent
✓ Sticky bar is always accurate

Pass? ☐ Yes ☐ No
```

#### Test 5.2: Error Message Clarity
```
Steps:
1. Create multiple error scenarios
2. Read each error message carefully

Expected Results:
✓ "⚠️ Minimum 10kg required" - Clear and concise
✓ "Add 75 kg more to proceed" - Action-oriented
✓ "All products must have at least 10kg" - Specific
✓ All messages tell customer exactly what to do

Pass? ☐ Yes ☐ No
```

#### Test 5.3: Mobile Responsiveness
```
Steps:
1. Open browser DevTools (F12)
2. Set to mobile view (375px width)
3. Run all test scenarios
4. Check on tablet view too

Expected Results:
✓ Layout doesn't break
✓ Red warnings visible on small screens
✓ Buttons clickable on touch
✓ Sticky bar works on mobile
✓ Modal responsive on small screens

Pass? ☐ Yes ☐ No
```

---

## Phase 3: 🔧 FULL INTEGRATION TEST

### Complete Order Flow Test
```
TEST: Full order from start to checkout success

Steps:
1. Open http://localhost:3000
2. Select packaging (Thermal Box or Vacuum Pack)
3. Add products:
   - Product 1: 20kg
   - Product 2: 35kg
   - Product 3: 50kg
   Total: 105kg
4. Review order (should all be valid)
5. Fill customer details:
   - Name: Test Customer
   - Company: Test Company Ltd
   - Email: test@example.com
   - Phone: +44 7000 000000
   - Address: 123 Test Street, London
6. Click "Submit Order"

Expected Results:
✓ No validation errors shown
✓ Form submits successfully
✓ Success screen appears: "Order Received!"
✓ Order sent to Airtable (check backend logs)
✓ Email confirmation sent

Pass? ☐ Yes ☐ No
```

---

## Scoring

### Test Results Summary

**Total Tests:** 20+ scenarios  
**Passed:** _____ / 20+  
**Failed:** _____ / 20+  
**Pass Rate:** _____%

### Critical Tests (Must Pass)
- ☐ Test 1.1: Below minimum shows warning
- ☐ Test 1.2: 10kg accepted
- ☐ Test 2.1: Below 100kg shows warning and disables button
- ☐ Test 2.2: At/above 100kg enables button
- ☐ Test 3.1: Validates all items on submit
- ☐ Full Integration Test: Complete order succeeds

**All Critical Tests Passed?** ☐ YES ☐ NO

---

## Issues Found

If any tests failed, document them here:

```
Issue #1:
- Test: _______________
- Expected: ___________
- Actual: ______________
- Severity: ☐ Critical ☐ High ☐ Medium ☐ Low

Issue #2:
- Test: _______________
- Expected: ___________
- Actual: ______________
- Severity: ☐ Critical ☐ High ☐ Medium ☐ Low
```

---

## Sign-Off

- [ ] All critical tests passed
- [ ] All UI elements working
- [ ] Error messages clear
- [ ] Mobile responsive
- [ ] Ready for production

**Tested By:** _______________  
**Date:** _______________  
**Status:** ☐ APPROVED ☐ NEEDS FIXES

---

## Quick Reference: What to Look For

| Component | What to Check |
|-----------|---------------|
| Product Row | Red/Yellow highlighting, warning message |
| Sticky Bar | Total weight, item count, button state |
| Modal | Red warning box visibility, button color/text |
| Submit Button | Disabled/enabled state, text changes |
| Error Messages | Clear, specific, actionable |

---

## Browser Compatibility Test

Test in:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

Expected: All should work identically

---

**Need Help?**
- Check `README_VALIDATION_LIVE.md` for overview
- Check `VALIDATION_QUICK_REFERENCE.md` for visual reference
- Check `ORDER_VALIDATION_GUIDE.md` for detailed scenarios
