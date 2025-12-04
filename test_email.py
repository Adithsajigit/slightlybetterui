#!/usr/bin/env python3
"""
Test Email Script for Kerala Fresh Fish
Sends a sample order confirmation email without placing an actual order
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from datetime import datetime
import os

# ========================================
# CONFIGURATION (Update these values)
# ========================================
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "sebinsajiabraham@gmail.com"
SMTP_PASS = "xwymfvrypyhyojlj"

# Test email recipient (use your own email to receive the test)
TEST_EMAIL = "sebinsajiabraham@gmail.com"

# Sample order data
CUSTOMER_NAME = "Test Customer"
CUSTOMER_COMPANY = "Sample Restaurant Ltd"
CUSTOMER_EMAIL = TEST_EMAIL
CUSTOMER_PHONE = "+44 7700 900000"
CUSTOMER_ADDRESS = """123 High Street
London, UK
EC1A 1BB"""

ORDER_ID = "TEST-12345678"
ORDER_TIER = "Gold"  # Options: Silver, Gold, Platinum, Diamond
TOTAL_WEIGHT = 45.5
GRAND_TOTAL = 425.75

# Sample order items
ORDER_ITEMS = [
    {
        "english_name": "Tiger Prawns",
        "malayalam_name": "കടുവ ചെമ്മീൻ",
        "preparation": "Cleaned & Deveined",
        "packaging": "Vacuum Pack",
        "quantity": 10.0,
        "price_per_kg": 12.50,
        "line_total": 125.00
    },
    {
        "english_name": "King Fish",
        "malayalam_name": "നെയ്മീൻ",
        "preparation": "Sliced",
        "packaging": "Thermal Box",
        "quantity": 15.5,
        "price_per_kg": 9.50,
        "line_total": 147.25
    },
    {
        "english_name": "Pomfret",
        "malayalam_name": "ആവോലി",
        "preparation": "Whole",
        "packaging": "Thermal Box",
        "quantity": 20.0,
        "price_per_kg": 7.65,
        "line_total": 153.50
    }
]

def format_currency(amount):
    """Format amount in GBP"""
    return f"£{amount:,.2f}"

def get_tier_color(tier):
    """Get tier badge styling"""
    tier_colors = {
        'Diamond': {'bg': '#dcfce7', 'text': '#166534', 'emoji': '💎'},
        'Platinum': {'bg': '#e0f2fe', 'text': '#075985', 'emoji': '🏆'},
        'Gold': {'bg': '#fef3c7', 'text': '#92400e', 'emoji': '🥇'},
        'Silver': {'bg': '#f1f5f9', 'text': '#334155', 'emoji': '🥈'}
    }
    return tier_colors.get(tier, tier_colors['Silver'])

def generate_items_html(items):
    """Generate HTML for order items"""
    items_html = ""
    for index, item in enumerate(items):
        bg_color = '#ffffff' if index % 2 == 0 else '#f8fafc'
        items_html += f"""
            <tr style="background-color: {bg_color};">
                <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
                    <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">{item['english_name']}</div>
                    <div style="font-size: 13px; color: #64748b;">{item['malayalam_name']}</div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">{item['preparation']} • {item['packaging']}</div>
                </td>
                <td style="padding: 12px 16px; text-align: center; border-bottom: 1px solid #e2e8f0; font-weight: 500; color: #475569;">{item['quantity']} kg</td>
                <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #e2e8f0; color: #64748b;">{format_currency(item['price_per_kg'])}/kg</td>
                <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">{format_currency(item['line_total'])}</td>
            </tr>
        """
    return items_html

def create_email_html():
    """Create the beautiful email HTML template"""
    tier_color = get_tier_color(ORDER_TIER)
    items_html = generate_items_html(ORDER_ITEMS)
    current_date = datetime.now().strftime('%d %B %Y')
    current_year = datetime.now().year
    
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    
    <!-- Main Container -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
        <tr>
            <td align="center">
                
                <!-- Email Content -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background-color: #ffffff !important; padding: 50px 40px; text-align: center; border-bottom: 3px solid #e2e8f0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background-color: #ffffff !important;">
                                        <img src="cid:logo" alt="Kerala Fresh Fish" style="width: 280px; height: 280px; object-fit: contain; margin: 0 auto; display: block; background-color: white;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Success Badge -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; padding: 20px; margin: -20px 0 30px 0; text-align: center; border: 2px solid #86efac;">
                                <div style="font-size: 32px; margin-bottom: 8px;">✅</div>
                                <h2 style="margin: 0; color: #166534; font-size: 20px; font-weight: 700;">Order Confirmed!</h2>
                                <p style="margin: 6px 0 0 0; color: #15803d; font-size: 14px;">We've received your wholesale order</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <p style="margin: 0; font-size: 16px; color: #334155; line-height: 1.6;">
                                Dear <strong style="color: #0f172a;">{CUSTOMER_NAME}</strong>,
                            </p>
                            <p style="margin: 12px 0 0 0; font-size: 15px; color: #64748b; line-height: 1.6;">
                                Thank you for your order! We're already preparing your premium seafood selection and will have it ready for delivery shortly.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Order Summary Card -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border: 2px solid #e2e8f0;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                            <h3 style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 700;">Order Summary</h3>
                                            <span style="background-color: {tier_color['bg']}; color: {tier_color['text']}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block;">{tier_color['emoji']} {ORDER_TIER} Tier</span>
                                        </div>
                                        <table width="100%" style="margin-top: 16px;">
                                            <tr>
                                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company:</td>
                                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">{CUSTOMER_COMPANY}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Weight:</td>
                                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">{TOTAL_WEIGHT} kg</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Order Date:</td>
                                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">{current_date}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Order Items Title -->
                    <tr>
                        <td style="padding: 0 40px 16px 40px;">
                            <h3 style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 700;">Order Items</h3>
                        </td>
                    </tr>
                    
                    <!-- Order Items Table -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                                <thead>
                                    <tr style="background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);">
                                        <th style="padding: 14px 16px; text-align: left; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                                        <th style="padding: 14px 16px; text-align: center; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Quantity</th>
                                        <th style="padding: 14px 16px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                                        <th style="padding: 14px 16px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items_html}
                                </tbody>
                                <tfoot>
                                    <tr style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                                        <td colspan="3" style="padding: 20px 16px; text-align: right; color: #ffffff; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">GRAND TOTAL:</td>
                                        <td style="padding: 20px 16px; text-align: right; color: #fbbf24; font-size: 20px; font-weight: 700;">{format_currency(GRAND_TOTAL)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Delivery Information -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #f8fafc; border-left: 4px solid #0ea5e9; border-radius: 8px; padding: 20px;">
                                <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px; font-weight: 700;">📍 Delivery Information</h4>
                                <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                                    <strong style="color: #0f172a;">Address:</strong><br>
                                    {CUSTOMER_ADDRESS.replace(chr(10), '<br>')}
                                </p>
                                <p style="margin: 12px 0 0 0; color: #475569; font-size: 14px;">
                                    <strong style="color: #0f172a;">Contact:</strong> {CUSTOMER_PHONE}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Next Steps -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 24px; border: 2px solid #bfdbfe;">
                                <h4 style="margin: 0 0 16px 0; color: #075985; font-size: 16px; font-weight: 700;">📋 What Happens Next?</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 14px; line-height: 1.8;">
                                    <li>Our team will prepare your order with the freshest catch</li>
                                    <li>You'll receive a pro-forma invoice within 24 hours</li>
                                    <li>Delivery will be scheduled according to your requirements</li>
                                    <li>Quality guaranteed with our premium selection process</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Contact Support -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px;">
                                Questions about your order? We're here to help!
                            </p>
                            <a href="mailto:{SMTP_USER}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.3);">
                                📧 Contact Support
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 2px solid #e2e8f0;">
                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                                <strong style="color: #0f172a;">Kerala Fresh Fish</strong> • Premium Wholesale Seafood
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                                This is an automated confirmation email. Please do not reply directly to this message.<br>
                                For any inquiries, please contact us at {SMTP_USER}
                            </p>
                            <p style="margin: 16px 0 0 0; color: #cbd5e1; font-size: 11px;">
                                © {current_year} Kerala Fresh Fish. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
    """
    return html

