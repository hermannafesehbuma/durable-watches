import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { orderData, items } = await request.json();

    const itemsHtml = items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [process.env.RESEND_TO_EMAIL!, orderData.email],
      subject: `Order Confirmation - Order #${orderData.orderId || 'PENDING'}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order! Here are the details:</p>
        
        <h3>Customer Information</h3>
        <p><strong>Email:</strong> ${orderData.email}</p>
        
        <h3>Order Information</h3>
        <p><strong>Order ID:</strong> ${orderData.orderId || 'Will be assigned shortly'}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        <p><strong>Status:</strong> ${orderData.status}</p>
        
        <h3>Shipping Address</h3>
        <p>${orderData.shipping.full_name}<br>
        ${orderData.shipping.address_line1}<br>
        ${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.postal_code}<br>
        ${orderData.shipping.country}<br>
        Phone: ${orderData.shipping.phone}</p>
        
        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <h3>Order Summary</h3>
        <p><strong>Subtotal:</strong> $${(orderData.total - orderData.total * 0.08 - 15).toFixed(2)}</p>
        <p><strong>Shipping:</strong> $15.00</p>
        <p><strong>Tax:</strong> $${(orderData.total * 0.08).toFixed(2)}</p>
        <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
        
        <hr>
        <p><em>Order placed at: ${new Date().toLocaleString()}</em></p>
        <p>We'll send you another email when your order ships!</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
