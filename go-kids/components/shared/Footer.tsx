"use client";

import Link from "next/link";
import BrandLogo from "@/components/shared/BrandLogo";

// Inline SVG social icons (lucide-react v0.x doesn't export Instagram/Youtube/Linkedin)
function InstagramSvg({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function FacebookSvg({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function LinkedinSvg({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

const footerLinks = {
  Platform: [
    { label: "Assessments", href: "/assessments" },
    { label: "Workshops", href: "/workshops" },
    { label: "Mentor", href: "/mentors" },
    { label: "Talk", href: "/talk" },
  ],
  Company: [
    { label: "About Us", href: "/#about" },
    { label: "Contact", href: "/#contact" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#1A1A1A" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-5">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <BrandLogo height={44} href="/" />
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#9CA3AF", maxWidth: 260 }}
            >
              India&apos;s Future Readiness Platform; helping children discover
              their strengths and thrive in tomorrow&apos;s world.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {[
                {
                  icon: InstagramSvg,
                  label: "Instagram",
                  href: "https://www.instagram.com/gokidsindia",
                },
                {
                  icon: FacebookSvg,
                  label: "Facebook",
                  href: "https://www.facebook.com/Gokidszkp",
                },
                {
                  icon: LinkedinSvg,
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/gokidsindia/",
                },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ background: "#2A2A2A" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#F5C518";
                    (e.currentTarget as HTMLElement).style.color = "#1A1A1A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#2A2A2A";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="text-sm font-bold uppercase tracking-wider mb-4"
                style={{ color: "#F5C518", fontFamily: "var(--font-nunito)" }}
              >
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "#9CA3AF" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "#F5C518";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "#9CA3AF";
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: "1px solid #2A2A2A", color: "#6B7280" }}
        >
          <p>
            © {new Date().getFullYear()} Go Kids India. All rights reserved.
          </p>
          <p>Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
