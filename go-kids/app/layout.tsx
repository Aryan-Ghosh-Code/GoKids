import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Go Kids: India's Future Readiness Platform",
  description:
    "Assessments, workshops, mentorship, and expert talks: everything your child needs to discover their strengths and thrive. Join 500+ families building tomorrow's leaders.",
  keywords: ["kids education", "child development", "future readiness", "India", "assessments", "workshops", "mentorship"],
  openGraph: {
    title: "Go Kids: India's Future Readiness Platform",
    description: "Prepare Your Child for the Future, Today",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
