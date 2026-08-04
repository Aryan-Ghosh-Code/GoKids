"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ArrowRight,
  Shield,
  GraduationCap,
  Users,
} from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";

// ─── Nav link definitions ─────────────────────────────────────────────────────
const navLinks = [
  { label: "Assessments", href: "/assessments" },
  { label: "Mentor", href: "/mentors" },
  { label: "Talk", href: "/talk" },
  { label: "About", href: "/#about" },
  { label: "Insights", href: "/#insights" },
  { label: "Contact", href: "/#contact" },
];

const workshopSubLinks = [
  {
    label: "For Children",
    href: "/workshops/children",
    icon: GraduationCap,
    description: "Coding, Maths, Science & more",
  },
  {
    label: "For Parents",
    href: "/workshops/parents",
    icon: Users,
    description: "Guidance for raising learners",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Workshops Dropdown (Desktop) ─────────────────────────────────────────────
function WorkshopsDropdown({
  linkColor,
  linkHoverClass,
}: {
  linkColor: string;
  linkHoverClass: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const isActive =
    pathname.startsWith("/workshops/children") ||
    pathname.startsWith("/workshops/parents");

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger — pb-2 extends the hover zone downward to bridge the gap */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`nav-link flex items-center justify-center gap-1 text-[13px] font-bold tracking-wide transition-colors duration-200 ${linkHoverClass} ${isActive ? "text-primary" : ""}`}
        style={{
          color: isActive ? "#F5C518" : linkColor,
          fontFamily: "var(--font-nunito)",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>Workshops</span>
        <ChevronDown
          size={14}
          className="transition-transform duration-200 shrink-0"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            opacity: 0.8,
            marginLeft: "2px",
            display: "inline-block",
          }}
        />
      </button>

      {/* Dropdown panel — pt-2 replaces mt-2 so hover area is continuous */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-64 pt-2 z-60">
          <div
            className="rounded-2xl bg-white border border-brand-grey py-2 overflow-hidden"
            style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}
          >
            {/* Arrow pointer */}
            <div className="absolute pt-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-brand-grey rotate-45" />

            {workshopSubLinks.map((sub) => {
              const Icon = sub.icon;
              const isSubActive = pathname.startsWith(sub.href);
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 mx-1.5 rounded-xl transition-colors group"
                  style={{
                    background: isSubActive ? "#FFF9E6" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubActive)
                      e.currentTarget.style.background = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isSubActive ? "#F5C518" : "#F3F4F6",
                    }}
                  >
                    <Icon
                      size={14}
                      style={{ color: isSubActive ? "#1A1A1A" : "#6B7280" }}
                    />
                  </span>
                  <span>
                    <span
                      className="block text-sm font-bold"
                      style={{
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {sub.label}
                    </span>
                    <span
                      className="block text-xs mt-0.5"
                      style={{
                        color: "#9CA3AF",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {sub.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </li>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileWorkshopsOpen, setMobileWorkshopsOpen] = useState(false);

  const isDarkHero = pathname.startsWith("/workshops");
  const isLoggedIn = status === "authenticated" && !!session;
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image ?? null;
  const initials = getInitials(userName);

  const showGetStarted = ![
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ].includes(pathname);

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

  const linkHoverClass =
    isDarkHero && !scrolled ? "hover:text-[#F5C518]" : "hover:text-[#2BBCB0]";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-brand-grey shadow-md"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo height={40} priority />

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-7">
            {/* Workshops dropdown — comes first after logo */}
            <WorkshopsDropdown
              linkColor={linkColor}
              linkHoverClass={linkHoverClass}
            />
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`nav-link text-[13px] font-bold tracking-wide transition-colors duration-200 ${linkHoverClass}`}
                  style={{
                    color: linkColor,
                    fontFamily: "var(--font-nunito)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA — session-aware */}
          <div className="hidden lg:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-brand-grey animate-pulse" />
            ) : isLoggedIn ? (
              <div id="user-menu-container" className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border transition-all duration-200 ${
                    scrolled || !isDarkHero
                      ? "border-[#E5E7EB] bg-brand-offwhite/50 hover:bg-[#FFF9E6] hover:border-primary"
                      : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
                  }`}
                  style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}
                  aria-label="User menu"
                >
                  {userImage ? (
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={userImage}
                        alt={userName}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
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
                  )}
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

                {/* User dropdown */}
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
                    {((session?.user as { role?: string })?.role === "admin" ||
                      (session?.user as { role?: string })?.role ===
                        "superadmin") && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-[#FFF9E6] transition-colors"
                        style={{
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        <Shield size={15} style={{ color: "#2BBCB0" }} />
                        Admin Panel
                      </Link>
                    )}
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
            ) : showGetStarted ? (
              <Link
                href="/login"
                className={`inline-flex gap-2 text-sm items-center font-extrabold px-5 py-2.5 rounded-xl border-1.5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] ${
                  scrolled || !isDarkHero
                    ? "bg-primary/80 border-black text-brand-black/85 hover:shadow-[0_4px_15px_rgba(43,188,176,0.3)]"
                    : "bg-white border-white text-brand-black hover:bg-teal hover:border-teal hover:text-white hover:shadow-[0_4px_15px_rgba(43,188,176,0.3)]"
                }`}
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Join Us <ArrowRight size={16} />
              </Link>
            ) : null}
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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
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
            {/* Workshops accordion */}
            <li>
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-brand-black font-semibold hover:bg-brand-offwhite hover:text-primary transition-colors"
                style={{ fontFamily: "var(--font-nunito)" }}
                onClick={() => setMobileWorkshopsOpen((v) => !v)}
              >
                <span>Workshops</span>
                <ChevronDown
                  size={16}
                  className="transition-transform duration-200"
                  style={{
                    transform: mobileWorkshopsOpen ? "rotate(180deg)" : "none",
                    color: "#9CA3AF",
                  }}
                />
              </button>
              {mobileWorkshopsOpen && (
                <ul className="mt-1 ml-4 space-y-1">
                  {workshopSubLinks.map((sub) => {
                    const Icon = sub.icon;
                    return (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors"
                          style={{ fontFamily: "var(--font-nunito)" }}
                          onClick={() => setMobileOpen(false)}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#FFF9E6")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "#F3F4F6" }}
                          >
                            <Icon size={13} style={{ color: "#6B7280" }} />
                          </span>
                          <span>
                            <span
                              className="block text-sm font-bold"
                              style={{ color: "#1A1A1A" }}
                            >
                              {sub.label}
                            </span>
                            <span
                              className="block text-xs"
                              style={{ color: "#9CA3AF" }}
                            >
                              {sub.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

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
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "#FFF9E6" }}
                >
                  {userImage ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={userImage}
                        alt={userName}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
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
                  )}
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

                {((session?.user as { role?: string })?.role === "admin" ||
                  (session?.user as { role?: string })?.role ===
                    "superadmin") && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-sm transition-colors border border-primary hover:bg-[#FFF9E6]"
                    style={{
                      color: "#1A1A1A",
                      fontFamily: "var(--font-nunito)",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Shield size={15} />
                    Admin Panel
                  </Link>
                )}

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
            ) : showGetStarted ? (
              <Link
                href="/login"
                className="block text-center px-5 py-3 rounded-2xl bg-primary text-brand-black font-extrabold text-sm transition-all duration-200 hover:bg-primary-dark active:scale-[0.98] shadow-md hover:shadow-lg"
                style={{ fontFamily: "var(--font-nunito)" }}
                onClick={() => setMobileOpen(false)}
              >
                Get started
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </>
  );
}
