import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(email: string, name: string, otp: string) {
  const fromEmail = process.env.EMAIL_FROM;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const logoUrl = `${baseUrl}/Logo.png`;

  await transporter.sendMail({
    from: `"Go Kids" <${fromEmail}>`,
    to: email,
    subject: "Your Go Kids OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Go Kids Verification Code</title>
        </head>
        <body style="margin:0;padding:0;background-color:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF8;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.04);border:1px solid #EEEEEE;">
                  <!-- Logo Header -->
                  <tr>
                    <td style="padding:30px 40px;border-bottom:1px solid #F3F4F6;background-color:#FFFFFF;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <img src="${logoUrl}" alt="Go Kids Logo" height="40" style="display:block;height:40px;border:none;outline:none;" />
                          </td>
                          <td align="right" style="font-family:'Nunito',Arial,sans-serif;font-size:12px;font-weight:700;color:#2BBCB0;text-transform:uppercase;letter-spacing:0.05em;">
                            Verification Code
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 16px;font-family:'Nunito',Arial,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;">
                        Welcome to Go Kids! 👋
                      </h2>
                      <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.6;">
                        Hi <strong>${name}</strong>, thank you for joining Go Kids. Please use the following One-Time Password (OTP) to complete your email verification:
                      </p>
                      <!-- OTP Container -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        <tr>
                          <td align="center" style="background-color:#FFF9E6;border:2px dashed #F5C518;border-radius:16px;padding:30px;">
                            <span style="font-family:'Nunito',Arial,sans-serif;font-size:42px;font-weight:800;letter-spacing:10px;color:#1A1A1A;display:block;text-align:center;margin-left:10px;">
                              ${otp}
                            </span>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 10px;color:#6B7280;font-size:14px;line-height:1.5;">
                        ⏱️ This code is valid for <strong>15 minutes</strong> and can only be used once.
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.5;">
                        If you didn't create a Go Kids account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#1A1A1A;padding:32px 40px;text-align:center;">
                      <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-family:'Nunito',Arial,sans-serif;font-weight:700;">
                        India's Future Readiness Platform
                      </p>
                      <p style="margin:0 0 16px;color:#6B7280;font-size:11px;line-height:1.5;">
                        Assessments &bull; Workshops &bull; Mentorship &bull; Expert Talks
                      </p>
                      <p style="margin:0;color:#4B5563;font-size:11px;">
                        &copy; ${new Date().getFullYear()} Go Kids India. All rights reserved.
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
  });
}

export async function sendResetPasswordOtpEmail(email: string, name: string, otp: string) {
  const fromEmail = process.env.EMAIL_FROM;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const logoUrl = `${baseUrl}/Logo.png`;

  await transporter.sendMail({
    from: `"Go Kids" <${fromEmail}>`,
    to: email,
    subject: "Reset your Go Kids Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your Go Kids Password</title>
        </head>
        <body style="margin:0;padding:0;background-color:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF8;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.04);border:1px solid #EEEEEE;">
                  <!-- Logo Header -->
                  <tr>
                    <td style="padding:30px 40px;border-bottom:1px solid #F3F4F6;background-color:#FFFFFF;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <img src="${logoUrl}" alt="Go Kids Logo" height="40" style="display:block;height:40px;border:none;outline:none;" />
                          </td>
                          <td align="right" style="font-family:'Nunito',Arial,sans-serif;font-size:12px;font-weight:700;color:#F4845F;text-transform:uppercase;letter-spacing:0.05em;">
                            Security Request
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 16px;font-family:'Nunito',Arial,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;">
                        Reset Password Request 🔑
                      </h2>
                      <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.6;">
                        Hi <strong>${name}</strong>, we received a request to reset your password. Use the verification code below to authorize setting a new password:
                      </p>
                      <!-- OTP Container -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        <tr>
                          <td align="center" style="background-color:#FEF0EB;border:2px dashed #F4845F;border-radius:16px;padding:30px;">
                            <span style="font-family:'Nunito',Arial,sans-serif;font-size:42px;font-weight:800;letter-spacing:10px;color:#F4845F;display:block;text-align:center;margin-left:10px;">
                              ${otp}
                            </span>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 10px;color:#6B7280;font-size:14px;line-height:1.5;">
                        ⏱️ This code is valid for <strong>15 minutes</strong> and can only be used once.
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:12px;line-height:1.5;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will remain secure and unchanged.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#1A1A1A;padding:32px 40px;text-align:center;">
                      <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-family:'Nunito',Arial,sans-serif;font-weight:700;">
                        India's Future Readiness Platform
                      </p>
                      <p style="margin:0 0 16px;color:#6B7280;font-size:11px;line-height:1.5;">
                        Assessments &bull; Workshops &bull; Mentorship &bull; Expert Talks
                      </p>
                      <p style="margin:0;color:#4B5563;font-size:11px;">
                        &copy; ${new Date().getFullYear()} Go Kids India. All rights reserved.
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
  });
}
