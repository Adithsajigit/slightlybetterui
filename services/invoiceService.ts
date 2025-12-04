import { jsPDF } from 'jspdf';
import path from 'path';

interface InvoiceItem {
    product: {
        englishName: string;
        malayalamName: string;
        preparation: string;
    };
    quantity: number;
    price: number;
    lineTotal: number;
}

interface InvoiceData {
    invoiceNumber: string;
    orderDate: Date;
    customer: {
        name: string;
        companyName: string;
        address: string;
        phone: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    totalWeight: number;
    tier: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const formatCurrency = (amount: number) => 
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

    // Colors
    const primaryBlue = '#2196F3';
    const darkGray = '#424242';
    const lightGray = '#F5F5F5';

    let yPos = 20;

    // Header - Company Info
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Kerala Fresh Fish', 20, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Wholesale Seafood Supplier', 20, yPos);
    
    // Invoice Title (Right aligned)
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PRO-FORMA INVOICE', 210, 20, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${data.invoiceNumber}`, 210, 27, { align: 'right' });
    doc.text(`Date: ${data.orderDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 210, 32, { align: 'right' });

    // Line separator
    yPos = 40;
    doc.setDrawColor(200);
    doc.line(20, yPos, 190, yPos);

    // Bill To Section
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 20, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.text(data.customer.companyName, 20, yPos);
    
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(data.customer.name, 20, yPos);
    
    yPos += 5;
    const addressLines = data.customer.address.split('\n');
    addressLines.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 5;
    });
    doc.text(`Phone: ${data.customer.phone}`, 20, yPos);

    // Order Summary Box (Right side)
    const summaryY = 50;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER SUMMARY', 130, summaryY);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Total Weight:', 130, summaryY + 7);
    doc.text(`${data.totalWeight.toFixed(2)} kg`, 190, summaryY + 7, { align: 'right' });
    
    doc.text('Pricing Tier:', 130, summaryY + 12);
    doc.text(data.tier, 190, summaryY + 12, { align: 'right' });

    // Items Table
    yPos = 90;
    
    // Table Header
    doc.setFillColor(33, 150, 243); // Blue color
    doc.rect(20, yPos - 5, 170, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCT', 22, yPos);
    doc.text('QTY (kg)', 110, yPos, { align: 'center' });
    doc.text('PRICE/KG', 145, yPos, { align: 'right' });
    doc.text('TOTAL', 185, yPos, { align: 'right' });
    
    yPos += 8;

    // Table Rows
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    data.items.forEach((item, index) => {
        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, yPos - 4, 170, 12, 'F');
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(item.product.englishName, 22, yPos);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(97, 97, 97);
        doc.text(`${item.product.malayalamName} • ${item.product.preparation}`, 22, yPos + 4);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`${item.quantity}`, 115, yPos, { align: 'center' });
        doc.text(formatCurrency(item.price), 150, yPos, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.text(formatCurrency(item.lineTotal), 185, yPos, { align: 'right' });
        
        yPos += 12;
    });

    // Total Section
    yPos += 5;
    doc.setFillColor(250, 250, 250);
    doc.rect(20, yPos - 4, 170, 12, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL AMOUNT:', 130, yPos + 3);
    
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243);
    doc.text(formatCurrency(data.subtotal), 185, yPos + 3, { align: 'right' });

    // Payment Terms
    yPos += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT TERMS', 20, yPos);
    
    yPos += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(66, 66, 66);
    doc.text('• This is a pro-forma invoice for order confirmation', 20, yPos);
    yPos += 5;
    doc.text('• Final invoice will be sent after shipment', 20, yPos);
    yPos += 5;
    doc.text('• Payment due upon receipt of final invoice', 20, yPos);
    yPos += 5;
    doc.text('• All prices are in GBP (£)', 20, yPos);

    // Footer
    doc.setDrawColor(200);
    doc.line(20, 270, 190, 270);
    
    doc.setFontSize(9);
    doc.setTextColor(117, 117, 117);
    doc.text('Kerala Fresh Fish | Premium Wholesale Seafood Supplier', 105, 275, { align: 'center' });
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });

    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
}

export function generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
}
