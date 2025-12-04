# WhatsApp Business API Setup Guide

This guide will help you set up Meta WhatsApp Business API for order notifications.

## Prerequisites

- A Meta (Facebook) Business account
- A verified phone number for WhatsApp Business
- Admin access to Meta Business Manager

## Step-by-Step Setup

### 1. Create a Meta Business App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** in the top right
3. Click **"Create App"**
4. Select **"Business"** as the app type
5. Fill in the app details:
   - **App Name**: Kerala Fresh Fish Orders (or your choice)
   - **App Contact Email**: Your business email
   - **Business Account**: Select or create one

### 2. Add WhatsApp Product

1. From your app dashboard, scroll down to **"Add Products"**
2. Find **"WhatsApp"** and click **"Set Up"**
3. Select **"Business Account"** and choose your account

### 3. Get Your Credentials

#### Phone Number ID

1. In the WhatsApp section, click **"API Setup"**
2. You'll see a **"Phone number ID"** - this is a long number like `123456789012345`
3. Copy this number and add it to your `.env.local`:
   ```
   META_WHATSAPP_PHONE_NUMBER_ID=123456789012345
   ```

#### Access Token

1. In the same API Setup page, you'll see a **"Temporary access token"**
2. For development, copy this token
3. Add it to your `.env.local`:
   ```
   META_WHATSAPP_TOKEN=your_temporary_token_here
   ```

**Note**: Temporary tokens expire after 24 hours. For production, you need to create a permanent token:

#### Creating a Permanent Access Token

1. Go to **Business Settings** → **System Users**
2. Click **"Add"** to create a new system user
3. Assign the system user to your app
4. Generate a token with these permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
5. Copy the permanent token and update your `.env.local`

### 4. Add a Recipient Phone Number

During development/testing, you can only send messages to verified phone numbers.

1. In the WhatsApp API Setup page, find **"To"** section
2. Click **"Add phone number"**
3. Enter the phone number where you want to receive order notifications
4. Verify the number (you'll receive a code via WhatsApp)
5. Add the verified number to `.env.local` in international format (no + or spaces):
   ```
   META_WHATSAPP_RECIPIENT=447700900000
   ```
   - UK: Start with 44
   - US: Start with 1
   - India: Start with 91

### 5. Test Your Setup

1. Start your Next.js app: `npm run dev`
2. Place a test order
3. Check that you receive the WhatsApp message on your verified number

### 6. Go to Production

For production use, you need to:

1. **Verify your business**:
   - Go to Business Manager → Business Settings → Security Center
   - Complete business verification

2. **Submit your app for review**:
   - Go to your app dashboard
   - Navigate to WhatsApp → Get Started
   - Click "Request Advanced Access"
   - Fill out the required information

3. **Update API version**:
   - Make sure your API calls use the latest stable version
   - Currently: `v21.0` (check Meta documentation for updates)

## Troubleshooting

### Message Not Received

**Check 1**: Verify phone number format
```
❌ Wrong: +44 7700 900000
❌ Wrong: 07700900000
✅ Correct: 447700900000
```

**Check 2**: Ensure recipient is verified (for testing)
- During development, only verified numbers can receive messages
- Go to API Setup and verify the number

**Check 3**: Check token expiration
- Temporary tokens expire after 24 hours
- Use a permanent system user token for production

### "Invalid Phone Number" Error

- Remove country code leading zeros
- Ensure no spaces, dashes, or + symbols
- Use international format

### "Insufficient Permissions" Error

- Your access token needs `whatsapp_business_messaging` permission
- Regenerate token with correct scopes

### "Message Could Not Be Sent" Error

- Check that your WhatsApp Business account is active
- Verify you haven't exceeded rate limits
- Check Meta Business Manager for account status

## Message Format

The current implementation sends a plain text message with:
- Customer details
- Order items with quantities and prices
- Total amount and weight
- Delivery address
- Order ID

You can customize the message format in:
`app/api/submit-order/route.ts` (line ~88)

## Rate Limits

Meta WhatsApp Business API has rate limits:
- **Development**: 50 messages per day
- **Business (verified)**: 1,000+ messages per day (varies by tier)

## Costs

- **Cloud API**: Free for first 1,000 conversations per month
- **Paid conversations**: ~$0.005 - $0.10 per conversation (varies by country)
- Check [Meta pricing](https://developers.facebook.com/docs/whatsapp/pricing) for details

## Additional Resources

- [Meta WhatsApp Business Documentation](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Quick Start](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)

## Support

If you need help:
1. Check Meta Business Manager status
2. Review app dashboard for error messages
3. Check server logs for detailed error information
4. Contact Meta Business Support if account-related
