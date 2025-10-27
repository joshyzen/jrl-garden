import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type EstimateItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
};

type EstimateEmailData = {
  clientName: string;
  phone: string;
  address: string;
  details?: string;
  items: EstimateItem[];
  total: number;
};

export async function sendEstimateNotification(data: EstimateEmailData) {
  const { clientName, phone, address, details, items, total } = data;

  // Format items into HTML table
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.unit}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.total.toFixed(2)}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Estimate Request</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2d5016; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🌱 New Estimate Request</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #2d5016; margin-top: 0;">Client Information</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr>
              <td style="padding: 4px 0; font-weight: 600; width: 100px;">Name:</td>
              <td style="padding: 4px 0;">${clientName}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Phone:</td>
              <td style="padding: 4px 0;"><a href="tel:${phone}" style="color: #2d5016;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Address:</td>
              <td style="padding: 4px 0;">${address}</td>
            </tr>
          </table>

          ${details ? `
            <h3 style="color: #2d5016; margin-bottom: 8px;">Project Details</h3>
            <p style="background-color: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${details}</p>
          ` : ''}

          <h3 style="color: #2d5016; margin-bottom: 12px;">Items Requested</h3>
          <table style="width: 100%; background-color: white; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #2d5016; color: white;">
                <th style="padding: 12px 8px; text-align: left;">Item</th>
                <th style="padding: 12px 8px; text-align: center;">Qty</th>
                <th style="padding: 12px 8px; text-align: center;">Unit</th>
                <th style="padding: 12px 8px; text-align: right;">Price</th>
                <th style="padding: 12px 8px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="font-weight: 700; font-size: 16px;">
                <td colspan="4" style="padding: 12px 8px; text-align: right; border-top: 2px solid #2d5016;">Materials Total:</td>
                <td style="padding: 12px 8px; text-align: right; border-top: 2px solid #2d5016;">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <p style="margin-top: 20px; padding: 12px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; font-size: 14px;">
            <strong>Note:</strong> This is the materials total only. Delivery and labor costs to be added.
          </p>
        </div>

        <div style="margin-top: 20px; padding: 16px; background-color: #f9fafb; border-radius: 8px; text-align: center; font-size: 14px; color: #6b7280;">
          <p style="margin: 0;">This estimate was submitted via the JRL Garden website.</p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Estimate Request

CLIENT INFORMATION
Name: ${clientName}
Phone: ${phone}
Address: ${address}

${details ? `PROJECT DETAILS\n${details}\n\n` : ''}

ITEMS REQUESTED
${items.map(item => 
  `${item.name} - ${item.qty} ${item.unit} @ $${item.price.toFixed(2)} = $${item.total.toFixed(2)}`
).join('\n')}

MATERIALS TOTAL: $${total.toFixed(2)}

Note: This is the materials total only. Delivery and labor costs to be added.
  `.trim();

  try {
    const result = await resend.emails.send({
      from: 'JRL Garden <onboarding@resend.dev>', // You'll need to update this with your verified domain
      to: 'zenmaker@gmail.com',
      subject: `New Estimate Request from ${clientName}`,
      html: htmlContent,
      text: textContent,
    });

    return result;
  } catch (error) {
    console.error('Failed to send estimate notification:', error);
    throw error;
  }
}

