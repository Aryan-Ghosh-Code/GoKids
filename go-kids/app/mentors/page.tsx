import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import MentorModel from "@/lib/db/models/Mentor";
import MentorCard from "@/components/mentors/MentorCard";
import MentorsClient from "@/components/mentors/MentorsClient";
import type { IMentor } from "@/lib/db/models/Mentor";
import {
  ArrowRight,
  Users,
  ShieldCheck,
  HeartHandshake,
  Clock,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Expert Mentors for Kids — Go Kids India",
  description:
    "Connect with India's top child psychologists, career coaches, and education specialists. Personalised 1-on-1 mentorship for children aged 6–18.",
  openGraph: {
    title: "Expert Mentors for Kids — Go Kids India",
    description:
      "Personalised 1-on-1 mentorship sessions for children aged 6–18.",
  },
};

// ── Hero ─────────────────────────────────────────────────────────────────────
function MentorsHero() {
  return (
    <section
      className="relative w-full overflow-hidden pt-28 pb-0"
      style={{
        background:
          "linear-gradient(145deg, #FFFDF0 0%, #FFFEF8 50%, #F0FBF9 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-150 h-150 rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, #FFF3CC 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-100 h-100 rounded-full pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, #C7F7F3 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left text block */}
          <div className="py-2 flex flex-col items-start">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold mb-6 shadow-sm"
              style={{
                background: "#FFF3CC",
                color: "#92650A",
                border: "1.5px solid #F5C518",
              }}
            >
              <HeartHandshake size={14} />
              1-on-1 Verified Mentorship
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-5 text-gray-900"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Expert Guidance for{" "}
              <span style={{ color: "#2BBCB0" }}>Every Child&apos;s</span>{" "}
              Journey
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-gray-600 mb-8 max-w-lg text-justify">
              Connect with India&apos;s top child psychologists, career coaches,
              and education specialists for personalised 1-on-1 sessions
              tailored to your child&apos;s unique goals and potential.
            </p>

            {/* Trust bullets */}
            <div className="flex flex-col gap-2.5 mb-10">
              {[
                "100% verified, background-checked experts",
                "Sessions tailored for children aged 6–18",
                "Free during our launch phase",
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2.5 text-sm font-medium text-gray-700"
                >
                  <CheckCircle size={16} className="text-teal-500 shrink-0" />
                  {point}
                </div>
              ))}
            </div>

            {/* CTAs — single row on all screen sizes */}
            <div className="flex flex-nowrap gap-2 sm:gap-3 w-full">
              <a
                href="#mentors-grid"
                className="btn-primary inline-flex items-center justify-center gap-1.5 px-3.5! sm:px-7! py-2.5! sm:py-3.5! text-xs! sm:text-sm! whitespace-nowrap shrink-0"
              >
                Find My Mentor <ArrowRight size={14} />
              </a>
              <Link
                href="/become-a-mentor"
                className="inline-flex items-center justify-center gap-1.5 px-3.5! sm:px-7! py-2.5! sm:py-3.5! rounded-full text-xs! sm:text-sm! font-bold transition-all bg-white text-brand-black border-[1.5px] border-[#D1D5DB] hover:border-primary hover:bg-[#FFFBEA] whitespace-nowrap shrink-0"
                style={{ fontFamily: "var(--font-nunito)" }}
              >
                Become a Mentor
              </Link>
            </div>

            {/* Social proof strip — single row on all screen sizes */}
            <div className="flex flex-nowrap items-center gap-3 sm:gap-6 mt-10 border-t border-gray-200/70 w-full overflow-x-auto scrollbar-none">
              {[
                { icon: <Users size={13} />, label: "500+ Mentored" },
                { icon: <ShieldCheck size={13} />, label: "100% Verified" },
                { icon: <Clock size={13} />, label: "Flexible 1:1" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-600 whitespace-nowrap shrink-0"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                    {s.icon}
                  </span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mentor illustration image */}
          <div className="relative items-center justify-center lg:justify-end h-full hidden lg:flex py-8">
            <div className="relative w-115 h-120">
              {/* Yellow offset frame — same style as homepage image frame */}
              <div
                aria-hidden="true"
                className="absolute rounded-3xl"
                style={{
                  inset: 0,
                  transform: "translate(12px, 12px)",
                  background: "#F5C518",
                  opacity: 0.2,
                  zIndex: 0,
                  borderRadius: 24,
                }}
              />
              {/* SVG dot pattern — same as homepage */}
              <div
                aria-hidden="true"
                className="absolute -top-6 -right-6 opacity-40"
                style={{ zIndex: 0 }}
              >
                <svg width="100" height="100" viewBox="0 0 100 100">
                  {Array.from({ length: 5 }).map((_, row) =>
                    Array.from({ length: 5 }).map((_, col) => (
                      <circle
                        key={`${row}-${col}`}
                        cx={col * 20 + 10}
                        cy={row * 20 + 10}
                        r="2.5"
                        fill="#F5C518"
                      />
                    )),
                  )}
                </svg>
              </div>
              <Image
                src="/images/mentor.png"
                alt="Expert mentors for children"
                width={460}
                height={480}
                className="relative z-10 object-contain object-bottom"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.10))" }}
                priority
              />
              {/* Floating badge — sessions today */}
              <div
                className="absolute top-1 -left-7 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-lg"
                style={{ background: "white", border: "1.5px solid #F5C518" }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 leading-none mb-0.5">
                    Sessions Today
                  </p>
                  <p
                    className="text-xs font-extrabold text-gray-900"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    12 Available
                  </p>
                </div>
              </div>
              {/* Floating badge — expert rating */}
              <div
                className="absolute bottom-2 right-0 z-20 flex flex-col items-center px-4 py-3 rounded-2xl shadow-lg"
                style={{ background: "white", border: "1.5px solid #E5E7EB" }}
              >
                <p className="text-[10px] font-bold text-gray-400 mb-1">
                  Expert Rating
                </p>
                <p
                  className="text-lg font-extrabold"
                  style={{ fontFamily: "var(--font-nunito)", color: "#F5C518" }}
                >
                  ★ 4.9
                  <span className="text-xs text-gray-500 font-normal">/5</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      {/* <div className="w-full overflow-hidden leading-none" style={{ height: "48px" }}>
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,48 L1440,48 L1440,16 Q1080,48 720,16 Q360,-16 0,16 Z" fill="#FAFAF8" />
        </svg>
      </div> */}
    </section>
  );
}

// ── Featured Mentors Row ───────────────────────────────────────────────────────
function FeaturedMentors({ mentors }: { mentors: IMentor[] }) {
  if (!mentors.length) return null;
  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1 text-teal-600">
            ★ Featured Specialists
          </p>
          <h2
            className="text-2xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Top Featured Mentors
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((m, i) => (
            <MentorCard key={String(m._id)} mentor={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── All mentors (paginated client) ────────────────────────────────────────────
function AllMentors({
  total,
  allCategoriesMentors,
}: {
  mentors: IMentor[];
  total: number;
  allCategoriesMentors: IMentor[];
}) {
  return (
    <section
      id="mentors-grid"
      className="py-12"
      style={{ background: "#FAFAF8" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "#2BBCB0", fontFamily: "var(--font-nunito)" }}
          >
            Our Expert Network
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2
              className="text-2xl sm:text-3xl font-extrabold"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
            >
              Find Your Perfect Mentor
            </h2>
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{total}</span> verified
              experts available
            </p>
          </div>
        </div>
        <Suspense>
          <MentorsClient
            initialMentors={allCategoriesMentors}
            initialTotal={total}
          />
        </Suspense>
      </div>
    </section>
  );
}

// ── Become a Mentor CTA ───────────────────────────────────────────────────────
function BecomeMentorCTA() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: "#F5C518" }}
    >
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Soft edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(180,140,0,0.25) 100%)",
        }}
      />

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <h2
          className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight text-gray-900"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          Are you an expert who loves working with kids?
        </h2>
        <p
          className="text-sm sm:text-base mb-10 max-w-xl mx-auto font-medium"
          style={{ color: "rgba(0,0,0,0.55)" }}
        >
          No commitments. No pressure. Join our network of verified mentors and
          start making a difference — one child at a time.
        </p>

        {/* Black primary + white outline secondary */}
        <div className="flex flex-nowrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/become-a-mentor"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all bg-gray-900 text-white hover:bg-gray-700 shadow-lg"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Apply to Join <ArrowRight size={15} />
          </Link>
          <a
            href="#mentors-grid"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all bg-white text-gray-900 border-2 border-gray-900/10 hover:border-gray-900 hover:bg-gray-50"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Browse Mentors <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How do I book a session with a mentor?",
    a: "Browse our mentor directory, click on a mentor you like, choose an available time slot on their calendar, and confirm your booking. You'll receive a confirmation email within minutes.",
  },
  {
    q: "Are sessions online or in-person?",
    a: "All sessions are conducted online via video call (Zoom or Google Meet). The mentor will share the meeting link once your booking is confirmed.",
  },
  {
    q: "How does payment work?",
    a: "Mentorship sessions on Go Kids are currently free during our launch phase. Secure payments via Razorpay will be introduced in a future update.",
  },
  {
    q: "Can I choose a specific mentor for my child?",
    a: "Absolutely! Browse mentor profiles, read their bios and expertise, and choose the one that best matches your child's needs. You can always switch mentors for future sessions.",
  },
  {
    q: "What happens after I book a session?",
    a: "You'll receive a confirmation email. The mentor will review your booking, add a meeting link, and you'll be notified by email. On the day, simply click the link to join.",
  },
  {
    q: "How do I become a mentor on Go Kids?",
    a: "Click 'Apply to Become a Mentor', fill in the 3-step application form, and our team will review it within 48 hours. Approved mentors get a dedicated profile page and access to their mentor dashboard.",
  },
];

