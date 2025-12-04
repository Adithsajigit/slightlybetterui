# Email Testing Guide

## ✅ Email Functionality is Already Implemented!

When a customer clicks "Submit Order", an email is **automatically sent** to:
- ✉️ **Customer's email address** (entered in the form)
- 📋 **BCC copy to you** (your SMTP_USER email)

## 📧 What the Email Contains:

1. **Professional order confirmation** with Kerala Fresh Fish branding
2. **Customer details** (name, company, contact info)
3. **Complete order table** with:
   - Product names (English & Malayalam)
   - Quantities in kg
   - Prices per kg
   - Line totals
4. **Order summary**:
   - Tier applied (Silver/Gold/Platinum/Diamond)
   - Total weight
   - Grand total amount in GBP
5. **Delivery address** and contact information

## 🔧 Setup Required (One-Time):

### Step 1: Configure Environment Variables

Edit your `.env.local` file with SMTP credentials:

```env
# For Gmail (Recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

### Step 2: Get Gmail App Password

**Important**: You need an **App Password**, not your regular Gmail password!

1. Go to your Google Account: https://myaccount.google.com/
2. Enable **2-Factor Authentication** (required for app passwords)
3. Go to **Security** → **2-Step Verification** → **App passwords**
4. Generate a new app password:
   - Select "Mail" as the app
   - Select "Other (Custom name)" as device
   - Name it: "Kerala Fish Orders"
5. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
6. Paste it in `.env.local` as `SMTP_PASS` (without spaces)

### Step 3: Restart Your Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🧪 Test Email Functionality:

### Test 1: Check Environment Variables
```bash
# In your terminal, run:
cd "/home/hp/Desktop/airtable work/websites/copy-of-kerala-fresh-fish-importer-with-full-fish-and-data (1)"
npm run dev
```

Look for this in the console:
- ✅ No warnings about missing SMTP variables = Configured correctly
- ⚠️ Warning about missing SMTP = Check your `.env.local`

### Test 2: Submit a Test Order

1. Open http://localhost:3000
2. Select packaging type
3. Add some fish products (e.g., 10kg of any item)
4. Click "Review & Submit Order"
5. Fill in the checkout form:
   - **Name**: Test Customer
   - **Company**: Test Company Ltd
   - **Email**: YOUR_EMAIL@gmail.com (use your email for testing!)
   - **Phone**: +44 7000 000000
   - **Address**: 123 Test Street, London
6. Click "Submit Order"

### Test 3: Check Results

After submitting, check:

1. **Server Console** - You should see:
   ```
   Attempting to send email to: YOUR_EMAIL@gmail.com
   ✅ Email sent successfully to: YOUR_EMAIL@gmail.com
   📊 Order Processing Summary:
     - Order ID: ...
     - Email Sent: ✅
     - WhatsApp Sent: ❌ (unless configured)
   ```

2. **Email Inbox** - Check your email for:
   - Subject: "Order Confirmation - Test Company Ltd"
   - Professional HTML email with order details
   - Check spam folder if not in inbox

3. **BCC Copy** - You'll also receive a copy at your SMTP_USER email

## 🔍 Troubleshooting:

### Problem: "Email Sent: ❌" in console

**Check 1**: Environment variables
```bash
# Make sure .env.local exists and has correct values
cat .env.local | grep SMTP
```

**Check 2**: Restart server after changing .env.local
```bash
# Stop server (Ctrl+C) and restart
npm run dev
```

**Check 3**: Verify App Password
- Must be 16 characters (without spaces)
- Must be from Google App Passwords, not regular password
- 2FA must be enabled on your Google account

### Problem: Email in Spam Folder

This is normal for the first few emails. To fix:
1. Mark email as "Not Spam"
2. Add sender to contacts
3. After 2-3 emails, Gmail will trust the sender

### Problem: "Invalid credentials" error

```
❌ Email sending failed: Error: Invalid login
```

**Solution**:
1. Double-check your SMTP_USER (must be full email)
2. Regenerate App Password from Google
3. Make sure 2FA is enabled
4. Try removing spaces from app password

### Problem: "Connection timeout"

**Solution**:
1. Check firewall isn't blocking port 587
2. Try using port 465 with `secure: true` in code
3. Check if your ISP blocks SMTP

## 📋 Alternative Email Providers:

### Using Outlook/Hotmail:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

### Using SendGrid (Recommended for production):
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

### Using Mailgun:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_password
```

## 📊 What Gets Logged:

Every order submission logs:
- ✅ Email attempt and result
- ✅ WhatsApp attempt and result (if configured)
- ✅ Order ID
- ✅ Customer email address
- ❌ Any errors with full details

Check your terminal/console to see these logs.

## 🎯 Production Tips:

1. **Use a dedicated email** for orders (e.g., orders@yourcompany.com)
2. **Set up email forwarding** to notify multiple people
3. **Monitor logs** for failed email attempts
4. **Consider a transactional email service** (SendGrid, Mailgun) for better deliverability
5. **Test regularly** to ensure emails are being delivered

## 📝 Customizing the Email:

To modify the email template, edit:
`app/api/submit-order/route.ts` (lines 90-145)

You can change:
- Email subject line
- Header styling and colors
- Company branding
- Footer text
- Add logo image

## ✉️ Email Preview:

The customer receives an email like this:

```
┌─────────────────────────────────────────┐
│ Order Confirmation (blue header)        │
├─────────────────────────────────────────┤
│ Dear Test Customer,                     │
│                                         │
│ Thank you for your order with Kerala    │
│ Fresh Fish. We have received your      │
│ request and will process it shortly.   │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ Order Summary                   │   │
│ │ Tier Applied: Silver            │   │
│ │ Total Weight: 10.00 kg          │   │
│ └─────────────────────────────────┘   │
│                                         │
│ [Detailed table with all products]     │
│                                         │
│ Grand Total: £96.20                     │
│                                         │
│ Delivery Address:                       │
│ 123 Test Street, London                 │
│ +44 7000 000000                         │
└─────────────────────────────────────────┘
```

---

**Need more help?** Check the server console logs after submitting an order - they'll tell you exactly what happened with the email!
