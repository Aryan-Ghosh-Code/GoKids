"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";

const navLinks = [
  { label: "Assessments", href: "/assessments" },
  { label: "Workshops", href: "/workshops" },
  { label: "Mentor", href: "/mentors" },
  { label: "Talk", href: "/talk" },
  { label: "About", href: "/#about" },
  { label: "Insights", href: "/#insights" },
  { label: "Contact", href: "/#contact" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isDarkHero = pathname.startsWith("/workshops");
  const isLoggedIn = status === "authenticated" && !!session;
  const userName = session?.user?.name || "User";
  const initials = getInitials(userName);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#user-menu-container")) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const linkColor = scrolled
    ? "#1A1A1A"
    : isDarkHero
    ? "rgba(255,255,255,0.95)"
    : "#1A1A1A";

  const linkHoverClass = isDarkHero && !scrolled
    ? "hover:text-[#F5C518]"
    : "hover:text-[#2BBCB0]";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-brand-grey shadow-md"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo height={40} priority />

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`nav-link text-[13px] font-bold tracking-wide transition-colors duration-200 ${linkHoverClass}`}
                  style={{ color: linkColor, fontFamily: "var(--font-nunito)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA — session-aware */}
          <div className="hidden lg:flex items-center gap-3">
            {status === "loading" ? (
              /* Skeleton placeholder while session loads */
              <div className="w-8 h-8 rounded-full bg-brand-grey animate-pulse" />
            ) : isLoggedIn ? (
              /* Logged-in: avatar + dropdown */
              <div id="user-menu-container" className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border transition-all duration-200 ${
                    scrolled || !isDarkHero
                      ? "border-[#E5E7EB] bg-brand-offwhite/50 hover:bg-[#FFF9E6] hover:border-primary"
                      : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
                  }`}
                  style={{
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                  aria-label="User menu"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
                    style={{
                      background: "#F5C518",
                      color: "#1A1A1A",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {initials}
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: scrolled || !isDarkHero ? "#1A1A1A" : "white",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {userName.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 opacity-70"
                    style={{
                      color:
                        scrolled || !isDarkHero
                          ? "#6B7280"
                          : "rgba(255,255,255,0.7)",
                      transform: userMenuOpen ? "rotate(180deg)" : "none",
                    }}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-brand-grey shadow-xl py-1.5 z-60">
                    <Link
                      href="/parent/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-[#FFF9E6] transition-colors"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      <LayoutDashboard size={15} style={{ color: "#F5C518" }} />
                      Dashboard
                    </Link>
                    <hr className="my-1 border-brand-grey" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-[#FEF0EB] transition-colors"
                      style={{
                        color: "#F4845F",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-250 ${
                  scrolled || !isDarkHero
                    ? "bg-brand-black text-white hover:bg-[#1D1D1F]/90 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    : "bg-white text-brand-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get started
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-brand-grey transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen ? "true" : "false"}
          >
            <Menu
              size={24}
              color={scrolled ? "#1A1A1A" : isDarkHero ? "#FFFFFF" : "#1A1A1A"}
            />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-70 w-75 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between p-5 border-b border-brand-grey">
          <BrandLogo height={36} />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-brand-grey transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={20} color="#1A1A1A" />
          </button>
        </div>

        <nav className="p-5 overflow-y-auto h-full pb-24">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-brand-black font-semibold hover:bg-brand-offwhite hover:text-primary transition-colors"
                  style={{ fontFamily: "var(--font-nunito)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-3">
            {isLoggedIn ? (
              <>
                {/* Logged-in mobile: user info + buttons */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "#FFF9E6" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                    style={{
                      background: "#F5C518",
                      color: "#1A1A1A",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-bold truncate"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {userName}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "#9CA3AF" }}
                    >
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/parent/dashboard"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-sm transition-colors"
                  style={{
                    background: "#F5C518",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-nunito)",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard size={15} />
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-sm border transition-colors hover:bg-[#FEF0EB]"
                  style={{
                    borderColor: "#F4845F",
                    color: "#F4845F",
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/register"
                className="block text-center px-5 py-2.5 rounded-full bg-brand-black text-white font-semibold text-sm transition-all duration-200 hover:bg-brand-black/90"
                style={{ fontFamily: "var(--font-heading)" }}
                onClick={() => setMobileOpen(false)}
              >
                Get started
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
