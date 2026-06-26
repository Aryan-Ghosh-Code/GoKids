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
  const baseUrl = process.env.NEXTAUTH_URL;
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
                <table width="520" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.03);border:1px solid #E5E7EB;">
                  <!-- Top Branded Gradient Bar -->
                  <tr>
                    <td height="6" style="height:6px;background:linear-gradient(90deg, #F5C518 0%, #2BBCB0 50%, #F4845F 100%);padding:0;margin:0;line-height:1px;font-size:1px;"></td>
                  </tr>
                  
                  <!-- Logo Header -->
                  <tr>
                    <td style="padding:32px 40px 16px;text-align:center;">
                      <img src="${logoUrl}" alt="Go Kids Logo" height="42" style="display:inline-block;height:42px;border:none;outline:none;" />
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding:16px 40px 32px;">
                      <h2 style="margin:0 0 16px;font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;text-align:center;">
                        Welcome to Go Kids! 👋
                      </h2>
                      <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.6;text-align:center;">
                        Hi <strong>${name}</strong>, thank you for joining Go Kids. Please use the verification code below to complete your registration:
                      </p>
                      
                      <!-- OTP Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        <tr>
                          <td align="center" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:24px;">
                            <span style="font-family:inherit;font-size:11px;font-weight:700;color:#2BBCB0;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px;">
                              Your Verification Code
                            </span>
                            <span style="font-family:Consolas,Courier,monospace;font-size:38px;font-weight:800;letter-spacing:8px;color:#1A1A1A;display:block;text-align:center;margin-left:8px;">
                              ${otp}
                            </span>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin:0 0 12px;color:#6B7280;font-size:13px;line-height:1.5;text-align:center;">
                        ⏱️ This code is valid for <strong>15 minutes</strong> and can only be used once.
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.5;text-align:center;">
                        If you didn't create a Go Kids account, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#FAFAF8;padding:24px 40px;border-top:1px solid #E5E7EB;text-align:center;">
                      <p style="margin:0 0 4px;color:#4B5563;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;font-weight:700;">
                        India's Future Readiness Platform
                      </p>
                      <p style="margin:0 0 16px;color:#9CA3AF;font-size:11px;line-height:1.5;">
                        Assessments • Workshops • Mentorship • Expert Talks
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:11px;">
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
  const baseUrl = process.env.NEXTAUTH_URL;
  const logoUrl = `${baseUrl}/logo.png`;

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
                <table width="520" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.03);border:1px solid #E5E7EB;">
                  <!-- Top Branded Gradient Bar -->
                  <tr>
                    <td height="6" style="height:6px;background:linear-gradient(90deg, #F5C518 0%, #2BBCB0 50%, #F4845F 100%);padding:0;margin:0;line-height:1px;font-size:1px;"></td>
                  </tr>
                  
                  <!-- Logo Header -->
                  <tr>
                    <td style="padding:32px 40px 16px;text-align:center;">
                      <img src="${logoUrl}" alt="Go Kids Logo" height="42" style="display:inline-block;height:42px;border:none;outline:none;" />
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding:16px 40px 32px;">
                      <h2 style="margin:0 0 16px;font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;text-align:center;">
                        Reset Password Request 🔑
                      </h2>
                      <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.6;text-align:center;">
                        Hi <strong>${name}</strong>, we received a request to reset your password. Use the verification code below to authorize setting a new password:
                      </p>
                      
                      <!-- OTP Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                        <tr>
                          <td align="center" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:24px;">
                            <span style="font-family:inherit;font-size:11px;font-weight:700;color:#F4845F;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px;">
                              Your Security Code
                            </span>
                            <span style="font-family:Consolas,Courier,monospace;font-size:38px;font-weight:800;letter-spacing:8px;color:#1A1A1A;display:block;text-align:center;margin-left:8px;">
                              ${otp}
                            </span>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin:0 0 12px;color:#6B7280;font-size:13px;line-height:1.5;text-align:center;">
                        ⏱️ This code is valid for <strong>15 minutes</strong> and can only be used once.
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.5;text-align:center;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will remain secure and unchanged.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#FAFAF8;padding:24px 40px;border-top:1px solid #E5E7EB;text-align:center;">
                      <p style="margin:0 0 4px;color:#4B5563;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;font-weight:700;">
                        India's Future Readiness Platform
                      </p>
                      <p style="margin:0 0 16px;color:#9CA3AF;font-size:11px;line-height:1.5;">
                        Assessments • Workshops • Mentorship • Expert Talks
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:11px;">
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
export async function sendPasswordResetLinkEmail(
  email: string,
  name: string,
  resetLink: string
) {
  const fromEmail = process.env.EMAIL_FROM;
  const baseUrl = process.env.NEXTAUTH_URL;
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
                <table width="520" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.06);border:1px solid #E5E7EB;">
                  <!-- Top Branded Gradient Bar -->
                  <tr>
                    <td height="6" style="height:6px;background:linear-gradient(90deg, #F5C518 0%, #2BBCB0 50%, #F4845F 100%);padding:0;margin:0;line-height:1px;font-size:1px;"></td>
                  </tr>

                  <!-- Logo Header -->
                  <tr>
                    <td style="padding:32px 40px 16px;text-align:center;">
                      <img src="${logoUrl}" alt="Go Kids Logo" height="42" style="display:inline-block;height:42px;border:none;outline:none;" />
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding:16px 40px 36px;">
                      <!-- Lock Icon -->
                      <div style="text-align:center;margin-bottom:20px;">
                        <div style="display:inline-block;width:56px;height:56px;background-color:#FEF0EB;border-radius:16px;line-height:56px;text-align:center;font-size:28px;">🔑</div>
                      </div>

                      <h2 style="margin:0 0 12px;font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;text-align:center;">
                        Reset Your Password
                      </h2>
                      <p style="margin:0 0 28px;color:#4B5563;font-size:15px;line-height:1.6;text-align:center;">
                        Hi <strong>${name}</strong>, we received a request to reset your Go Kids password. Click the button below to choose a new one.
                      </p>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                        <tr>
                          <td align="center">
                            <a href="${resetLink}" target="_blank" style="display:inline-block;padding:14px 36px;background-color:#F5C518;color:#1A1A1A;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:800;text-decoration:none;border-radius:50px;letter-spacing:0.01em;box-shadow:0 4px 14px rgba(245,197,24,0.35);">
                              Reset My Password →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Fallback Link -->
                      <p style="margin:0 0 8px;color:#6B7280;font-size:12px;text-align:center;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="margin:0 0 24px;text-align:center;">
                        <a href="${resetLink}" style="color:#2BBCB0;font-size:11px;word-break:break-all;">${resetLink}</a>
                      </p>

                      <p style="margin:0 0 8px;color:#6B7280;font-size:13px;line-height:1.5;text-align:center;">
                        ⏱️ This link expires in <strong>15 minutes</strong> and can only be used once.
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.5;text-align:center;">
                        If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#FAFAF8;padding:24px 40px;border-top:1px solid #E5E7EB;text-align:center;">
                      <p style="margin:0 0 4px;color:#4B5563;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;font-weight:700;">
                        India's Future Readiness Platform
                      </p>
                      <p style="margin:0 0 16px;color:#9CA3AF;font-size:11px;line-height:1.5;">
                        Assessments • Workshops • Mentorship • Expert Talks
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:11px;">
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

