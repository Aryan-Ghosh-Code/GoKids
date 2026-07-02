import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Parent Dashboard | Go Kids",
  description: "Manage your children's learning journey on Go Kids India.",
};

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-offwhite">
      <Navbar />
      {/* Offsetting the content for the fixed Navbar */}
      <main className="grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}
