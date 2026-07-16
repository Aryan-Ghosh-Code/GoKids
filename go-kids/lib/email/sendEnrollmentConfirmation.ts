/**
 * lib/email/sendEnrollmentConfirmation.ts
 *
 * Standardised Go Kids workshop enrollment confirmation email.
 * Used for all workshops (free, paid, online, and offline).
 */

import { sendEmail } from "./mailer";

export interface EnrollmentEmailWorkshop {
  title: string;
  duration: string;
  sessions: number;
  ageGroup: string;
  price: number;
  isFree: boolean;
  slug: string;
  isOffline: boolean;
  date: string;
  time: string;
  venue?: string;
  googleMapsUrl?: string;
  shortDescription?: string;
  highlights?: string[];
  requirements?: string[];
  curriculum?: { title: string; duration?: string }[];
}

export interface EnrollmentEmailData {
  parentEmail: string;
  parentName: string;
  bookingId: string;
  workshop: EnrollmentEmailWorkshop;
  amountPaid?: number;
  txnId?: string;
}

/** Map a Workshop document (lean) to the email payload shape. */
export function workshopDocToEmailData(workshop: {
  title: string;
  slug: string;
  duration: string;
  sessions: number;
  ageGroup: string;
  price?: number;
  isFree: boolean;
  isOffline: boolean;
  date: string;
  time: string;
  venue?: string;
  googleMapsUrl?: string;
  shortDescription?: string;
  highlights?: string[];
  requirements?: string[];
  curriculum?: { title: string; duration?: string }[];
}): EnrollmentEmailWorkshop {
  return {
    title: workshop.title,
    slug: workshop.slug,
    duration: workshop.duration,
    sessions: workshop.sessions,
    ageGroup: workshop.ageGroup,
    price: workshop.price ?? 0,
    isFree: workshop.isFree,
    isOffline: workshop.isOffline,
    date: workshop.date,
    time: workshop.time,
    venue: workshop.venue,
    googleMapsUrl: workshop.googleMapsUrl,
    shortDescription: workshop.shortDescription,
    highlights: workshop.highlights ?? [],
    requirements: workshop.requirements ?? [],
    curriculum: workshop.curriculum ?? [],
  };
}

function buildSubject(
  parentName: string,
  workshop: EnrollmentEmailWorkshop,
): string {
  const parts = [
    "You're Booked!",
    parentName,
    workshop.title,
    `${workshop.date}, ${workshop.time}`,
  ];

  if (workshop.isOffline && workshop.venue) {
    parts.push(workshop.venue);
  }

  return parts.join(" | ");
}

function listItems(items: string[], bulletColor = "#374151"): string {
  if (!items.length) return "";
  return items
    .map(
      (item) =>
        `<li style="padding:6px 0;font-size:14px;color:${bulletColor};line-height:1.65;font-family:'Plus Jakarta Sans', sans-serif;">
           ${item}
         </li>`,
    )
    .join("");
}

