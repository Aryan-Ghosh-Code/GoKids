"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, User, Calendar, GraduationCap, School, ImageIcon, FileText } from "lucide-react";
import type { ChildData } from "./ChildCard";
import CloudinaryUpload from "./CloudinaryUpload";

function getInitials(name: string) {
  if (!name || !name.trim()) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const GRADES = [
  "Pre-KG", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
];

const ALL_INTERESTS = [
  "Art & Craft", "Music", "Dance", "Sports", "Coding", "Reading",
  "Mathematics", "Science", "Cooking", "Chess", "Robotics", "Theatre",
  "Photography", "Swimming", "Gardening", "Writing",
];

const INTEREST_COLORS = [
  { bg: "#F0FAFA", color: "#2BBCB0" },
  { bg: "#FEF0EB", color: "#F4845F" },
  { bg: "#EDF7FF", color: "#4FC3F7" },
  { bg: "#FFF9E6", color: "#D4A900" },
];

const childSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  dob: z.string().optional(),
  grade: z.string().optional(),
  school: z.string().max(200).optional(),
  interests: z.array(z.string()).optional(),
  behaviorNotes: z.string().max(2000).optional(),
  photoUrl: z.string().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _SchemaType = z.infer<typeof childSchema>;

// We use this manual type so interests is always string[] (we provide defaultValues)
type ChildFormData = {
  name: string;
  dob: string;
  grade: string;
  school: string;
  interests: string[];
  behaviorNotes: string;
  photoUrl: string;
};

interface ChildFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (child: ChildData) => void;
  /** Pass a child object to edit; leave undefined to create */
  editChild?: ChildData | null;
}

function InputWrapper({ label, icon: Icon, error, children }: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}>
        <span className="flex items-center gap-1.5">
          <Icon size={14} style={{ color: "#9CA3AF" }} />
          {label}
        </span>
      </label>
      {children}
      {error && <p className="text-xs mt-1 font-medium" style={{ color: "#C0392B" }}>{error}</p>}
    </div>
  );
}

