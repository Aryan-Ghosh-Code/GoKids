import { sendEmail } from "./mailer";

const baseTemplate = (content: string, title = "Go Kids Notification") => {
  const baseUrl = process.env.NEXTAUTH_URL || "https://gokids.co.in";
  const logoUrl = `${baseUrl}/Logo.png`;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0;padding:0;background-color:#FAFAF9;font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;-webkit-font-smoothing:antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF9;padding:40px 16px;width:100%;">
          <tr>
            <td align="center">
              <table width="540" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.03);border:1px solid #ECECEC;max-width:540px;width:100%;">
                
                <!-- Top Branded Header Block (Thick Brand Yellow Banner) -->
                <tr>
                  <td height="28" style="height:28px;background-color:#F5C518;padding:0;margin:0;line-height:1px;font-size:1px;border-top-left-radius:24px;border-top-right-radius:24px;"></td>
                </tr>
                
                <!-- Logo Header -->
                <tr>
                  <td style="padding:32px 40px 24px;text-align:center;">
                    <img src="${logoUrl}" alt="Go Kids Logo" height="42" style="display:inline-block;height:42px;border:none;outline:none;" />
                  </td>
                </tr>
                
                <!-- Content Area -->
                <tr>
                  <td style="padding:0 40px 40px;">
                    ${content}
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color:#FAFAF9;padding:32px 40px;border-top:1px solid #ECECEC;text-align:center;">
                    <p style="margin:0 0 6px;color:#374151;font-size:12px;font-family:'Plus Jakarta Sans', sans-serif;font-weight:700;letter-spacing:0.02em;">
                      India's Future Readiness Platform
                    </p>
                    <p style="margin:0 0 20px;color:#9CA3AF;font-size:11px;line-height:1.5;">
                      Assessments &middot; Workshops &middot; Mentorship &middot; Expert Talks
                    </p>
                    <p style="margin:0;color:#9CA3AF;font-size:11px;font-weight:500;">
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
  `;
};

export async function sendOtpEmail(email: string, name: string, otp: string) {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:64px;height:64px;background-color:#FFF9E6;border-radius:20px;line-height:64px;text-align:center;font-size:28px;">👋</div>
    </div>
    <h2 style="margin:0 0 16px;font-family:'Nunito', 'Plus Jakarta Sans', sans-serif;font-size:24px;font-weight:800;color:#1A1A1A;text-align:center;">
      Welcome to Go Kids!
    </h2>
    <p style="margin:0 0 28px;color:#4B5563;font-size:15px;line-height:1.65;text-align:center;">
      Hi <strong>${name}</strong>, thank you for joining Go Kids. Please use the verification code below to complete your registration:
    </p>
    
    <!-- OTP Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td align="center" style="background-color:#FDFBF7;border:2px dashed #F5C518;border-radius:16px;padding:28px;">
          <span style="font-family:'Plus Jakarta Sans', sans-serif;font-size:11px;font-weight:800;color:#2BBCB0;text-transform:uppercase;letter-spacing:0.12em;display:block;margin-bottom:12px;">
            Verification OTP
          </span>
          <span style="font-family:Consolas, Monaco, Courier, monospace;font-size:40px;font-weight:800;letter-spacing:8px;color:#1A1A1A;display:block;text-align:center;margin-left:8px;">
            ${otp}
          </span>
        </td>
      </tr>
    </table>
    
    <p style="margin:0 0 12px;color:#6B7280;font-size:13px;line-height:1.5;text-align:center;font-weight:500;">
      ⏱️ This code is valid for <strong>15 minutes</strong> and can only be used once.
    </p>
    <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.5;text-align:center;">
      If you didn't create a Go Kids account, you can safely ignore this email.
    </p>
  `;

  await sendEmail({
    to: email,
    subject: "Your Go Kids OTP Code",
    html: baseTemplate(content, "Go Kids OTP Verification"),
  });
}

export async function sendResetPasswordOtpEmail(
  email: string,
  name: string,
  otp: string,
) {
  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:64px;height:64px;background-color:#FEF0EB;border-radius:20px;line-height:64px;text-align:center;font-size:28px;">🔒</div>
    </div>
    <h2 style="margin:0 0 16px;font-family:'Nunito', 'Plus Jakarta Sans', sans-serif;font-size:24px;font-weight:800;color:#1A1A1A;text-align:center;">
      Reset Password Request
    </h2>
    <p style="margin:0 0 28px;color:#4B5563;font-size:15px;line-height:1.65;text-align:center;">
      Hi <strong>${name}</strong>, we received a request to reset your password. Use the security code below to authorize setting a new password:
    </p>
    
    <!-- OTP Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td align="center" style="background-color:#FFF8F6;border:2px dashed #F4845F;border-radius:16px;padding:28px;">
          <span style="font-family:'Plus Jakarta Sans', sans-serif;font-size:11px;font-weight:800;color:#F4845F;text-transform:uppercase;letter-spacing:0.12em;display:block;margin-bottom:12px;">
            Security Code
          </span>
          <span style="font-family:Consolas, Monaco, Courier, monospace;font-size:40px;font-weight:800;letter-spacing:8px;color:#1A1A1A;display:block;text-align:center;margin-left:8px;">
            ${otp}
          </span>
        </td>
      </tr>
    </table>
    
    <p style="margin:0 0 12px;color:#6B7280;font-size:13px;line-height:1.5;text-align:center;font-weight:500;">
      ⏱️ This code is valid for <strong>15 minutes</strong> and can only be used once.
    </p>
    <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.5;text-align:center;">
      If you didn't request a password reset, you can safely ignore this email. Your password will remain secure and unchanged.
    </p>
  `;

  await sendEmail({
    to: email,
    subject: "Reset your Go Kids Password",
    html: baseTemplate(content, "Reset password authorization code"),
  });
}

export async function sendGoogleAccountEmail(email: string, name: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://gokids.co.in";
  const loginLink = `${baseUrl}/login`;

  const content = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:64px;height:64px;background-color:#F0FBF9;border-radius:20px;line-height:64px;text-align:center;font-size:28px;">🔑</div>
    </div>
    <h2 style="margin:0 0 16px;font-family:'Nunito', 'Plus Jakarta Sans', sans-serif;font-size:24px;font-weight:800;color:#1A1A1A;text-align:center;">
      Google Sign-In Account
    </h2>
    <p style="margin:0 0 20px;color:#4B5563;font-size:15px;line-height:1.65;text-align:center;">
      Hi <strong>${name}</strong>, your Go Kids account is linked to your Google account &mdash; it doesn't have a separate password.
    </p>
    <p style="margin:0 0 32px;color:#4B5563;font-size:15px;line-height:1.65;text-align:center;">
      To access your account, simply click <strong>Continue with Google</strong> on our login page.
    </p>
    
    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td align="center">
          <a href="${loginLink}" target="_blank" style="display:inline-block;padding:14px 36px;background-color:#2BBCB0;color:#FFFFFF;font-family:'Plus Jakarta Sans', sans-serif;font-size:14px;font-weight:800;text-decoration:none;border-radius:12px;letter-spacing:0.02em;box-shadow:0 6px 18px rgba(43,188,176,0.25);">
            Go to Login Page &rarr;
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.5;text-align:center;">
      If you didn't attempt to sign in or reset your password, you can safely ignore this email.
    </p>
  `;

  await sendEmail({
    to: email,
    subject: "Your Go Kids account uses Google Sign-In",
    html: baseTemplate(content, "Go Kids Google Sign-In details"),
  });
}
