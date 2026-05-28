import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BrandLogo from "@/components/shared/BrandLogo";

export const metadata: Metadata = {
  title: "Dashboard | Go Kids",
};

export default async function ParentDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const name = session.user?.name || "Parent";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      {/* Background shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-10 right-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: "#F5C518", filter: "blur(56px)" }}
        />
        <div
          className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-15"
          style={{ background: "#2BBCB0", filter: "blur(44px)" }}
        />
      </div>

      <div
        className="relative bg-white rounded-3xl p-10 max-w-lg w-full text-center"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid #F3F4F6" }}
      >
        <div className="flex justify-center mb-6">
          <BrandLogo height={48} href={false} />
        </div>

        {/* Welcome */}
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
        >
          Welcome back, {name}! 👋
        </h1>
        <p className="text-base mb-8" style={{ color: "#6B7280" }}>
          Your parent dashboard is coming in Week 2. For now, explore what Go Kids has to offer.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { label: "📋 Assessments", href: "/assessments", color: "#E8F8F7", text: "#2BBCB0" },
            { label: "📚 Workshops", href: "/workshops", color: "#FEF0EB", text: "#F4845F" },
            { label: "👥 Mentors", href: "/mentors", color: "#E8F6FE", text: "#4FC3F7" },
            { label: "🎤 Talk", href: "/talk", color: "#FFF9E6", text: "#D4A900" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-105"
              style={{ background: item.color, color: item.text, fontFamily: "var(--font-nunito)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Session info */}
        <div
          className="text-xs px-4 py-2 rounded-xl"
          style={{ background: "#FAFAF8", color: "#9CA3AF", border: "1px solid #F3F4F6" }}
        >
          Logged in as <strong style={{ color: "#1A1A1A" }}>{session.user?.email}</strong>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-semibold hover:underline"
            style={{ color: "#F5C518", fontFamily: "var(--font-nunito)" }}
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
