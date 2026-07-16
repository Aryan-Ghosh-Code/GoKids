import { sendEmail } from "./mailer";

export async function sendWelcomeEmail(email: string, name: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://gokids.co.in";
  const logoUrl = `${baseUrl}/Logo.png`;
  const workshopsLink = `${baseUrl}/workshops`;
  const assessmentsLink = `${baseUrl}/assessments`;
  const firstName = name.split(" ")[0];

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Go Kids</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0;padding:0;background-color:#FAFAF9;font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;-webkit-font-smoothing:antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF9;padding:40px 16px;width:100%;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.03);border:1px solid #ECECEC;max-width:560px;width:100%;">
                
                <!-- Top Branded Header Strip (Thick Brand Yellow Banner) -->
                <tr>
                  <td height="28" style="height:28px;background-color:#F5C518;padding:0;margin:0;line-height:1px;font-size:1px;border-top-left-radius:24px;border-top-right-radius:24px;"></td>
                </tr>
                
                <!-- Logo Header -->
                <tr>
                  <td style="padding:40px 48px 24px;text-align:center;">
                    <img src="${logoUrl}" alt="Go Kids Logo" height="42" style="display:inline-block;height:42px;border:none;outline:none;" />
                  </td>
                </tr>
                
                <!-- Hero Section -->
                <tr>
                  <td style="padding:0 48px 36px;text-align:center;">
                    <div style="display:inline-block;width:72px;height:72px;background:linear-gradient(135deg,#FEF9E7,#E8F8F6);border-radius:22px;line-height:72px;text-align:center;font-size:32px;margin-bottom:20px;box-shadow:0 8px 24px rgba(43,188,176,0.06);">🎉</div>
                    <h1 style="margin:0 0 12px;font-family:'Nunito','Plus Jakarta Sans',sans-serif;font-size:26px;font-weight:800;color:#111827;line-height:1.25;letter-spacing:-0.02em;">
                      Welcome to the family, ${firstName}!
                    </h1>
                    <p style="margin:0 0 12px;color:#4B5563;font-size:15px;line-height:1.65;font-weight:500;">
                      Your Go Kids account has been verified successfully. You are now ready to unlock your child's full potential and prepare them for a futuristic tomorrow.
                    </p>
                    <span style="display:inline-block;background-color:#F3F4F6;color:#6B7280;font-size:11px;padding:4px 12px;border-radius:20px;font-weight:600;font-family:monospace;">
                      ${email}
                    </span>
                  </td>
                </tr>
                
                <!-- Where to get started Header -->
                <tr>
                  <td style="padding:0 48px 12px;">
                    <p style="margin:0;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:800;color:#2BBCB0;text-transform:uppercase;letter-spacing:0.12em;text-align:center;">
                      WHERE TO GET STARTED
                    </p>
                  </td>
                </tr>
                
                <!-- Options section -->
                <tr>
                  <td style="padding:0 40px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                      <tr>
                        <!-- Option 1: Assessments -->
                        <td style="padding:8px;vertical-align:top;width:50%;">
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FEFDF9;border:1px solid #FDF0D5;border-radius:18px;height:100%;">
                            <tr>
                              <td style="padding:20px;text-align:center;">
                                <div style="width:44px;height:44px;background-color:#FFF8E7;border-radius:14px;line-height:44px;text-align:center;font-size:20px;margin:0 auto 12px;box-shadow:0 4px 10px rgba(245,197,24,0.08);">🧠</div>
                                <h3 style="margin:0 0 6px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;color:#1A1A1A;">Child Assessments</h3>
                                <p style="margin:0 0 16px;color:#6B7280;font-size:12px;line-height:1.5;min-height:54px;">Discover learning styles, focus, and core strengths with science-backed assessments.</p>
                                <a href="${assessmentsLink}" target="_blank" style="display:inline-block;padding:8px 18px;background-color:#FFF3CD;color:#92700A;font-size:12px;font-weight:700;text-decoration:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;">
                                  Start Assessment &rarr;
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                        
                        <!-- Option 2: Workshops -->
                        <td style="padding:8px;vertical-align:top;width:50%;">
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FDFD;border:1px solid #E6F7F5;border-radius:18px;height:100%;">
                            <tr>
                              <td style="padding:20px;text-align:center;">
                                <div style="width:44px;height:44px;background-color:#EBFBF9;border-radius:14px;line-height:44px;text-align:center;font-size:20px;margin:0 auto 12px;box-shadow:0 4px 10px rgba(43,188,176,0.08);">🎓</div>
                                <h3 style="margin:0 0 6px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;color:#1A1A1A;">Live Workshops</h3>
                                <p style="margin:0 0 16px;color:#6B7280;font-size:12px;line-height:1.5;min-height:54px;">Interactive online and offline workshops on speed writing, AI tools, and smart parenting.</p>
                                <a href="${workshopsLink}" target="_blank" style="display:inline-block;padding:8px 18px;background-color:#E0F5F2;color:#1F8B82;font-size:12px;font-weight:700;text-decoration:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;">
                                  Browse Workshops &rarr;
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Premium Highlight Banner -->
                <tr>
                  <td style="padding:0 48px 36px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #FDF8F5 0%, #FAFAF9 100%);border:1px solid #F6E2DA;border-radius:20px;overflow:hidden;">
                      <tr>
                        <td style="padding:24px;text-align:center;">
                          <div style="display:inline-block;font-size:24px;margin-bottom:8px;">🤝</div>
                          <h4 style="margin:0 0 6px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;color:#E76F51;">Mentorship &amp; Expert Talks</h4>
                          <p style="margin:0;color:#6B7280;font-size:12px;line-height:1.6;max-width:380px;margin:0 auto;">
                            Get live access to premium panels, expert counselors, and tailored educational pathways designed to make your child future-ready.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding:0 48px;">
                    <div style="height:1px;background-color:#EAEAEA;"></div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color:#FAFAF9;padding:32px 48px;text-align:center;">
                    <p style="margin:0 0 6px;color:#374151;font-size:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;letter-spacing:0.02em;">
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
    subject: `Welcome to Go Kids, ${firstName}! 🎉`,
    html,
  });
}
