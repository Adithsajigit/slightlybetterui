# 🧪 Quick Test: 10kg Minimum Fix

## ⚡ Fast Test (2 minutes)

### Test 1: Try 9kg Entry
```
1. Go to http://localhost:3001
2. Find "Anchovy" or any product
3. Click quantity field
4. Type: 9
5. Press Tab or click elsewhere

✅ EXPECTED:
   - Row turns RED
   - Message: "⚠️ Minimum 10kg required"
   - Quantity field is cleared
   - Item is NOT in cart (sticky bar is empty or item not listed)
```

### Test 2: Try 10kg Entry
```
1. Same product
2. Click quantity field
3. Type: 10
4. Press Tab or click elsewhere

✅ EXPECTED:
   - Red warning disappears
   - Row turns YELLOW
   - Item appears in sticky bar at bottom
   - "REVIEW ORDER (1)" button appears
```

### Test 3: Try 9 Then 0 (Making 90)
```
1. Same product, clear field
2. Type: 9
   → Red warning
3. Type: 0 (making it "90")
   
✅ EXPECTED:
   - "90" IS accepted (it's >= 10)
   - Row turns YELLOW
   - Item in cart ✓
```

### Test 4: Checkout with Invalid Item
```
1. Clear everything
2. Add: Anchovy 5kg + Barramundi 100kg = 105kg total
3. Click "REVIEW ORDER"

✅ EXPECTED:
   - Modal opens
   - RED ERROR BOX appears:
     "🚫 INVALID PRODUCTS - Below 10kg Minimum"
     "❌ Anchovy - Currently: 5kg (Need: 10kg minimum)"
   - Submit button is GRAY and disabled
   - Button shows: "Fix Products (< 10kg)"
   - Cannot click submit button
```

### Test 5: Fix And Submit
```
Continuing from Test 4:
1. Click Cancel
2. Go back to table
3. Fix Anchovy: change to 10kg
4. Click "REVIEW ORDER" again

✅ EXPECTED:
   - No error boxes
   - Submit button is BLUE
   - Button says: "Submit Order"
   - Can click and submit ✓
```

---

## ⏱️ Complete Test (5 minutes)

Run all 5 tests above, then:

### Test 6: Multiple Invalid Items
```
1. Add:
   - Anchovy: 8kg
   - Barramundi: 9kg
   - Mackerel: 95kg
   Total: 112kg

2. Click "REVIEW ORDER"

✅ EXPECTED:
   - Error box shows BOTH invalid items:
     "❌ Anchovy - Currently: 8kg (Need: 10kg)"
     "❌ Barramundi - Currently: 9kg (Need: 10kg)"
   - Button text: "Fix Products (< 10kg)"
   - Submit blocked
```

### Test 7: Edge Case - Decimals
```
1. Try: 9.9kg → RED warning ✓
2. Try: 10.1kg → Accepted (yellow) ✓
3. Try: 10.0kg → Accepted (yellow) ✓
```

### Test 8: Full Valid Order
```
1. Add:
   - Product 1: 20kg
   - Product 2: 35kg
   - Product 3: 50kg
   Total: 105kg

2. All show YELLOW ✓
3. Click "REVIEW ORDER"
4. No error boxes ✓
5. Submit button is BLUE ✓
6. Fill customer details
7. Submit ✓

✅ ORDER SUCCEEDS
```

---

## ✅ Success Criteria

All of these MUST be true:

- [ ] Cannot enter values < 10kg without warning
- [ ] Values < 10kg are not added to cart
- [ ] Values < 10kg are cleared on blur
- [ ] Checkout shows error for any item < 10kg
- [ ] Error shows exactly which items are invalid
- [ ] Submit button is disabled when any item < 10kg
- [ ] Submit button text changes to "Fix Products (< 10kg)"
- [ ] Can submit once all items are >= 10kg
- [ ] No validation errors in browser console

---

## 📍 Server Location

**http://localhost:3001**

(Port 3000 is in use, so server uses 3001)

---

## 🐛 If Something's Wrong

Check browser console (F12):
- Any red errors?
- Any warnings?

If you see TypeScript or React errors, let me know what they are!

---

**Ready? Go test it now!** 🚀
