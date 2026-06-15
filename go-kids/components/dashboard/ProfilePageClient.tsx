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
  ArrowRight,
  ChevronRight,
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

interface ProfilePageClientProps {
  user: UserProfile;
  children: ChildData[];
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePageClient({ user, children }: ProfilePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [profile, setProfile] = useState(user);
  const [editOpen, setEditOpen] = useState(false);

  // Child management state
  const [childrenList, setChildrenList] = useState<ChildData[]>(children);
  const [addOpen, setAddOpen] = useState(false);
  const [editChild, setEditChild] = useState<ChildData | null>(null);
  const [deleteChild, setDeleteChild] = useState<ChildData | null>(null);

  // Sync tab selection from search parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["profile", "children", "workshops", "assessments"].includes(tab)) {
      setActiveTab(tab);
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
  const primaryChildName = childrenList[0]?.name || "your child";

  // Dynamic Personalized Mock Data
  const mockWorkshops = [
    {
      id: "w1",
      title: "Coding & AI for Young Minds",
      childName: primaryChildName,
      date: "June 28, 2026",
      time: "10:00 AM - 12:00 PM",
      status: "Upcoming",
      instructor: "Dr. Pallavi Modi",
      category: "Technology & Logic",
      color: "#2BBCB0",
      bg: "#F0FAFA",
    },
    {
      id: "w2",
      title: "Public Speaking & Young Leaders",
      childName: primaryChildName,
      date: "May 10, 2026",
      time: "4:00 PM - 5:30 PM",
      status: "Completed",
      instructor: "Rohit Sharma",
      category: "Communication & Confidence",
      color: "#F4845F",
      bg: "#FEF0EB",
    },
  ];

  const mockAssessments = [
    {
      id: "a1",
      title: "Cognitive Strengths Assessment",
      childName: primaryChildName,
      completedDate: "June 02, 2026",
      status: "Report Ready",
      result: "Highly Analytical, Logic-Driven & Spatial thinker",
      color: "#2BBCB0",
      bg: "#F0FAFA",
    },
    {
      id: "a2",
      title: "Future Skills & Tech Aptitude",
      childName: primaryChildName,
      completedDate: "June 14, 2026",
      status: "In Progress",
      result: "Formulating insights and personalized recommendations...",
      color: "#F5C518",
      bg: "#FFF9E6",
    },
  ];

  // Handlers for child CRUD
  const handleAdded = (newChild: ChildData) => {
    setChildrenList((prev) => [newChild, ...prev]);
  };

  const handleEdited = (updated: ChildData) => {
    setChildrenList((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
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
            className="text-3xl font-extrabold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            Parent Hub
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage your account, view children profiles, and track workshops & talent assessments.
          </p>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto scrollbar-none gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap outline-none cursor-pointer"
              style={{
                borderColor: isActive ? "#F5C518" : "transparent",
                color: isActive ? "#1A1A1A" : "#6B7280",
                fontFamily: "var(--font-nunito)",
              }}
            >
              <Icon size={16} style={{ color: isActive ? "#F5C518" : "#9CA3AF" }} />
              {tab.label}
              {tab.id === "children" && childrenList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-2xs bg-[#FFF9E6] text-[#D4A900]">
                  {childrenList.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className="mt-4">
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
                className="relative bg-white rounded-3xl overflow-hidden border border-[#F3F4F6]"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                {/* Yellow banner strip */}
                <div
                  className="h-32 w-full relative"
                  style={{
                    background: "linear-gradient(135deg, #F5C518 0%, #FFE566 50%, #F5C518 100%)",
                  }}
                >
                  <div className="absolute top-4 right-8 w-24 h-24 rounded-full opacity-15" style={{ background: "#1A1A1A" }} />
                  <div className="absolute -bottom-6 left-28 w-16 h-16 rounded-full opacity-10" style={{ background: "#1A1A1A" }} />
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
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all hover:bg-[#FFF9E6] hover:border-[#F5C518]"
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
                    style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
                  >
                    {profile.name}
                  </h2>
                  <p className="text-sm mb-6 text-[#6B7280]">Parent &middot; Go Kids India Member</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#F3F4F6]">
                    <div className="space-y-1">
                      <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">Email Address</p>
                      <span className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
                        <Mail size={15} style={{ color: "#2BBCB0" }} />
                        {profile.email}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">Mobile Number</p>
                      <span className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
                        <Phone size={15} style={{ color: "#F4845F" }} />
                        {profile.phone ? `+91 ${profile.phone}` : "Not provided"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider">Member Since</p>
                      <span className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-nunito)" }}>
                    My Children ({childrenList.length})
                  </h2>
                  <p className="text-xs text-[#6B7280]">Add, update, or remove child profiles to receive tailored insights.</p>
                </div>
                <button
                  onClick={() => { setEditChild(null); setAddOpen(true); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-md active:scale-95 cursor-pointer"
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
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "var(--font-nunito)" }}>No children registered yet</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mb-6">Create profiles for your children to unlock talent assessments and workshop registrations.</p>
                  <button
                    onClick={() => { setEditChild(null); setAddOpen(true); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold cursor-pointer"
                    style={{ background: "#F5C518", color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
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
                      onEdit={(c) => { setEditChild(c); setAddOpen(true); }}
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
                <h2 className="text-xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-nunito)" }}>
                  Registered Workshops
                </h2>
                <p className="text-xs text-[#6B7280]">View schedule details and access credentials for your children&apos;s upcoming and past workshops.</p>
              </div>

              {childrenList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-[#E5E7EB] rounded-3xl bg-white">
                  <AlertCircle size={28} className="text-[#F4845F] mb-4" />
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "var(--font-nunito)" }}>Children profiles required</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mb-6">Please add a child profile first in the &quot;My Children&quot; tab to register them for workshops.</p>
                  <button
                    onClick={() => handleTabChange("children")}
                    className="px-5 py-2.5 rounded-full text-sm font-bold bg-[#F5C518] text-[#1A1A1A] cursor-pointer"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Manage Children
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockWorkshops.map((w) => {
                    const isUpcoming = w.status === "Upcoming";
                    return (
                      <div
                        key={w.id}
                        className="bg-white rounded-3xl border border-[#F3F4F6] overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
                        style={{ borderLeft: `5px solid ${w.color}` }}
                      >
                        <div className="p-6 space-y-4">
                          {/* Top row */}
                          <div className="flex items-center justify-between">
                            <span className="text-2xs font-bold px-2 py-0.5 rounded-full" style={{ background: w.bg, color: w.color }}>
                              {w.category}
                            </span>
                            <span
                              className={`text-2xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                isUpcoming ? "bg-[#E8F8F7] text-[#1A7A72]" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {isUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-[#2BBCB0] animate-pulse" />}
                              {w.status}
                            </span>
                          </div>

                          {/* Title */}
                          <div>
                            <h3 className="text-lg font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-nunito)" }}>
                              {w.title}
                            </h3>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              Registered Child: <span className="font-bold text-[#1A1A1A] capitalize">{w.childName}</span>
                            </p>
                          </div>

                          {/* Schedule info */}
                          <div className="grid grid-cols-2 gap-3 bg-[#FAFAF8] p-3 rounded-2xl text-xs">
                            <div>
                              <p className="text-2xs text-[#9CA3AF] uppercase font-bold">Date</p>
                              <p className="font-bold text-[#1A1A1A] mt-0.5">{w.date}</p>
                            </div>
                            <div>
                              <p className="text-2xs text-[#9CA3AF] uppercase font-bold">Time</p>
                              <p className="font-bold text-[#1A1A1A] mt-0.5">{w.time}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#F3F4F6] flex items-center justify-between text-xs">
                          <p className="text-[#6B7280]">
                            Instructor: <span className="font-bold text-[#1A1A1A]">{w.instructor}</span>
                          </p>
                          {isUpcoming ? (
                            <button className="flex items-center gap-1 font-bold text-[#2BBCB0] hover:underline cursor-pointer">
                              Join Meeting <ChevronRight size={14} />
                            </button>
                          ) : (
                            <span className="text-[#9CA3AF] font-bold">Ended</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                <h2 className="text-xl font-extrabold text-[#1A1A1A]" style={{ fontFamily: "var(--font-nunito)" }}>
                  Talent Assessments
                </h2>
                <p className="text-xs text-[#6B7280]">Track progress and download expert feedback reports for assessment tests taken by your children.</p>
              </div>

              {childrenList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-[#E5E7EB] rounded-3xl bg-white">
                  <AlertCircle size={28} className="text-[#F4845F] mb-4" />
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "var(--font-nunito)" }}>Children profiles required</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mb-6">Please add a child profile first in the &quot;My Children&quot; tab to access talent assessments.</p>
                  <button
                    onClick={() => handleTabChange("children")}
                    className="px-5 py-2.5 rounded-full text-sm font-bold bg-[#F5C518] text-[#1A1A1A] cursor-pointer"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    Manage Children
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mockAssessments.map((a) => {
                    const isReady = a.status === "Report Ready";
                    return (
                      <div
                        key={a.id}
                        className="bg-white rounded-3xl border border-[#F3F4F6] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: a.bg }}
                          >
                            <ClipboardList size={22} style={{ color: a.color }} />
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-extrabold text-base text-[#1A1A1A]" style={{ fontFamily: "var(--font-nunito)" }}>
                                {a.title}
                              </h3>
                              <span
                                className={`text-3xs font-bold px-2 py-0.5 rounded-full ${
                                  isReady ? "bg-[#E8F8F7] text-[#1A7A72]" : "bg-[#FFF9E6] text-[#D4A900] animate-pulse"
                                }`}
                              >
                                {a.status}
                              </span>
                            </div>

                            <p className="text-xs text-[#6B7280]">
                              Taken by: <span className="font-bold text-[#1A1A1A] capitalize">{a.childName}</span> &middot; Completed: {a.completedDate}
                            </p>

                            <p className="text-xs text-[#6B7280]">
                              Key Strength / Status:{" "}
                              <span className={`font-semibold ${isReady ? "text-[#1A7A72]" : "text-[#D4A900]"}`}>
                                {a.result}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Action CTA */}
                        <div className="shrink-0 flex items-center">
                          {isReady ? (
                            <button
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:shadow-md cursor-pointer"
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

      {/* ── Client Dialogs ── */}
      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onSuccess={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
      />

      <ChildFormDialog
        open={addOpen}
        onOpenChange={(o) => { setAddOpen(o); if (!o) setEditChild(null); }}
        editChild={editChild}
        onSuccess={editChild ? handleEdited : handleAdded}
      />

      <DeleteChildDialog
        open={!!deleteChild}
        onOpenChange={(o) => { if (!o) setDeleteChild(null); }}
        child={deleteChild}
        onSuccess={handleDeleted}
      />
    </div>
  );
}
