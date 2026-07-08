"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Mail,
  Phone,
  Calendar,
  Users,
  BookOpen,
  ClipboardList,
  Plus,
  Shield,
  User,
  Clock,
  Download,
  AlertCircle,
} from "lucide-react";
import EditProfileDialog from "@/components/dashboard/EditProfileDialog";
import ChildCard, { type ChildData } from "@/components/dashboard/ChildCard";
import ChildFormDialog from "@/components/dashboard/ChildFormDialog";
import DeleteChildDialog from "@/components/dashboard/DeleteChildDialog";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  provider: string;
  createdAt: string;
}

interface DBAssessment {
  _id: string;
  type: string;
  formData: {
    childName: string;
    ageBand: string;
  };
  results: {
    overall: number;
    level: string;
    sublabel: string;
  };
  createdAt: string;
}

interface ProfilePageClientProps {
  user: UserProfile;
  childProfiles: ChildData[];
  dbAssessments?: DBAssessment[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePageClient({
  user,
  childProfiles,
  dbAssessments,
}: ProfilePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState(user);
  const [editOpen, setEditOpen] = useState(false);

  // Child management state
  const [childrenList, setChildrenList] = useState<ChildData[]>(childProfiles);
  const [addOpen, setAddOpen] = useState(false);
  const [editChild, setEditChild] = useState<ChildData | null>(null);
  const [deleteChild, setDeleteChild] = useState<ChildData | null>(null);

  // Sync tab selection from search parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab &&
      ["profile", "children", "workshops", "assessments"].includes(tab)
    ) {
      const t = setTimeout(() => {
        setActiveTab(tab);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Push new query parameter to update URL without page refresh
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`/parent/dashboard?${params.toString()}`);
  };

  const initials = getInitials(profile.name);

  const allAssessments = (dbAssessments || []).map((db) => ({
    id: db._id,
    title:
      db.type === "attention-span"
        ? "Attention Span Assessment"
        : "Talent Assessment",
    childName: db.formData.childName,
    completedDate: new Date(db.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }),
    status: "Report Ready",
    result: `${db.results.level} Level: ${db.results.sublabel} (Overall Score: ${db.results.overall}/100)`,
    color:
      db.results.level === "High"
        ? "#2BBCB0"
        : db.results.level === "Moderate"
          ? "#F5C518"
          : "#F4845F",
    bg:
      db.results.level === "High"
        ? "#F0FAFA"
        : db.results.level === "Moderate"
          ? "#FFF9E6"
          : "#FEF0EB",
  }));

  // Handlers for child CRUD
  const handleAdded = (newChild: ChildData) => {
    setChildrenList((prev) => [newChild, ...prev]);
  };

  const handleEdited = (updated: ChildData) => {
    setChildrenList((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c)),
    );
  };

