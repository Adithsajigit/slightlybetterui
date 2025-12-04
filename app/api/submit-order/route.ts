import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { generateInvoicePDF, generateInvoiceNumber } from '@/services/invoiceService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { summary, customer } = body;
    
    // Server-side environment variables
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT;

    // 1. SAVE TO AIRTABLE
    // We proceed with Airtable logic first to ensure data is safe.
    let orderRecordId = "PENDING-" + Date.now();

    if (AIRTABLE_BASE_ID && AIRTABLE_PAT) {
        // 1. CREATE THE PARENT ORDER RECORD
        const orderRecordFields = {
            "Customer Name": customer.name,
            "Company Name": customer.companyName,
            "Email": customer.email,
            "Phone": customer.phone,
            "Address": customer.address,
            "Total Weight": summary.totalWeight,
            "Total Price": summary.subtotal,
            "Tier Applied": summary.tier,
            "Order JSON": JSON.stringify(summary.items)
        };

        const orderResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields: orderRecordFields })
        });

        if (orderResponse.ok) {
            const orderJson = await orderResponse.json();
            orderRecordId = orderJson.id; // Real ID from Airtable

            // 2. CREATE THE CHILD ITEM RECORDS
            const itemsPayload = summary.items.map((item: any) => ({
                fields: {
                    "Order Link": [orderRecordId],
                    "Product Name": item.product.englishName,
                    "Code": item.product.code,
                    "Preparation": item.product.preparation,
                    "Packaging": item.product.packaging,
                    "Quantity KG": item.quantity,
                    "Price Per KG": item.price,
                    "Line Total": item.lineTotal
                }
            }));

            const chunkSize = 10;
            for (let i = 0; i < itemsPayload.length; i += chunkSize) {
                const chunk = itemsPayload.slice(i, i + chunkSize);
                await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Order Items`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_PAT}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ records: chunk })
                });
            }
        }
    }

    // 2. SEND EMAIL CONFIRMATION (NODEMAILER)
    // Check if SMTP env vars are present
    let emailSent = false;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
            console.log('Attempting to send email to:', customer.email);
            
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

        const formatCurrency = (amount: number) => 
            new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

        // Generate item rows
        const itemsHtml = summary.items.map((item: any) => `
            <tr>
                <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0;">
                    <div style="font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">${item.product.englishName}</div>
                    <div style="font-size: 13px; color: #757575;">${item.product.malayalamName} • ${item.product.preparation}</div>
                </td>
                <td style="padding: 14px 16px; text-align: center; color: #424242; border-bottom: 1px solid #e0e0e0; white-space: nowrap;">${item.quantity} kg</td>
                <td style="padding: 14px 16px; text-align: right; color: #616161; border-bottom: 1px solid #e0e0e0; white-space: nowrap;">${formatCurrency(item.price)}</td>
                <td style="padding: 14px 16px; text-align: right; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #e0e0e0; white-space: nowrap;">${formatCurrency(item.lineTotal)}</td>
            </tr>
        `).join('');

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                
                <!-- Main Container -->
                <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #0066cc;">
                            <img src="cid:logo" alt="Kerala Fresh Fish" style="width: 150px; height: auto;" />
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 35px 40px 25px 40px;">
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #212529; line-height: 1.6;">
                                Dear <strong>${customer.name}</strong>,
                            </p>
                            <p style="margin: 0; font-size: 15px; color: #495057; line-height: 1.6;">
                                Thank you for your order. We have received your request and are processing it. Below are the details of your order.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Order Summary -->
                    <tr>
                        <td style="padding: 0 40px 25px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border: 1px solid #dee2e6;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <span style="color: #6c757d; font-size: 14px;">Company:</span>
                                                    <span style="color: #212529; font-size: 14px; font-weight: 600; float: right;">${customer.companyName}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #dee2e6;">
                                                    <span style="color: #6c757d; font-size: 14px;">Order Date:</span>
                                                    <span style="color: #212529; font-size: 14px; font-weight: 600; float: right;">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #dee2e6;">
                                                    <span style="color: #6c757d; font-size: 14px;">Total Weight:</span>
                                                    <span style="color: #212529; font-size: 14px; font-weight: 600; float: right;">${summary.totalWeight.toFixed(2)} kg</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px solid #dee2e6;">
                                                    <span style="color: #6c757d; font-size: 14px;">Pricing Tier:</span>
                                                    <span style="color: #0066cc; font-size: 14px; font-weight: 600; float: right;">${summary.tier}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Order Items -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <h2 style="margin: 0 0 15px 0; color: #212529; font-size: 18px; font-weight: 600;">Order Details</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #dee2e6;">
                                <thead>
                                    <tr style="background-color: #343a40;">
                                        <th style="padding: 14px 20px; text-align: left; color: #ffffff; font-size: 13px; font-weight: 600;">Product</th>
                                        <th style="padding: 14px 20px; text-align: center; color: #ffffff; font-size: 13px; font-weight: 600;">Quantity</th>
                                        <th style="padding: 14px 20px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600;">Price/kg</th>
                                        <th style="padding: 14px 20px; text-align: right; color: #ffffff; font-size: 13px; font-weight: 600;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr style="background-color: #212529;">
                                        <td colspan="3" style="padding: 18px 20px; text-align: right; color: #ffffff; font-size: 16px; font-weight: 600;">Order Total:</td>
                                        <td style="padding: 18px 20px; text-align: right; color: #ffc107; font-size: 18px; font-weight: 700;">${formatCurrency(summary.subtotal)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Delivery Address -->
                    <tr>
                        <td style="padding: 0 40px 25px 40px;">
                            <h3 style="margin: 0 0 12px 0; color: #212529; font-size: 16px; font-weight: 600;">Delivery Address</h3>
                            <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 18px; border-left: 4px solid #0066cc;">
                                <p style="margin: 0 0 10px 0; color: #495057; font-size: 14px; line-height: 1.6;">
                                    ${customer.address.replace(/\n/g, '<br>')}
                                </p>
                                <p style="margin: 0; color: #495057; font-size: 14px;">
                                    <strong>Phone:</strong> ${customer.phone}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Next Steps -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <h3 style="margin: 0 0 15px 0; color: #212529; font-size: 16px; font-weight: 600;">Next Steps</h3>
                            <div style="background-color: #e7f3ff; border: 1px solid #b3d9ff; padding: 20px;">
                                <ul style="margin: 0; padding-left: 20px; color: #004085; font-size: 14px; line-height: 2;">
                                    <li>We will prepare your order with fresh, high-quality seafood</li>
                                    <li>A pro-forma invoice will be sent to you within 24 hours</li>
                                    <li>Our team will contact you to schedule the delivery</li>
                                    <li>Please contact us if you have any questions</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Contact -->
                    <tr>
                        <td style="padding: 0 40px 35px 40px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px;">
                                If you have any questions, please don't hesitate to contact us.
                            </p>
                            <a href="mailto:${process.env.SMTP_USER}" style="display: inline-block; background-color: #0066cc; color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 14px; font-weight: 600; border-radius: 4px;">
                                Contact Us
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #343a40; padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 15px; font-weight: 600;">Kerala Fresh Fish</p>
                            <p style="margin: 0 0 15px 0; color: #adb5bd; font-size: 13px;">Premium Wholesale Seafood Supplier</p>
                            <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.5;">
                                © ${new Date().getFullYear()} Kerala Fresh Fish. All rights reserved.<br>
                                This is an automated message. Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
        `;

        // Generate Invoice PDF
        const invoiceNumber = generateInvoiceNumber();
        const invoiceData = {
            invoiceNumber,
            orderDate: new Date(),
            customer: {
                name: customer.name,
                companyName: customer.companyName,
                address: customer.address,
                phone: customer.phone,
            },
            items: summary.items,
            subtotal: summary.subtotal,
            totalWeight: summary.totalWeight,
            tier: summary.tier,
        };

        const invoicePDF = await generateInvoicePDF(invoiceData);
        console.log('✅ Invoice PDF generated:', invoiceNumber);

        await transporter.sendMail({
            from: `"Kerala Fresh Fish Orders" <${process.env.SMTP_USER}>`,
            to: customer.email, // Send to buyer
            bcc: process.env.SMTP_USER, // Send copy to seller
            subject: `🐟 Order Confirmation #${orderRecordId.slice(-8)} - ${customer.companyName}`,
            html: emailHtml,
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(process.cwd(), 'public', 'logo.png'),
                    cid: 'logo' // same cid value as in the html img src
                },
                {
                    filename: `Invoice-${invoiceNumber}.pdf`,
                    content: invoicePDF,
                    contentType: 'application/pdf'
                }
            ]
        });
        
        emailSent = true;
        console.log('✅ Email sent successfully to:', customer.email);
        console.log('📄 Invoice PDF attached:', `Invoice-${invoiceNumber}.pdf`);
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError);
            // Don't fail the entire request if email fails
        }
    } else {
        console.log('⚠️ Email not configured - missing SMTP environment variables');
    }

    // 3. SEND WHATSAPP MESSAGE (META BUSINESS API)
    // Check if WhatsApp env vars are present
    let whatsappSent = false;
    if (process.env.META_WHATSAPP_TOKEN && process.env.META_WHATSAPP_PHONE_NUMBER_ID) {
        try {
            console.log('Attempting to send WhatsApp message...');
            
            const whatsappPhoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
            const whatsappToken = process.env.META_WHATSAPP_TOKEN;
            const recipientPhone = process.env.META_WHATSAPP_RECIPIENT || customer.phone.replace(/[^0-9]/g, '');

            // Format currency
            const formatCurrency = (amount: number) => 
                new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

            // Create a concise order summary for WhatsApp
            const itemsList = summary.items
                .map((item: any) => 
                    `• ${item.product.englishName} - ${item.quantity}kg @ ${formatCurrency(item.price)}/kg = ${formatCurrency(item.lineTotal)}`
                )
                .join('\n');

            const whatsappMessage = `🐟 *NEW ORDER RECEIVED* 🐟

*Customer:* ${customer.name}
*Company:* ${customer.companyName}
*Phone:* ${customer.phone}
*Email:* ${customer.email}

*Order Details:*
${itemsList}

*Tier Applied:* ${summary.tier}
*Total Weight:* ${summary.totalWeight.toFixed(2)} kg
*Total Amount:* ${formatCurrency(summary.subtotal)}

*Delivery Address:*
${customer.address}

*Order ID:* ${orderRecordId}

Please process this order promptly.`;

            // Send WhatsApp message using Meta Business API
            const whatsappApiUrl = `https://graph.facebook.com/v21.0/${whatsappPhoneNumberId}/messages`;
            
            await axios.post(
                whatsappApiUrl,
                {
                    messaging_product: "whatsapp",
                    to: recipientPhone,
                    type: "text",
                    text: {
                        preview_url: false,
                        body: whatsappMessage
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${whatsappToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            whatsappSent = true;
            console.log('✅ WhatsApp message sent successfully');
        } catch (whatsappError) {
            console.error('❌ WhatsApp sending failed:', whatsappError);
            // Don't fail the entire request if WhatsApp fails
        }
    } else {
        console.log('⚠️ WhatsApp not configured - missing META environment variables');
    }

    // Summary log
    console.log('📊 Order Processing Summary:');
    console.log(`  - Order ID: ${orderRecordId}`);
    console.log(`  - Email Sent: ${emailSent ? '✅' : '❌'}`);
    console.log(`  - WhatsApp Sent: ${whatsappSent ? '✅' : '❌'}`);

    return NextResponse.json({
      success: true,
      orderId: orderRecordId,
      emailSent,
      whatsappSent,
      message: "Order successfully recorded" + 
               (emailSent ? " and email sent" : "") + 
               (whatsappSent ? " and WhatsApp notification sent" : "") + "."
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to process order" }, { status: 500 });
  }
}