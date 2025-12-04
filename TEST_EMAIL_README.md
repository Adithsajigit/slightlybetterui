# 📧 Test Email Script - Quick Guide

## 🚀 Quick Start

Just run this command to send a test email:

```bash
python3 test_email.py
```

## 📝 What It Does

Sends a beautiful sample order confirmation email with:
- ✅ Your company logo
- ✅ Professional HTML design
- ✅ Sample order items (3 fish products)
- ✅ Pricing tier badge (Gold)
- ✅ Customer details
- ✅ All the styling from your actual emails

## ⚙️ Configuration

Edit `test_email.py` to customize:

### Email Settings (Lines 16-20)
```python
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "your_email@gmail.com"      # Your Gmail
SMTP_PASS = "your_app_password"         # Gmail App Password
TEST_EMAIL = "recipient@email.com"       # Where to send test
```

### Sample Order Data (Lines 23-35)
```python
CUSTOMER_NAME = "Test Customer"
CUSTOMER_COMPANY = "Sample Restaurant Ltd"
ORDER_TIER = "Gold"  # Options: Silver, Gold, Platinum, Diamond
TOTAL_WEIGHT = 45.5
GRAND_TOTAL = 425.75
```

### Sample Products (Lines 38-64)
Add/remove/modify the sample fish products in `ORDER_ITEMS` list.

## 🎨 Tier Options

Change the `ORDER_TIER` to see different badge styles:
- **Silver** 🥈 - Gray badge
- **Gold** 🥇 - Yellow badge  
- **Platinum** 🏆 - Blue badge
- **Diamond** 💎 - Green badge

## 📊 Sample Output

When you run the script, you'll see:

```
🐟 Kerala Fresh Fish - Test Email Sender
==================================================
📧 Sending test email to: your_email@gmail.com
🏢 From: your_email@gmail.com

✅ Logo attached
📡 Connecting to SMTP server...
🔐 Authenticating...
📨 Sending email...

==================================================
✅ SUCCESS! Test email sent successfully!
==================================================

📬 Check your inbox at: your_email@gmail.com
```

## 🔧 Requirements

Python 3 (already installed on most systems)

No additional packages needed - uses standard library:
- `smtplib` - Email sending
- `email.mime` - Email formatting
- `datetime` - Date formatting

## 💡 Tips

1. **Check Spam Folder** - First emails often go to spam
2. **Logo Required** - Make sure `public/logo.png` exists
3. **Gmail Users** - Must use App Password, not regular password
4. **Test Before Production** - Always test with your own email first

## 🎯 Use Cases

- Preview email design before deploying
- Test different tier badges
- Test with different product combinations
- Debug email formatting issues
- Show clients/stakeholders email design
- Quick visual testing without placing orders

## 🛠️ Troubleshooting

### "Authentication failed"
- Check `SMTP_USER` is correct
- Make sure using Gmail App Password (not regular password)
- 2FA must be enabled on Gmail

### "Logo not found"
```bash
# Check logo exists:
ls -la public/logo.png

# If missing, copy it:
cp logo.PNG public/logo.png
```

### Email in Spam
- Mark as "Not Spam" 
- Add sender to contacts
- This improves delivery for future emails

## 📝 Modifying the Template

The email template in `test_email.py` matches your actual template in:
`app/api/submit-order/route.ts`

If you update one, consider updating the other to keep them in sync.

## 🔄 Compare with Live System

**Test Script** → Instant preview without order  
**Live System** → Submit real order through website  

Both use the same template design!

---

**Made with ❤️ for Kerala Fresh Fish**
