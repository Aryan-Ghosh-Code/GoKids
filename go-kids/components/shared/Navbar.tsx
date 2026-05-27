"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Assessments", href: "/assessments" },
  { label: "Workshops", href: "/workshops" },
  { label: "Mentor", href: "/mentors" },
  { label: "Talk", href: "/talk" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 animate-wobble" aria-label="Go Kids Home">
            <div
              className="relative"
              style={{ width: 120, height: 44 }}
            >
              {/* Fallback text logo when image missing */}
              <div
                className="flex items-center gap-2 h-full"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  style={{
                    background: "#F5C518",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontFamily: "var(--font-nunito)",
                    fontWeight: 800,
                    fontSize: 20,
                    color: "#1A1A1A",
                    letterSpacing: "-0.5px",
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                  }}
                >
                  Go Kids
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`nav-link text-sm font-semibold transition-colors ${
                    scrolled ? "text-[#1A1A1A]" : "text-[#1A1A1A]"
                  }`}
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-full text-[#1A1A1A] hover:bg-[#F3F4F6] transition-colors"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm px-5 py-2.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen ? "true" : "false"}
          >
            <Menu size={24} color="#1A1A1A" />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between p-5 border-b border-[#F3F4F6]">
          <span
            style={{
              background: "#F5C518",
              borderRadius: 8,
              padding: "4px 10px",
              fontFamily: "var(--font-nunito)",
              fontWeight: 800,
              fontSize: 18,
              color: "#1A1A1A",
            }}
          >
            Go Kids
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={20} color="#1A1A1A" />
          </button>
        </div>

        <nav className="p-5">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-[#1A1A1A] font-semibold hover:bg-[#FAFAF8] hover:text-[#F5C518] transition-colors"
                  style={{ fontFamily: "var(--font-nunito)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-3">
            <Link
              href="/login"
              className="block text-center px-4 py-3 rounded-full border-2 border-[#1A1A1A] font-semibold text-[#1A1A1A] hover:bg-[#F3F4F6] transition-colors"
              style={{ fontFamily: "var(--font-nunito)" }}
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-primary block text-center w-full"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
