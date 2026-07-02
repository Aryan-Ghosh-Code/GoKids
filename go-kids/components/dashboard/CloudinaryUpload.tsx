"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";

interface CloudinaryUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  /** Optional: show as circular avatar (profile photo) or square (child photo) */
  shape?: "circle" | "square";
  size?: number;
  initials?: string;
  accentColor?: string;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local file.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "gokids/profiles");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url as string;
}

export default function CloudinaryUpload({
  currentUrl,
  onUpload,
  shape = "circle",
  size = 96,
  initials = "?",
  accentColor = "#F5C518",
}: CloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    // Validate
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setError("");
    setUploading(true);

    try {
      const cloudUrl = await uploadToCloudinary(file);
      setPreview(cloudUrl);
      onUpload(cloudUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
      setPreview(currentUrl || "");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const radius = shape === "circle" ? "9999px" : "16px";

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar / Preview */}
      <div
        className="relative cursor-pointer group"
        style={{ width: size, height: size }}
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload photo"
      >
        {preview ? (
          <div
            className="w-full h-full overflow-hidden border-2 border-brand-grey"
            style={{ borderRadius: radius }}
          >
            <Image
              src={preview}
              alt="Profile photo"
              fill
              className="object-cover"
              sizes={`${size}px`}
            />
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-xl font-extrabold"
            style={{
              borderRadius: radius,
              background: `${accentColor}22`,
              color: accentColor,
              fontFamily: "var(--font-nunito)",
              border: `2px solid ${accentColor}44`,
            }}
          >
            {initials}
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            borderRadius: radius,
            background: "rgba(0,0,0,0.45)",
          }}
        >
          {uploading ? (
            <Loader2 size={20} color="white" className="animate-spin" />
          ) : (
            <Camera size={20} color="white" />
          )}
        </div>

        {/* Remove button */}
        {preview && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreview("");
              onUpload("");
            }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
            style={{ background: "#F4845F" }}
            aria-label="Remove photo"
          >
            <X size={10} color="white" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        disabled={uploading}
        className="text-xs font-bold px-3 py-1 rounded-full transition-all disabled:opacity-50"
        style={{
          background: `${accentColor}22`,
          color: accentColor,
          fontFamily: "var(--font-nunito)",
        }}
      >
        {uploading ? "Uploading…" : preview ? "Change photo" : "Upload photo"}
      </button>

      {error && (
        <p
          className="text-xs text-center max-w-40"
          style={{ color: "#F4845F" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