function FAQSection() {
  return (
    <section className="py-20" style={{ background: "#FFFFFF" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#F4845F" }}
          >
            Got Questions?
          </p>
          <h2
            className="text-2xl sm:text-4xl font-extrabold"
            style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
          >
            Frequently Asked Questions
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group rounded-2xl border overflow-hidden"
              style={{ borderColor: "#F3F4F6" }}
            >
              <summary
                className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-bold text-sm transition-colors hover:bg-[#FFFBEB]"
                style={{ fontFamily: "var(--font-nunito)", color: "#1A1A1A" }}
              >
                {faq.q}
                <span className="text-xl text-gray-400 group-open:rotate-45 transition-transform duration-200 ml-4 shrink-0">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 pt-1 text-sm leading-relaxed text-gray-600 border-t border-gray-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function MentorsPage() {
  await connectDB();

  const [featuredRaw, allRaw, total, allCategoriesRaw] = await Promise.all([
    MentorModel.find({ isPublished: true, isFeatured: true }).limit(3).lean(),
    MentorModel.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    MentorModel.countDocuments({ isPublished: true }),
    // Fetch all published mentors to dynamically extract categories on the client side
    MentorModel.find({ isPublished: true }).select("categories").lean(),
  ]);

  const featured = JSON.parse(JSON.stringify(featuredRaw)) as IMentor[];
  const all = JSON.parse(JSON.stringify(allRaw)) as IMentor[];
  const allCategoriesMentors = JSON.parse(
    JSON.stringify(allCategoriesRaw),
  ) as IMentor[];

  return (
    <main style={{ background: "#FAFAF8", minHeight: "100vh" }}>
      <MentorsHero />
      <FeaturedMentors mentors={featured} />
      <AllMentors
        mentors={all}
        total={total}
        allCategoriesMentors={allCategoriesMentors}
      />
      <BecomeMentorCTA />
      <FAQSection />
    </main>
  );
}
