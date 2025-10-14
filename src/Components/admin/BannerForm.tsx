"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import Image from "next/image";

interface PreviewImage {
  id: string;
  url: string;
  file?: File;
  serverId?: string;
}

interface BannerFormProps {
  id?: string;
  mode?: "create" | "update";
  banner?: any;
}

const BannerForm = ({ id, mode = "create", banner }: BannerFormProps) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState<PreviewImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const router = useRouter();
  const isUpdateMode = mode === "update" && !!id;

  const showMessage = (text: string, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 5000);
  };

  // Populate fields for update
  useEffect(() => {
    if (!isUpdateMode || !banner) return;

    setTitle(banner.title || "");
    setSubtitle(banner.subtitle || "");

    if (banner.image) {
      setImage({
        id: crypto.randomUUID(),
        url: banner.image,
        serverId: banner.image,
      });
    }
  }, [id, isUpdateMode, banner]);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (image?.file) URL.revokeObjectURL(image.url);
    };
  }, [image]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    
    // Clean up old image URL if exists
    if (image?.file) {
      URL.revokeObjectURL(image.url);
    }

    setImage({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    });
  };

  const handleRemoveImage = () => {
    if (image?.file) URL.revokeObjectURL(image.url);
    setImage(null);
  };

  // Upload image to Cloudinary only (without DB update)
  const uploadImageToCloudinary = async (): Promise<string> => {
    if (!image?.file) return "";

    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("upload_preset", "ml_default"); // You may need to create this in Cloudinary
    formData.append("folder", "RoopShree/BannerImages");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  // Upload via your API (with bannerId for DB update)
  const uploadImageViaAPI = async (bannerId: string): Promise<string> => {
    if (!image?.file) return "";

    const formData = new FormData();
    formData.append("files", image.file);
    formData.append("type", "banner");
    formData.append("bannerId", bannerId);

    const res = await fetch("/api/upload-images", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Image upload failed");
    }
    
    return data.urls?.[0] || data.url || "";
  };

  // CREATE banner
  const handleCreate = async () => {
    if (!title || !subtitle || !image) {
      showMessage("Please fill in all required fields (title, subtitle, and image)", true);
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create banner with placeholder image
      const payload = {
        title,
        subtitle,
        image: "placeholder", // Temporary placeholder
      };

      console.log("Creating banner with placeholder...");

      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        showMessage(data.error || "Banner creation failed", true);
        setLoading(false);
        return;
      }

      const bannerId = data.id || data.banner?.id;
      
      if (!bannerId) {
        showMessage("Banner created but ID missing", true);
        setLoading(false);
        return;
      }

      // Step 2: Upload image with the bannerId (this will update the DB)
      if (image?.file) {
        try {
          console.log("Uploading image for banner:", bannerId);
          await uploadImageViaAPI(bannerId);
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          showMessage("Banner created but image upload failed. Please edit and re-upload.", true);
          setTimeout(() => router.push("/manage/banner"), 2000);
          setLoading(false);
          return;
        }
      }

      showMessage("Banner created successfully!");
      setTimeout(() => router.push("/manage/banner"), 1000);
    } catch (err) {
      console.error("Create error:", err);
      showMessage("Something went wrong. Please try again.", true);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE banner
  const handleUpdate = async () => {
    if (!title || !id) {
      showMessage("Please fill in the title field", true);
      return;
    }

    setLoading(true);
    try {
      // Prepare payload
      const payload: any = {
        title,
        subtitle: subtitle || "",
      };

      // Include existing image URL if no new file selected
      if (image?.serverId && !image?.file) {
        payload.image = image.serverId;
      } else if (!image) {
        payload.image = ""; // Clear image if removed
      }

      const res = await fetch(`/api/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showMessage(data.error || "Update failed", true);
        setLoading(false);
        return;
      }

      const bannerId = data.id || data.banner?.id || id;

      // Upload new image if selected
      if (image?.file) {
        try {
          await uploadImageViaAPI(bannerId);
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          showMessage("Banner updated but image upload failed. Please try again.", true);
          setTimeout(() => router.push("/manage/banner"), 2000);
          setLoading(false);
          return;
        }
      }

      showMessage("Banner updated successfully!");
      setTimeout(() => router.push("/manage/banner"), 1000);
    } catch (err) {
      console.error("Update error:", err);
      showMessage("Unexpected error occurred", true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isUpdateMode) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-8">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {isUpdateMode ? `Update Banner: ${title}` : "Create Banner"}
        </h2>

        {message && (
          <div
            className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
              message.isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter banner title"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base outline-none border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
            disabled={loading}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
            Subtitle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter banner subtitle"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base outline-none border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
            disabled={loading}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            {image && (
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
                  <Image src={image.url} alt="Preview" fill style={{ objectFit: "cover" }} />
                </div>
                <button
                  type="button"
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
                  onClick={handleRemoveImage}
                  disabled={loading}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {!image && (
              <label
                className={`w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition ${
                  loading ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-300 hover:border-[#fcd34d]"
                }`}
              >
                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-gray-400 text-sm">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-2 sm:pt-4">
          <button
            type="button"
            onClick={() => router.push("/manage/banner")}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : isUpdateMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;