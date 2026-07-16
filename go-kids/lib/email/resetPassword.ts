import { sendEmail } from "./mailer";

export async function sendPasswordResetLinkEmail(
  email: string,
  name: string,
  resetLink: string,
) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://gokids.co.in";
  const logoUrl = `${baseUrl}/Logo.png`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your Go Kids Password</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0;padding:0;background-color:#FAFAF9;font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;-webkit-font-smoothing:antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF9;padding:40px 16px;width:100%;">
          <tr>
            <td align="center">
              <table width="540" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.03);border:1px solid #ECECEC;max-width:540px;width:100%;">
                
                <!-- Top Branded Header Strip (Thick Brand Yellow Banner) -->
                <tr>
                  <td height="28" style="height:28px;background-color:#F5C518;padding:0;margin:0;line-height:1px;font-size:1px;border-top-left-radius:24px;border-top-right-radius:24px;"></td>
                </tr>
                
                <!-- Logo Header -->
                <tr>
                  <td style="padding:40px 40px 24px;text-align:center;">
                    <img src="${logoUrl}" alt="Go Kids Logo" height="42" style="display:inline-block;height:42px;border:none;outline:none;" />
                  </td>
                </tr>
                
                <!-- Content Area -->
                <tr>
                  <td style="padding:0 40px 40px;">
                    <div style="text-align:center;margin-bottom:24px;">
                      <div style="display:inline-block;width:64px;height:64px;background-color:#FEF0EB;border-radius:20px;line-height:64px;text-align:center;font-size:28px;">🔑</div>
                    </div>
                    
                    <h2 style="margin:0 0 16px;font-family:'Nunito', 'Plus Jakarta Sans', sans-serif;font-size:24px;font-weight:800;color:#1A1A1A;text-align:center;">
                      Reset Password Link
                    </h2>
                    <p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.65;text-align:center;">
                      Hi <strong>${name}</strong>, we received a request to reset your Go Kids password. Click the button below to choose a new one:
                    </p>
                    
                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td align="center">
                          <a href="${resetLink}" target="_blank" style="display:inline-block;padding:14px 36px;background-color:#F4845F;color:#FFFFFF;font-family:'Plus Jakarta Sans', sans-serif;font-size:14px;font-weight:800;text-decoration:none;border-radius:12px;letter-spacing:0.02em;box-shadow:0 6px 18px rgba(244,132,95,0.25);">
                            Reset My Password &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Fallback Link -->
                    <p style="margin:0 0 8px;color:#6B7280;font-size:12px;text-align:center;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin:0 0 24px;text-align:center;">
                      <a href="${resetLink}" style="color:#2BBCB0;font-size:12px;word-break:break-all;font-weight:500;">${resetLink}</a>
                    </p>
                    
                    <p style="margin:0 0 8px;color:#6B7280;font-size:13px;line-height:1.5;text-align:center;font-weight:500;">
                      ⏱️ This link expires in <strong>15 minutes</strong> and can only be used once.
                    </p>
                    <p style="margin:0;color:#9CA3AF;font-size:11px;line-height:1.5;text-align:center;">
                      If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
                    </p>
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

  await sendEmail({
    to: email,
    subject: "Reset your Go Kids Password",
    html,
  });
}