export async function sendGoogleAccountEmail(email: string, name: string) {
  const fromEmail = process.env.EMAIL_FROM;
  const baseUrl = process.env.NEXTAUTH_URL;
  const logoUrl = `${baseUrl}/Logo.png`;
  const loginLink = `${baseUrl}/login`;

  await transporter.sendMail({
    from: `"Go Kids" <${fromEmail}>`,
    to: email,
    subject: "Your Go Kids account uses Google Sign-In",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign in with Google</title>
        </head>
        <body style="margin:0;padding:0;background-color:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF8;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.06);border:1px solid #E5E7EB;">
                  <!-- Top Branded Gradient Bar -->
                  <tr>
                    <td height="6" style="height:6px;background:linear-gradient(90deg, #F5C518 0%, #2BBCB0 50%, #F4845F 100%);padding:0;margin:0;line-height:1px;font-size:1px;"></td>
                  </tr>

                  <!-- Logo Header -->
                  <tr>
                    <td style="padding:32px 40px 16px;text-align:center;">
                      <img src="${logoUrl}" alt="Go Kids Logo" height="42" style="display:inline-block;height:42px;border:none;outline:none;" />
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding:16px 40px 36px;">
                      <!-- Google Icon -->
                      <div style="text-align:center;margin-bottom:20px;">
                        <div style="display:inline-block;width:56px;height:56px;background-color:#F0FBF9;border-radius:16px;line-height:56px;text-align:center;font-size:28px;">🔐</div>
                      </div>

                      <h2 style="margin:0 0 12px;font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;text-align:center;">
                        You signed up with Google
                      </h2>
                      <p style="margin:0 0 20px;color:#4B5563;font-size:15px;line-height:1.6;text-align:center;">
                        Hi <strong>${name}</strong>, your Go Kids account is linked to your Google account — it doesn't have a separate password.
                      </p>
                      <p style="margin:0 0 28px;color:#4B5563;font-size:15px;line-height:1.6;text-align:center;">
                        To access your account, simply click <strong>Continue with Google</strong> on the login page.
                      </p>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                        <tr>
                          <td align="center">
                            <a href="${loginLink}" target="_blank" style="display:inline-block;padding:14px 36px;background-color:#2BBCB0;color:#FFFFFF;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:800;text-decoration:none;border-radius:50px;letter-spacing:0.01em;box-shadow:0 4px 14px rgba(43,188,176,0.3);">
                              Go to Login Page →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.5;text-align:center;">
                        If you didn't request a password reset, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#FAFAF8;padding:24px 40px;border-top:1px solid #E5E7EB;text-align:center;">
                      <p style="margin:0 0 4px;color:#4B5563;font-size:12px;font-family:'Segoe UI',Arial,sans-serif;font-weight:700;">
                        India's Future Readiness Platform
                      </p>
                      <p style="margin:0 0 16px;color:#9CA3AF;font-size:11px;line-height:1.5;">
                        Assessments • Workshops • Mentorship • Expert Talks
                      </p>
                      <p style="margin:0;color:#9CA3AF;font-size:11px;">
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