  const handleDeleted = (id: string) => {
    setChildrenList((prev) => prev.filter((c) => c._id !== id));
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "children", label: "My Children", icon: Users },
    { id: "workshops", label: "Registered Workshops", icon: BookOpen },
    { id: "assessments", label: "Talent Assessments", icon: ClipboardList },
  ];

  return (
    <div className="px-4 sm:px-6 py-10 max-w-6xl mx-auto space-y-8 min-h-[75vh]">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <h1
            className="text-3xl font-extrabold text-brand-black"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Parent Hub
          </h1>
          <p className="text-sm text-brand-grey-text">
            Manage your account, view children profiles, and track workshops &
            talent assessments.
          </p>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div 
        className="hidden md:flex border-b border-[#E5E7EB] scrollbar-none gap-2 w-full flex-row flex-nowrap"
        style={{ 
          overflowX: "auto", 
          overflowY: "hidden", 
          WebkitOverflowScrolling: "touch",
          paddingBottom: "2px"
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap outline-none cursor-pointer shrink-0"
              style={{
                borderColor: isActive ? "#F5C518" : "transparent",
                color: isActive ? "#1A1A1A" : "#6B7280",
                fontFamily: "var(--font-nunito)",
              }}
            >
              <Icon
                size={16}
                style={{ color: isActive ? "#F5C518" : "#9CA3AF" }}
              />
              {tab.label}
              {tab.id === "children" && childrenList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-2xs bg-[#FFF9E6] text-primary-dark">
                  {childrenList.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className="mt-4 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          {/* TAB 1: Profile */}
          {activeTab === "profile" && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div
                className="relative bg-white rounded-3xl overflow-hidden border border-brand-grey"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                {/* Yellow banner strip */}
                <div
                  className="h-32 w-full relative"
                  style={{
                    background:
                      "linear-gradient(135deg, #F5C518 0%, #FFE566 50%, #F5C518 100%)",
                  }}
                >
                  {/* <div
                    className="absolute top-4 right-8 w-24 h-24 rounded-full opacity-15"
                    style={{ background: "#1A1A1A" }}
                  /> */}
                  <div
                    className="absolute -bottom-6 left-28 w-16 h-16 rounded-full opacity-10"
                    style={{ background: "#1A1A1A" }}
                  />
                </div>

                <div className="px-6 pb-6">
                  {/* Avatar section */}
                  <div className="flex items-end justify-between -mt-14 mb-5">
                    <div className="relative">
                      {profile.photoUrl ? (
                        <div
                          className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white"
                          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
                        >
                          <Image
                            src={profile.photoUrl}
                            alt={profile.name}
                            width={112}
                            height={112}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-extrabold border-4 border-white"
                          style={{
                            background: "#FFF9E6",
                            color: "#D4A900",
                            fontFamily: "var(--font-nunito)",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                          }}
                        >
                          {initials}
                        </div>
                      )}
                      <div
                        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                        style={{ background: "#2BBCB0" }}
                        title="Verified Account"
                      >
                        <Shield size={11} color="white" />
                      </div>
                    </div>

                    <button
                      onClick={() => setEditOpen(true)}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all hover:bg-[#FFF9E6] hover:border-primary"
                      style={{
                        borderColor: "#E5E7EB",
                        color: "#1A1A1A",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      <Edit3 size={14} />
                      Edit Profile
                    </button>
                  </div>

                  <h2
                    className="text-2xl font-extrabold mb-1"
                    style={{
                      color: "#1A1A1A",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    {profile.name}
                  </h2>
                  <p className="text-sm mb-6 text-brand-grey-text">
                    Parent &middot; Go Kids India Member
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-brand-grey">
                    <div className="space-y-1">
                      <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">
                        Email Address
                      </p>
                      <span className="flex items-center gap-2 text-sm font-semibold text-brand-black">
                        <Mail size={15} style={{ color: "#2BBCB0" }} />
                        {profile.email}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">
                        Mobile Number
                      </p>
                      <span className="flex items-center gap-2 text-sm font-semibold text-brand-black">
                        <Phone size={15} style={{ color: "#F4845F" }} />
                        {profile.phone
                          ? `+91 ${profile.phone}`
                          : "Not provided"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">
                        Member Since
                      </p>
                      <span className="flex items-center gap-2 text-sm font-semibold text-brand-black">
                        <Calendar size={15} style={{ color: "#F5C518" }} />
                        {formatDate(profile.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Children */}
          {activeTab === "children" && (
            <motion.div
              key="children-tab"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-grey pb-4">
                <div>
                  <h2
                    className="text-xl font-extrabold text-brand-black"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    My Children ({childrenList.length})
                  </h2>
                  <p className="text-xs text-brand-grey-text">
                    Add, update, or remove child profiles to receive tailored
                    insights.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditChild(null);
                    setAddOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-md active:scale-95 cursor-pointer shrink-0"
                  style={{
                    background: "#F5C518",
                    color: "#1A1A1A",
                    fontFamily: "var(--font-nunito)",
                    boxShadow: "0 4px 14px rgba(245,197,24,0.35)",
                  }}
                >
                  <Plus size={16} />
                  Add Child
                </button>
              </div>

              {childrenList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-[#E5E7EB] rounded-3xl bg-white">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-[#FFF9E6]">
                    <Users size={28} style={{ color: "#F5C518" }} />
                  </div>
                  <h3
                    className="text-lg font-bold text-brand-black mb-1"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    No children registered yet
                  </h3>
                  <p className="text-xs text-brand-grey-text max-w-sm mb-6">
                    Create profiles for your children to unlock talent
                    assessments and workshop registrations.
                  </p>
                  <button
                    onClick={() => {
                      setEditChild(null);
                      setAddOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold cursor-pointer"
                    style={{
                      background: "#F5C518",
                      color: "#1A1A1A",
                      fontFamily: "var(--font-nunito)",
                    }}
                  >
                    <Plus size={16} /> Add First Child
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {childrenList.map((child, i) => (
                    <ChildCard
                      key={child._id}
                      child={child}
                      index={i}
                      onEdit={(c) => {
                        setEditChild(c);
                        setAddOpen(true);
                      }}
                      onDelete={(c) => setDeleteChild(c)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Registered Workshops */}
          {activeTab === "workshops" && (
            <motion.div
              key="workshops-tab"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2
                  className="text-xl font-extrabold text-brand-black"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Registered Workshops
                </h2>
                <p className="text-xs text-brand-grey-text">
                  View schedule details and access credentials for your
                  children&apos;s upcoming and past workshops.
                </p>
              </div>

              {childrenList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-[#E5E7EB] rounded-3xl bg-white">
                  <AlertCircle size={28} className="text-coral mb-4" />
                  <h3
                    className="text-lg font-bold text-brand-black mb-1"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Children profiles required
                  </h3>
                  <p className="text-xs text-brand-grey-text max-w-sm mb-6">
                    Please add a child profile first in the &quot;My
                    Children&quot; tab to register them for workshops.
                  </p>
                  <button
                    onClick={() => handleTabChange("children")}
                    className="px-5 py-2.5 rounded-full text-sm font-bold bg-primary text-brand-black cursor-pointer"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Manage Children
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-[#E5E7EB] rounded-4xl bg-white space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-2xl mx-auto">
                    📚
                  </div>
                  <h3
                    className="text-lg font-bold text-brand-black"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    No registered workshops yet
                  </h3>
                  <p className="text-xs text-brand-grey-text max-w-sm">
                    You haven&apos;t enrolled your children in any workshops
                    yet. Explore our expert-led skill building workshops to get
                    started.
                  </p>
                  <Link
                    href="/workshops"
                    className="inline-block px-6 py-3 rounded-full text-xs font-extrabold bg-primary text-brand-black transition-all hover:scale-105 shadow-xs"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      textDecoration: "none",
                    }}
                  >
                    Explore Workshops
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Talent Assessments */}
          {activeTab === "assessments" && (
            <motion.div
              key="assessments-tab"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2
                  className="text-xl font-extrabold text-brand-black"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  Talent Assessments
                </h2>
                <p className="text-xs text-brand-grey-text">
                  Track progress and download expert feedback reports for
                  assessment tests taken by your children.
                </p>
              </div>

              {childrenList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-[#E5E7EB] rounded-3xl bg-white">
                  <AlertCircle size={28} className="text-coral mb-4" />
                  <h3
                    className="text-lg font-bold text-brand-black mb-1"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Children profiles required
                  </h3>
                  <p className="text-xs text-brand-grey-text max-w-sm mb-6">
                    Please add a child profile first in the &quot;My
                    Children&quot; tab to access talent assessments.
                  </p>
                  <button
                    onClick={() => handleTabChange("children")}
                    className="px-5 py-2.5 rounded-full text-sm font-bold bg-primary text-brand-black cursor-pointer"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Manage Children
                  </button>
                </div>
              ) : allAssessments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-[#E5E7EB] rounded-4xl bg-white space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mx-auto">
                    🧠
                  </div>
                  <h3
                    className="text-lg font-bold text-brand-black"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    No assessments completed yet
                  </h3>
                  <p className="text-xs text-brand-grey-text max-w-sm">
                    Assess your child&apos;s cognitive, focus, and writing
                    skills to unlock personalized learning paths and reports.
                  </p>
                  <Link
                    href="/assessments"
                    className="inline-block px-6 py-3 rounded-full text-xs font-extrabold bg-primary text-brand-black transition-all hover:scale-105 shadow-xs"
                    style={{
                      fontFamily: "var(--font-nunito)",
                      textDecoration: "none",
                    }}
                  >
                    Start Free Assessment
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {allAssessments.map((a) => {
                    const isReady = a.status === "Report Ready";
                    return (
                      <div
                        key={a.id}
                        className="bg-white rounded-3xl border border-brand-grey p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: a.bg }}
                          >
                            <ClipboardList
                              size={22}
                              style={{ color: a.color }}
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                className="font-extrabold text-base text-brand-black"
                                style={{ fontFamily: "var(--font-nunito)" }}
                              >
                                {a.title}
                              </h3>
                              <span
                                className={`text-3xs font-bold px-2 py-0.5 rounded-full ${
                                  isReady
                                    ? "bg-[#E8F8F7] text-[#1A7A72]"
                                    : "bg-[#FFF9E6] text-primary-dark animate-pulse"
                                }`}
                              >
                                {a.status}
                              </span>
                            </div>

                            <p className="text-xs text-brand-grey-text">
                              Taken by:{" "}
                              <span className="font-bold text-brand-black capitalize">
                                {a.childName}
                              </span>{" "}
                              &middot; Completed: {a.completedDate}
                            </p>

                            <p className="text-xs text-brand-grey-text">
                              Key Strength / Status:{" "}
                              <span
                                className={`font-semibold ${isReady ? "text-[#1A7A72]" : "text-primary-dark"}`}
                              >
                                {a.result}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Action CTA */}
                        <div className="shrink-0 flex items-center">
                          {isReady ? (
                            <button
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:shadow-md cursor-pointer border-none"
                              style={{
                                background: "#F5C518",
                                color: "#1A1A1A",
                                fontFamily: "var(--font-nunito)",
                                boxShadow: "0 4px 12px rgba(245,197,24,0.3)",
                              }}
                            >
                              <Download size={13} />
                              Download Report
                            </button>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF] font-bold">
                              <Clock size={13} />
                              Under Review
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile bottom tab bar — only on small screens */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] flex md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 relative cursor-pointer"
              style={{ color: isActive ? "#F5C518" : "#9CA3AF" }}
            >
              <Icon size={20} />
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                fontFamily: "var(--font-nunito)",
                color: isActive ? "#1A1A1A" : "#9CA3AF"
              }}>
                {tab.label.split(" ")[1]} {/* "My", "Registered", etc — first word only */}
              </span>
              {tab.id === "children" && childrenList.length > 0 && (
                <span className="absolute top-2 right-[32%] px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-[#FFF9E6] text-primary-dark border border-[#F5C518]/30">
                  {childrenList.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Client Dialogs ── */}
      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onSuccess={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
      />

      <ChildFormDialog
        open={addOpen}
        onOpenChange={(o) => {
          setAddOpen(o);
          if (!o) setEditChild(null);
        }}
        editChild={editChild}
        onSuccess={editChild ? handleEdited : handleAdded}
      />

      <DeleteChildDialog
        open={!!deleteChild}
        onOpenChange={(o) => {
          if (!o) setDeleteChild(null);
        }}
        child={deleteChild}
        onSuccess={handleDeleted}
      />
    </div>
  );
}