export default function ChildFormDialog({ open, onOpenChange, onSuccess, editChild }: ChildFormDialogProps) {
  const isEdit = !!editChild;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, reset, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema) as any,
    defaultValues: { name: "", dob: "", grade: "", school: "", interests: [], behaviorNotes: "", photoUrl: "" },
  });

  const selectedInterests = watch("interests") || [];

  // Populate form when editing
  useEffect(() => {
    if (editChild) {
      reset({
        name: editChild.name,
        dob: editChild.dob ? editChild.dob.split("T")[0] : "",
        grade: editChild.grade || "",
        school: editChild.school || "",
        interests: editChild.interests || [],
        behaviorNotes: editChild.behaviorNotes || "",
        photoUrl: editChild.photoUrl || "",
      });
    } else {
      reset({ name: "", dob: "", grade: "", school: "", interests: [], behaviorNotes: "", photoUrl: "" });
    }
  }, [editChild, reset, open]);

  const toggleInterest = (interest: string) => {
    const current = selectedInterests;
    if (current.includes(interest)) {
      setValue("interests", current.filter((i) => i !== interest));
    } else {
      setValue("interests", [...current, interest]);
    }
  };

  const onSubmit = async (data: ChildFormData) => {
    const url = isEdit ? `/api/children/${editChild!._id}` : "/api/children";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        dob: data.dob || undefined,
        grade: data.grade || undefined,
        school: data.school || undefined,
        interests: data.interests || [],
        behaviorNotes: data.behaviorNotes || undefined,
        photoUrl: data.photoUrl || undefined,
      }),
    });

    const result = await res.json();
    if (result.success) {
      onSuccess(result.data);
      onOpenChange(false);
    }
  };

  const inputStyle = (hasError: boolean) => ({
    background: "#FAFAF8",
    border: hasError ? "1.5px solid #F4845F" : "1.5px solid #E5E7EB",
    color: "#1A1A1A",
    fontFamily: "var(--font-nunito)",
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  key="content"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="fixed inset-x-4 top-[5%] z-50 mx-auto max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                  style={{ border: "1px solid #F3F4F6" }}
                >
                  {/* Header */}
                  <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white border-b border-[#F3F4F6] rounded-t-3xl">
                    <div>
                      <Dialog.Title
                        className="text-lg font-extrabold"
                        style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}
                      >
                        {isEdit ? "Edit Child Profile" : "Add a Child"}
                      </Dialog.Title>
                      <Dialog.Description className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                        {isEdit ? "Update the details below." : "Fill in your child's details to get started."}
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-2 rounded-full hover:bg-[#F3F4F6] transition-colors" aria-label="Close">
                        <X size={18} color="#6B7280" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
                    {/* Photo + Name Row */}
                    <div className="flex items-center gap-5 border-b border-[#F3F4F6] pb-4">
                      {/* Left: Smaller circular upload */}
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <span className="text-3xs text-[#9CA3AF] uppercase font-bold tracking-wider">Photo</span>
                        <CloudinaryUpload
                          key={editChild?._id || "new-child"}
                          currentUrl={watch("photoUrl")}
                          onUpload={(url) => setValue("photoUrl", url)}
                          shape="circle"
                          size={72}
                          initials={getInitials(watch("name"))}
                          accentColor="#F5C518"
                        />
                      </div>
                      {/* Right: Full Name */}
                      <div className="flex-grow">
                        <InputWrapper label="Full Name *" icon={User} error={errors.name?.message}>
                          <input
                            {...register("name")}
                            placeholder="e.g. Priya Sharma"
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                            style={inputStyle(!!errors.name)}
                            onFocus={(e) => { if (!errors.name) e.target.style.borderColor = "#F5C518"; }}
                            onBlur={(e) => { if (!errors.name) e.target.style.borderColor = "#E5E7EB"; }}
                          />
                        </InputWrapper>
                      </div>
                    </div>

                    {/* Date of Birth + Grade */}
                    <div className="grid grid-cols-2 gap-4">
                      <InputWrapper label="Date of Birth" icon={Calendar} error={errors.dob?.message}>
                        <input
                          {...register("dob")}
                          type="date"
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={inputStyle(!!errors.dob)}
                          onFocus={(e) => { e.target.style.borderColor = "#F5C518"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; }}
                        />
                      </InputWrapper>

                      <InputWrapper label="Grade / Class" icon={GraduationCap} error={errors.grade?.message}>
                        <select
                          {...register("grade")}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                          style={inputStyle(!!errors.grade)}
                          onFocus={(e) => { e.target.style.borderColor = "#F5C518"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; }}
                        >
                          <option value="">Select grade</option>
                          {GRADES.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </InputWrapper>
                    </div>

                    {/* School */}
                    <InputWrapper label="School Name" icon={School} error={errors.school?.message}>
                      <input
                        {...register("school")}
                        placeholder="e.g. Delhi Public School"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle(!!errors.school)}
                        onFocus={(e) => { if (!errors.school) e.target.style.borderColor = "#F5C518"; }}
                        onBlur={(e) => { if (!errors.school) e.target.style.borderColor = "#E5E7EB"; }}
                      />
                    </InputWrapper>

                    {/* Interests */}
                    <Controller
                      name="interests"
                      control={control}
                      render={() => (
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#1A1A1A", fontFamily: "var(--font-nunito)" }}>
                            Interests
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {ALL_INTERESTS.map((interest, i) => {
                              const c = INTEREST_COLORS[i % INTEREST_COLORS.length];
                              const selected = selectedInterests.includes(interest);
                              return (
                                <button
                                  key={interest}
                                  type="button"
                                  onClick={() => toggleInterest(interest)}
                                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                                  style={{
                                    background: selected ? c.color : c.bg,
                                    color: selected ? "#FFFFFF" : c.color,
                                    border: `1.5px solid ${selected ? c.color : "transparent"}`,
                                    fontFamily: "var(--font-nunito)",
                                  }}
                                >
                                  {interest}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    />



                    {/* Behaviour Notes */}
                    <InputWrapper label="Behaviour & Learning Notes" icon={FileText} error={errors.behaviorNotes?.message}>
                      <textarea
                        {...register("behaviorNotes")}
                        rows={3}
                        placeholder="Any notes about your child's learning style, challenges, or strengths…"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                        style={inputStyle(!!errors.behaviorNotes)}
                        onFocus={(e) => { if (!errors.behaviorNotes) e.target.style.borderColor = "#F5C518"; }}
                        onBlur={(e) => { if (!errors.behaviorNotes) e.target.style.borderColor = "#E5E7EB"; }}
                      />
                    </InputWrapper>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="flex-1 py-3 rounded-xl text-sm font-bold border transition-colors"
                          style={{ borderColor: "#E5E7EB", color: "#6B7280", fontFamily: "var(--font-nunito)" }}
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        style={{
                          background: "#F5C518",
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                          boxShadow: "0 4px 14px rgba(245,197,24,0.35)",
                        }}
                      >
                        {isSubmitting ? (
                          <><Loader2 size={15} className="animate-spin" /> Saving…</>
                        ) : (
                          isEdit ? "Save Changes" : "Add Child"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
