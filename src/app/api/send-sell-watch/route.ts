import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const sellerName = formData.get('sellerName') as string;
    const sellerEmail = formData.get('sellerEmail') as string;
    const sellerPhone = formData.get('sellerPhone') as string;
    const watchBrand = formData.get('watchBrand') as string;
    const watchModel = formData.get('watchModel') as string;
    const watchReference = formData.get('watchReference') as string;
    const watchCondition = formData.get('watchCondition') as string;
    const watchDescription = formData.get('watchDescription') as string;

    // Handle file attachments
    const attachments = [];
    const watchImages = formData.getAll('watchImages') as File[];
    const warrantyImage = formData.get('warrantyImage') as File;

    // Convert files to attachments (Resend supports base64)
    for (const file of watchImages) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        attachments.push({
          filename: file.name,
          content: buffer,
        });
      }
    }

    if (warrantyImage && warrantyImage.size > 0) {
      const bytes = await warrantyImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      attachments.push({
        filename: warrantyImage.name,
        content: buffer,
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [process.env.RESEND_TO_EMAIL!],
      subject: `New Watch Selling Inquiry - ${watchBrand} ${watchModel}`,
      html: `
        <h2>New Watch Selling Inquiry</h2>
        <h3>Seller Information</h3>
        <p><strong>Name:</strong> ${sellerName}</p>
        <p><strong>Email:</strong> ${sellerEmail}</p>
        <p><strong>Phone:</strong> ${sellerPhone}</p>
        
        <h3>Watch Details</h3>
        <p><strong>Brand:</strong> ${watchBrand}</p>
        <p><strong>Model:</strong> ${watchModel}</p>
        <p><strong>Reference:</strong> ${watchReference || 'Not provided'}</p>
        <p><strong>Condition:</strong> ${watchCondition}</p>
        <p><strong>Description:</strong></p>
        <p>${watchDescription.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
