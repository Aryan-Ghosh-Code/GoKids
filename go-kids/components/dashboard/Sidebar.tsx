"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";

const NAV_ITEMS = [
  { label: "My Profile", href: "/parent/dashboard", icon: LayoutDashboard },
  { label: "My Children", href: "/parent/children", icon: Users },
  { label: "Workshops", href: "/workshops", icon: BookOpen },
  { label: "Assessments", href: "/assessments", icon: ClipboardList },
  { label: "Mentors", href: "/mentors", icon: GraduationCap },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  const name = session?.user?.name || "Parent";
  const email = session?.user?.email || "";
  const initials = getInitials(name);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#F3F4F6]">
        <BrandLogo height={36} />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/parent/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group"
              style={{
                fontFamily: "var(--font-nunito)",
                background: isActive ? "#FFF9E6" : "transparent",
                color: isActive ? "#1A1A1A" : "#6B7280",
                borderLeft: isActive ? "3px solid #F5C518" : "3px solid transparent",
              }}
            >
              <Icon
                size={18}
                style={{ color: isActive ? "#F5C518" : "#9CA3AF" }}
                className="shrink-0 transition-colors group-hover:text-[#F5C518]"
              />
              <span>{label}</span>
              {isActive && (
                <ChevronRight size={14} className="ml-auto" style={{ color: "#F5C518" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-[#F3F4F6]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-[#FAFAF8]">
          {/* Yellow Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-extrabold"
            style={{ background: "#F5C518", color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold truncate" style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}>
              {name}
            </p>
            <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-[#FEF0EB] disabled:opacity-50 cursor-pointer"
          style={{ color: "#F4845F", fontFamily: "var(--font-nunito)" }}
        >
          <LogOut size={18} />
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 w-64 border-r border-[#F3F4F6]"
        style={{ background: "#FFFFFF" }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Top Bar ── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b border-[#F3F4F6]"
        style={{ background: "#FFFFFF" }}
      >
        <BrandLogo height={32} />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} color="#1A1A1A" />
        </button>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/40"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 z-60 w-72 flex flex-col border-r border-[#F3F4F6]"
              style={{ background: "#FFFFFF" }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#F3F4F6]">
                <BrandLogo height={32} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} color="#1A1A1A" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent onClose={() => setMobileOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
