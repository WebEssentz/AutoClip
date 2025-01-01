// lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App Password from Google
  },
});

interface SubscriptionEmailData {
  customerName: string;
  planName: string;
  amount: number;
  nextBilling: Date;
  invoiceUrl?: string;
  currentCredits: number; // Add this field
}

export async function sendSubscriptionEmail(
  to: string,
  data: SubscriptionEmailData
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0070f3; margin: 0;">Welcome to Premium, ${data.customerName}! 🎉</h1>
        <p style="color: #666; margin-top: 10px;">Your subscription has been activated successfully.</p>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e9ecef;">
        <h2 style="color: #2d3748; margin-bottom: 15px;">Subscription Details</h2>
        <div style="margin-bottom: 10px;">
          <p style="margin: 5px 0; color: #4a5568;"><strong>Plan:</strong> ${data.planName}</p>
          <p style="margin: 5px 0; color: #4a5568;"><strong>Amount:</strong> $${data.amount}/month</p>
          <p style="margin: 5px 0; color: #4a5568;"><strong>Current Credits:</strong> ${data.currentCredits}</p>
          <p style="margin: 5px 0; color: #4a5568;"><strong>Next billing date:</strong> ${data.nextBilling.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p style="margin: 5px 0; color: #4a5568;"><strong>Current Time (UTC):</strong> ${new Date().toLocaleString('en-US', { 
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}</p>
        </div>
      </div>

      ${data.invoiceUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.invoiceUrl}" 
             style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; font-weight: 500;
                    transition: background-color 0.2s ease;">
            View Invoice
          </a>
        </div>
      ` : ''}

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
        <p style="color: #666; margin-bottom: 10px;">Thank you for choosing our premium service!</p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          If you have any questions, please don't hesitate to contact our support team.
        </p>
      </div>
    </div>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"AutoClip" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🎉 Welcome to AutoClip Premium!',
      html,
    });

    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
    // Log the error but don't throw it to prevent webhook failure
  }
}

// Verify email configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email verification error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});