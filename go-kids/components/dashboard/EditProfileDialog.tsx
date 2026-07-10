"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, User, Phone } from "lucide-react";
import CloudinaryUpload from "./CloudinaryUpload";

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ProfileData;
  onSuccess: (updated: ProfileData) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSuccess,
}: EditProfileDialogProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone || "");
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          photoUrl,
        }),
      });
      const result = await res.json();
      if (result.success) {
        onSuccess({
          name: name.trim(),
          email: profile.email,
          phone: phone.trim(),
          photoUrl,
        });
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to save. Try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  key="ep-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  key="ep-content"
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden"
                  style={{ border: "1px solid #F3F4F6" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-brand-grey">
                    <div>
                      <Dialog.Title
                        className="text-lg font-extrabold"
                        style={{
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        Edit Profile
                      </Dialog.Title>
                      <Dialog.Description
                        className="text-xs mt-0.5"
                        style={{ color: "#9CA3AF" }}
                      >
                        Update your name, photo and contact info
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className="p-2 rounded-full hover:bg-brand-grey transition-colors"
                        aria-label="Close"
                      >
                        <X size={18} color="#6B7280" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="px-6 py-6 space-y-5">
                    {/* Photo Upload */}
                    <div className="flex justify-center">
                      <CloudinaryUpload
                        currentUrl={photoUrl}
                        onUpload={setPhotoUrl}
                        shape="circle"
                        size={88}
                        initials={getInitials(name || profile.name)}
                        accentColor="#F5C518"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label
                        className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"
                        style={{
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        <User size={13} style={{ color: "#9CA3AF" }} /> Full
                        Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "#FAFAF8",
                          border: "1.5px solid #E5E7EB",
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#F5C518";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB";
                        }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"
                        style={{
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                        }}
                      >
                        <Phone size={13} style={{ color: "#9CA3AF" }} /> Mobile
                        Number
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit Indian mobile number"
                        maxLength={10}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: "#FAFAF8",
                          border: "1.5px solid #E5E7EB",
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#F5C518";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB";
                        }}
                      />
                    </div>

                    {error && (
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#C0392B" }}
                      >
                        {error}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                      <Dialog.Close asChild>
                        <button
                          className="flex-1 py-3 rounded-xl text-sm font-bold border transition-colors"
                          style={{
                            borderColor: "#E5E7EB",
                            color: "#6B7280",
                            fontFamily: "var(--font-nunito)",
                          }}
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        style={{
                          background: "#F5C518",
                          color: "#1A1A1A",
                          fontFamily: "var(--font-nunito)",
                          boxShadow: "0 4px 14px rgba(245,197,24,0.35)",
                        }}
                      >
                        {saving ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />{" "}
                            Saving…
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
