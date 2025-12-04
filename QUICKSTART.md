# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials.

### 3. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## Environment Variables Checklist

### ✅ Required for Basic Functionality
- `AIRTABLE_BASE_ID` - Your Airtable base ID
- `AIRTABLE_PAT` - Your Airtable personal access token

### ✅ Required for Email Notifications
- `SMTP_HOST` - smtp.gmail.com (for Gmail)
- `SMTP_PORT` - 587
- `SMTP_USER` - Your email address
- `SMTP_PASS` - Your app password (not regular password!)

### ⚙️ Optional - WhatsApp Notifications
- `META_WHATSAPP_TOKEN` - Your Meta access token
- `META_WHATSAPP_PHONE_NUMBER_ID` - Your phone number ID
- `META_WHATSAPP_RECIPIENT` - Recipient phone (e.g., 447700900000)

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server on port 3000

# Production
npm run build            # Build for production
npm start               # Start production server

# Linting
npm run lint            # Check code quality
```

---

## Quick Tests

### Test 1: Check if app loads
1. Run `npm run dev`
2. Open http://localhost:3000
3. You should see the fish order form

### Test 2: Test cart functionality
1. Select "Thermal Box" or "Vacuum Pack"
2. Enter quantity for any fish (e.g., 10 kg)
3. Click "Review & Submit Order"
4. Cart should show your items

### Test 3: Test order submission (requires .env.local)
1. Fill in customer details
2. Submit order
3. Check:
   - Airtable for new record
   - Email inbox for confirmation
   - WhatsApp for notification (if configured)

---

## File Structure Overview

```
📁 Project Root
├── 📁 app/
│   ├── layout.tsx              ← Root layout
│   ├── page.tsx                ← Main order form
│   └── 📁 api/
│       └── submit-order/
│           └── route.ts        ← Server-side API (handles everything)
│
├── 📁 components/
│   ├── CartContext.tsx         ← Shopping cart logic
│   ├── CartSidebar.tsx         ← Cart UI
│   ├── CheckoutModal.tsx       ← Checkout form
│   ├── ProductCard.tsx         ← Product display
│   └── TierProgressBar.tsx     ← Pricing tier indicator
│
├── data.ts                     ← Fish products catalog
├── types.ts                    ← TypeScript types
├── constants.ts                ← Pricing tier thresholds
├── .env.local                  ← Your secrets (DO NOT COMMIT!)
└── .env.example                ← Template for secrets
```

---

## What Happens When Order is Submitted?

```
User clicks "Submit Order"
         ↓
Client sends data to /api/submit-order
         ↓
┌─────────────────────────────────────┐
│  Server-Side Processing             │
│  1. ✅ Save to Airtable             │
│  2. 📧 Send Email confirmation      │
│  3. 💬 Send WhatsApp notification   │
└─────────────────────────────────────┘
         ↓
User sees success message
```

---

## Troubleshooting

### Port 3000 already in use?
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Can't find module errors?
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not working?
1. Ensure file is named `.env.local` (not `.env`)
2. Restart the dev server after changes
3. Check for typos in variable names

---

## Need Help?

📖 **Full Documentation**: See `README.md`
💬 **WhatsApp Setup**: See `WHATSAPP_SETUP.md`
🔧 **Environment Template**: See `.env.example`

---

## Production Deployment Checklist

- [ ] All environment variables set in hosting platform
- [ ] `npm run build` completes successfully
- [ ] Test order submission in production
- [ ] Verify Airtable records are created
- [ ] Verify emails are received
- [ ] Verify WhatsApp messages are sent (if enabled)
- [ ] Check error logging/monitoring
- [ ] Set up backup email/notification system

---

## Security Notes

🔒 **Never commit these files:**
- `.env.local`
- `.env`
- Any file containing API keys

✅ **Safe to commit:**
- `.env.example` (template without real values)
- All code files
- `README.md`, documentation

---

Made with ❤️ for Kerala Fresh Fish
