import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "2525"),
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@resumebuilder.com",
    to: email,
    subject: "Verify your email - JPAWORX Resume Builder",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #18181b;">JPAWORX Resume Builder</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #18181b;">Verify your email address</h2>
                      <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #52525b;">
                        Thank you for signing up! Please use the verification code below to complete your registration:
                      </p>
                      
                      <!-- OTP Box -->
                      <div style="background-color: #f4f4f5; border: 2px solid #e4e4e7; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                        <p style="margin: 0 0 8px; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Verification Code</p>
                        <p style="margin: 0; font-size: 36px; font-weight: 700; color: #18181b; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </p>
                      </div>
                      
                      <p style="margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #71717a;">
                        This code will expire in <strong>10 minutes</strong>. If you didn't create an account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 40px; text-align: center; border-top: 1px solid #e4e4e7;">
                      <p style="margin: 0; font-size: 14px; color: #a1a1aa;">
                        © ${new Date().getFullYear()} JPAWORX Resume Builder. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
JPAWORX Resume Builder - Email Verification

Verify your email address

Thank you for signing up! Please use the verification code below to complete your registration:

Verification Code: ${otp}

This code will expire in 10 minutes. If you didn't create an account, you can safely ignore this email.

© ${new Date().getFullYear()} JPAWORX Resume Builder. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: "Failed to send verification email" };
  }
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