def send_test_email():
    """Send the test email"""
    try:
        print("🐟 Kerala Fresh Fish - Test Email Sender")
        print("=" * 50)
        print(f"📧 Sending test email to: {TEST_EMAIL}")
        print(f"🏢 From: {SMTP_USER}")
        print()
        
        # Create message
        msg = MIMEMultipart('related')
        msg['Subject'] = f"🐟 Order Confirmation #{ORDER_ID[-8:]} - {CUSTOMER_COMPANY}"
        msg['From'] = f"Kerala Fresh Fish Orders <{SMTP_USER}>"
        msg['To'] = TEST_EMAIL
        
        # Attach HTML
        html_part = MIMEText(create_email_html(), 'html')
        msg.attach(html_part)
        
        # Attach logo
        logo_path = 'public/logo.png'
        if os.path.exists(logo_path):
            with open(logo_path, 'rb') as f:
                img = MIMEImage(f.read())
                img.add_header('Content-ID', '<logo>')
                msg.attach(img)
            print("✅ Logo attached")
        else:
            print("⚠️  Logo not found at 'public/logo.png' - email will send without logo")
        
        # Connect to SMTP server
        print("📡 Connecting to SMTP server...")
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        
        # Login
        print("🔐 Authenticating...")
        server.login(SMTP_USER, SMTP_PASS)
        
        # Send email
        print("📨 Sending email...")
        server.send_message(msg)
        server.quit()
        
        print()
        print("=" * 50)
        print("✅ SUCCESS! Test email sent successfully!")
        print("=" * 50)
        print()
        print(f"📬 Check your inbox at: {TEST_EMAIL}")
        print("💡 Don't forget to check spam folder if you don't see it")
        print()
        print("📊 Email Details:")
        print(f"   • Order ID: {ORDER_ID}")
        print(f"   • Tier: {ORDER_TIER}")
        print(f"   • Total Weight: {TOTAL_WEIGHT} kg")
        print(f"   • Grand Total: {format_currency(GRAND_TOTAL)}")
        print(f"   • Items: {len(ORDER_ITEMS)}")
        print()
        
    except smtplib.SMTPAuthenticationError:
        print("❌ ERROR: Authentication failed!")
        print("   Check your SMTP_USER and SMTP_PASS credentials")
        print("   For Gmail, make sure you're using an App Password")
    except smtplib.SMTPException as e:
        print(f"❌ SMTP Error: {e}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    send_test_email()
