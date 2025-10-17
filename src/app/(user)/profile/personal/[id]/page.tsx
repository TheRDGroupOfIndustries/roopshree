"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { User, Camera, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthProvider";
import { getUserById, updateUser } from "@/services/userService";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService"; // ✅ Import these

const PersonalInfoPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = typeof params?.id === "string" ? params.id : "";

  // Form & image states
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setFetching(true);
        const res = await getUserById(userId);
        if (res?.users) {
          setFormData({ name: res.users.name || "", email: res.users.email || "" });
          setPreviewUrl(res.users.profileImage || null);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user data");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && profileImage) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, profileImage]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return toast.error("Name and email required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email");

    setSubmitting(true);
    let uploadedImageUrl = previewUrl;

    if (profileImage) {
      const formDataForImage = new FormData();
      formDataForImage.append("files", profileImage);
      formDataForImage.append("type", "profile");

      try {
        const res = await fetch("/api/upload-images", {
          method: "POST",
          body: formDataForImage,
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.urls?.[0]) throw new Error("Image upload failed");
        uploadedImageUrl = data.urls[0];
      } catch (err) {
        toast.error("Image upload failed");
        setSubmitting(false);
        return;
      }
    }

    try {
  await updateUser(userId, {
    name: formData.name,
    email: formData.email,
    profileImage: uploadedImageUrl || undefined, // ✅ convert null to undefined
  });
  toast.success("Profile updated successfully!");
  await refreshUser();
} catch (err) {
  console.error(err);
  toast.error("Failed to update profile");
} finally {
      setSubmitting(false);
    }
  };

  if (fetching) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 flex justify-between items-center px-4 sm:px-6 py-2 shadow-md z-20 border-b border-gray-200">
        <button
          className="hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center">Profile</h2>
      </header>

      <div className="p-4">
        <div className="w-full max-w-lg shadow-lg rounded-2xl p-6 mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold">Personal Information</h1>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="relative w-28 h-28">
              <Image
                src={previewUrl || "/images/dummy_profile.png"}
                fill
                style={{ objectFit: "cover" }}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-gray-200"
              />
              <label htmlFor="upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow">
                <Camera className="w-5 h-5" />
                <input type="file" id="upload" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <p className="text-sm mt-2">Tap camera to change photo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mb-12">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Priya Sharma"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="priya.sharma@email.com"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 rounded-lg transition-all text-white ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700"}`}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