export async function sendEnrollmentConfirmation({
  parentEmail,
  parentName,
  bookingId,
  workshop,
  amountPaid,
  txnId,
}: EnrollmentEmailData): Promise<void> {
  const firstName = parentName.split(" ")[0];
  const baseUrl = process.env.NEXTAUTH_URL || "https://gokids.co.in";
  const logoUrl = `${baseUrl}/Logo.png`;
  const workshopUrl = `${baseUrl}/workshops/${workshop.slug}`;
  const paidAmount = amountPaid ?? (workshop.isFree ? 0 : workshop.price);

  // ── What to Expect ───────────────────────────────────────────────────────
  const expectItems =
    workshop.highlights && workshop.highlights.length > 0
      ? workshop.highlights
      : workshop.isOffline &&
          workshop.curriculum &&
          workshop.curriculum.length > 0
        ? workshop.curriculum.map((mod) => mod.title)
        : workshop.shortDescription
          ? [workshop.shortDescription]
          : [
              "Your workshop sessions and joining details will be shared closer to the start date.",
            ];

  const whatToExpectHtml = listItems(expectItems);

  // ── Requirements ─────────────────────────────────────────────────────────
  const requirementsHtml =
    workshop.requirements && workshop.requirements.length > 0
      ? `<!-- REQUIREMENTS -->
         <div style="margin-bottom:28px;">
           <div style="font-size:11px;font-weight:800;color:#9CA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;font-family:'Plus Jakarta Sans', sans-serif;">
             What You'll Need
           </div>
           <ul style="margin:0;padding-left:20px;">
             ${listItems(workshop.requirements)}
           </ul>
         </div>`
      : "";

  // ── Payment rows ─────────────────────────────────────────────────────────
  const paymentRows = workshop.isFree
    ? `<tr style="border-top:1px solid #F3F4F6;">
         <td style="padding:12px 0;color:#6B7280;font-size:14px;width:40%;font-family:'Plus Jakarta Sans', sans-serif;">Amount Paid</td>
         <td style="padding:12px 0;font-weight:700;color:#16a34a;font-size:14px;font-family:'Plus Jakarta Sans', sans-serif;">Free ✓</td>
       </tr>`
    : `<tr style="border-top:1px solid #F3F4F6;">
         <td style="padding:12px 0;color:#6B7280;font-size:14px;width:40%;font-family:'Plus Jakarta Sans', sans-serif;">Amount Paid</td>
         <td style="padding:12px 0;font-weight:700;color:#1A1A1A;font-size:14px;font-family:'Plus Jakarta Sans', sans-serif;">
           ₹${paidAmount.toLocaleString("en-IN")}
         </td>
       </tr>
       ${
         txnId
           ? `<tr style="border-top:1px solid #F3F4F6;">
                <td style="padding:12px 0;color:#6B7280;font-size:14px;font-family:'Plus Jakarta Sans', sans-serif;">Transaction ID</td>
                <td style="padding:12px 0;font-weight:600;color:#1A1A1A;font-size:13px;font-family:monospace;">
                  ${txnId}
                </td>
              </tr>`
           : ""
       }`;

  // ── Venue row (offline only) ─────────────────────────────────────────────
  const venueRow =
    workshop.isOffline && workshop.venue
      ? `<tr style="border-top:1px solid #F3F4F6;">
           <td style="padding:12px 0;color:#6B7280;font-size:14px;vertical-align:top;font-family:'Plus Jakarta Sans', sans-serif;">Venue</td>
           <td style="padding:12px 0;font-weight:600;color:#1A1A1A;font-size:14px;line-height:1.6;font-family:'Plus Jakarta Sans', sans-serif;">
             ${workshop.venue}
             ${
               workshop.googleMapsUrl
                 ? `<br/><a href="${workshop.googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                       style="color:#2BBCB0;font-size:13px;font-weight:700;text-decoration:underline;margin-top:4px;display:inline-block;font-family:'Plus Jakarta Sans', sans-serif;">
                       📍 View on Google Maps
                     </a>`
                 : ""
             }
           </td>
         </tr>`
      : "";

  // ── Important notes (offline only) ─────────────────────────────────────
  const importantNotes = workshop.isOffline
    ? `<!-- IMPORTANT NOTES -->
       <div style="background:#FFFBEA;border:1px solid #FDE68A;border-radius:16px;padding:18px 20px;margin-bottom:28px;">
         <div style="font-size:11px;font-weight:800;color:#92650A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;font-family:'Plus Jakarta Sans', sans-serif;">
           Important Notes
         </div>
         <ul style="margin:0;padding-left:20px;">
           <li style="padding:5px 0;font-size:14px;color:#78350F;line-height:1.65;font-family:'Plus Jakarta Sans', sans-serif;">
             Please arrive <strong>15 minutes early</strong> for registration and seating.
           </li>
           ${
             !workshop.isFree
               ? `<li style="padding:5px 0;font-size:14px;color:#78350F;line-height:1.65;font-family:'Plus Jakarta Sans', sans-serif;">
                    This is a paid workshop — please carry a copy of this email
                    (digital or printed) for entry.
                  </li>`
               : ""
           }
         </ul>
       </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're Booked — Go Kids</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#FAFAF9;font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF9;padding:40px 16px;width:100%;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0"
             style="max-width:580px;width:100%;background:#FFFFFF;border-radius:24px;
                    overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.03);border:1px solid #ECECEC;">

        <!-- Top Branded Header Strip (Thick Brand Yellow Banner) -->
        <tr>
          <td height="28" style="height:28px;background-color:#F5C518;padding:0;margin:0;line-height:1px;font-size:1px;border-top-left-radius:24px;border-top-right-radius:24px;"></td>
        </tr>

        <!-- Logo header -->
        <tr>
          <td style="padding:32px 40px 12px;text-align:center;">
            <img src="${logoUrl}" alt="Go Kids India" height="42"
                 style="display:inline-block;height:42px;border:none;outline:none;" />
            <div style="font-size:12px;font-weight:600;color:#9CA3AF;margin-top:8px;letter-spacing:0.02em;">
              India's Future Readiness Platform
            </div>
          </td>
        </tr>

        <!-- Confirmed banner -->
        <tr>
          <td style="background:#F0FDF4;padding:24px 40px;text-align:center;border-bottom:1px solid #DCFCE7;">
            <div style="font-size:32px;margin-bottom:8px;">🎉</div>
            <div style="font-size:22px;font-weight:800;color:#15803D;font-family:'Nunito','Plus Jakarta Sans',sans-serif;">
              You're Booked!
            </div>
            <div style="font-size:14px;color:#16a34a;margin-top:6px;font-weight:600;line-height:1.5;font-family:'Plus Jakarta Sans',sans-serif;">
              ${workshop.title}
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">

            <p style="font-size:16px;color:#1A1A1A;margin:0 0 8px 0;font-family:'Plus Jakarta Sans',sans-serif;">
              Hi <strong>${firstName}</strong>,
            </p>
            <p style="font-size:15px;color:#4B5563;line-height:1.75;margin:0 0 28px 0;font-family:'Plus Jakarta Sans',sans-serif;">
              Thank you for enrolling in
              <strong style="color:#1A1A1A;">${workshop.title}</strong>.
              Your seat is confirmed &mdash; we're delighted to have you with us!
            </p>

            <!-- Booking confirmation -->
            <div style="background:#FAFAFA;border:1px solid #ECECEC;border-radius:16px;padding:24px;margin-bottom:24px;">
              <div style="font-size:11px;font-weight:800;color:#9CA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;font-family:'Plus Jakarta Sans',sans-serif;">
                Booking Confirmation
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0;color:#6B7280;font-size:14px;width:40%;font-family:'Plus Jakarta Sans',sans-serif;">Workshop</td>
                  <td style="padding:12px 0;font-weight:700;color:#1A1A1A;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">
                    ${workshop.title}
                  </td>
                </tr>
                <tr style="border-top:1px solid #F3F4F6;">
                  <td style="padding:12px 0;color:#6B7280;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">Parent Name</td>
                  <td style="padding:12px 0;font-weight:700;color:#1A1A1A;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">
                    ${parentName}
                  </td>
                </tr>
                <tr style="border-top:1px solid #F3F4F6;">
                  <td style="padding:12px 0;color:#6B7280;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">Booking ID</td>
                  <td style="padding:12px 0;font-weight:600;color:#1A1A1A;font-size:13px;font-family:monospace;">
                    ${bookingId}
                  </td>
                </tr>
                ${paymentRows}
              </table>
            </div>

            <!-- Workshop details -->
            <div style="background:#FAFAFA;border:1px solid #ECECEC;border-radius:16px;padding:24px;margin-bottom:28px;">
              <div style="font-size:11px;font-weight:800;color:#9CA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;font-family:'Plus Jakarta Sans',sans-serif;">
                Workshop Details
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0;color:#6B7280;font-size:14px;width:40%;font-family:'Plus Jakarta Sans',sans-serif;">Date</td>
                  <td style="padding:12px 0;font-weight:700;color:#1A1A1A;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">
                    ${workshop.date}
                  </td>
                </tr>
                <tr style="border-top:1px solid #F3F4F6;">
                  <td style="padding:12px 0;color:#6B7280;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">Time</td>
                  <td style="padding:12px 0;font-weight:700;color:#1A1A1A;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">
                    ${workshop.time}
                  </td>
                </tr>
                <tr style="border-top:1px solid #F3F4F6;">
                  <td style="padding:12px 0;color:#6B7280;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">Format</td>
                  <td style="padding:12px 0;font-weight:700;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;color:${workshop.isOffline ? "#F4845F" : "#2BBCB0"};">
                    ${workshop.isOffline ? "In-Person (Offline)" : "Online &mdash; Live"}
                  </td>
                </tr>
                ${venueRow}
                <tr style="border-top:1px solid #F3F4F6;">
                  <td style="padding:12px 0;color:#6B7280;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">Duration</td>
                  <td style="padding:12px 0;font-weight:600;color:#1A1A1A;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">
                    ${workshop.duration}
                  </td>
                </tr>
                <tr style="border-top:1px solid #F3F4F6;">
                  <td style="padding:12px 0;color:#6B7280;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">Age Group</td>
                  <td style="padding:12px 0;font-weight:600;color:#1A1A1A;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;">
                    ${workshop.ageGroup}
                  </td>
                </tr>
              </table>
            </div>

            <!-- What to expect -->
            <div style="margin-bottom:28px;">
              <div style="font-size:11px;font-weight:800;color:#9CA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;font-family:'Plus Jakarta Sans', sans-serif;">
                What to Expect
              </div>
              <ul style="margin:0;padding-left:20px;">
                ${whatToExpectHtml}
              </ul>
            </div>

            ${requirementsHtml}
            ${importantNotes}

            <!-- Contact -->
            <div style="background:#F8F9FA;border-radius:16px;padding:18px 20px;margin-bottom:28px;">
              <div style="font-size:11px;font-weight:800;color:#9CA3AF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;font-family:'Plus Jakarta Sans', sans-serif;">
                Need Help?
              </div>
              <p style="font-size:14px;color:#4B5563;margin:0;line-height:1.7;font-family:'Plus Jakarta Sans', sans-serif;">
                For any queries regarding your booking, venue, or rescheduling, please contact:
              </p>
              <p style="font-size:15px;color:#1A1A1A;font-weight:700;margin:10px 0 4px 0;font-family:'Plus Jakarta Sans', sans-serif;">
                Pallavi Modi
              </p>
              <p style="font-size:14px;color:#2BBCB0;font-weight:600;margin:0;font-family:'Plus Jakarta Sans', sans-serif;">
                <a href="tel:+919876524155" style="color:#2BBCB0;text-decoration:none;">
                  +91-9876524155
                </a>
              </p>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin-bottom:8px;">
              <a href="${workshopUrl}"
                 style="display:inline-block;background-color:#F5C518;
                        color:#1A1A1A;font-weight:800;font-size:14px;padding:14px 36px;
                        border-radius:12px;text-decoration:none;
                        box-shadow:0 6px 18px rgba(245,197,24,0.25);
                        font-family:'Plus Jakarta Sans', sans-serif;letter-spacing:0.01em;">
                View Workshop Details &rarr;
              </a>
            </div>

            <!-- Sign-off -->
            <p style="font-size:14px;color:#6B7280;line-height:1.75;margin:28px 0 0 0;text-align:center;font-family:'Plus Jakarta Sans', sans-serif;">
              We can't wait to see you there and help you raise a more confident,
              future-ready learner!
            </p>
            <p style="font-size:14px;color:#6B7280;margin:14px 0 0 0;text-align:center;line-height:1.6;font-family:'Plus Jakarta Sans', sans-serif;">
              Warm regards,<br/>
              <strong style="color:#1A1A1A;">Team Go Kids</strong>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FAFAF8;padding:32px 40px;text-align:center;border-top:1px solid #ECECEC;">
            <img src="${logoUrl}" alt="Go Kids" height="28"
                 style="display:inline-block;height:28px;border:none;outline:none;margin-bottom:12px;opacity:0.85;" />
            <p style="font-size:12px;color:#6B7280;margin:0 0 4px 0;font-weight:600;font-family:'Plus Jakarta Sans', sans-serif;">
              Assessments &nbsp;·&nbsp; Workshops &nbsp;·&nbsp; Mentorship &nbsp;·&nbsp; Expert Talks
            </p>
            <p style="font-size:12px;color:#9CA3AF;margin:0;font-family:'Plus Jakarta Sans', sans-serif;">
              © ${new Date().getFullYear()} Go Kids India &nbsp;·&nbsp;
              <a href="https://gokids.co.in" style="color:#2BBCB0;text-decoration:none;">gokids.co.in</a>
              &nbsp;|&nbsp; +91-9876524155
            </p>
            <p style="font-size:11px;color:#D1D5DB;margin:8px 0 0 0;font-family:'Plus Jakarta Sans', sans-serif;">
              You received this because you enrolled in a Go Kids workshop.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({
    to: parentEmail,
    subject: buildSubject(parentName, workshop),
    html,
  });
}
