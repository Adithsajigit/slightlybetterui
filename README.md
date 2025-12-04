# Kerala Fresh Fish - B2B Wholesale Ordering System

A Next.js-based wholesale fish ordering application with integrated backend services for Airtable, Email notifications, and WhatsApp Business messaging.

## 🚀 Features

- **Dynamic Product Catalog** - Browse fish products with Malayalam names and English translations
- **Tiered Pricing System** - Automatic discounts based on order volume (Silver, Gold, Platinum, Diamond)
- **Real-time Cart Management** - Add products and see total calculations instantly
- **Server-Side Order Processing**:
  - 📊 **Airtable Integration** - Automatic order and item record creation
  - 📧 **Email Notifications** - Professional order confirmations via SMTP
  - 💬 **WhatsApp Business API** - Instant order notifications via Meta Business

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Airtable Account** with a configured base
- **Email Account** with SMTP access (Gmail recommended)
- **Meta Business Account** with WhatsApp API access (optional)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

#### **Airtable Setup**
1. Go to https://airtable.com/create/tokens
2. Create a Personal Access Token with `data.records:read` and `data.records:write` scopes
3. Get your Base ID from the URL when viewing your base
4. Update:
   ```
   AIRTABLE_BASE_ID=your_base_id
   AIRTABLE_PAT=your_token
   ```

#### **Email Setup (Gmail)**
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Update:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_character_app_password
   ```

#### **WhatsApp Business API Setup** (Optional)
1. Go to https://developers.facebook.com/
2. Create a Business App and enable WhatsApp Business API
3. Get your Access Token and Phone Number ID from WhatsApp settings
4. Update:
   ```
   META_WHATSAPP_TOKEN=your_token
   META_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   META_WHATSAPP_RECIPIENT=447700900000
   ```
   *Note: Phone number should be in international format without + or spaces*

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Hybrid Next.js Approach

**Client-Side (Interactive UI)**
- Product browsing with real-time filtering
- Shopping cart with dynamic pricing
- Form validation and user input

**Server-Side (API Routes)**
- `/api/submit-order` - Handles all backend operations:
  - Airtable record creation
  - Email sending via Nodemailer
  - WhatsApp messaging via Meta API
  - All credentials secured server-side

### Why This Architecture?

✅ **Security** - API keys never exposed to client  
✅ **Performance** - Fast, interactive UI with secure backend  
✅ **Reliability** - Server-side processing with error handling  
✅ **Scalability** - Easy to add more integrations  

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main order form (client component)
│   └── api/
│       └── submit-order/
│           └── route.ts    # Server-side API endpoint
├── components/
│   ├── CartContext.tsx     # Cart state management
│   ├── CartSidebar.tsx     # Cart UI component
│   ├── CheckoutModal.tsx   # Checkout form
│   ├── ProductCard.tsx     # Product display
│   └── TierProgressBar.tsx # Pricing tier indicator
├── data.ts                 # Product catalog
├── types.ts               # TypeScript definitions
├── constants.ts           # Pricing thresholds
└── next.config.js         # Next.js configuration
```

## 🔧 Troubleshooting

### Email Not Sending
- Verify SMTP credentials are correct
- Check that 2FA is enabled and you're using an App Password (not your regular password)
- Ensure port 587 is not blocked by your firewall

### WhatsApp Not Working
- Verify your Meta Business app is approved for production
- Check that the Phone Number ID is correct (not your actual phone number)
- Ensure recipient number is in international format without + or spaces
- Check Meta Business dashboard for API errors

### Airtable Errors
- Verify your PAT has correct permissions
- Check that table names match exactly ("Orders" and "Order Items")
- Ensure Base ID is correct

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to:
- AWS Amplify
- Netlify
- Railway
- Digital Ocean App Platform

## 📄 License

Private - B2B Internal Use

## 🤝 Support

For issues or questions, contact your development team.
