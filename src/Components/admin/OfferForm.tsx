"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OfferFormProps {
  id?: string;
  mode?: "create" | "update";
  offer?: {
    id: string;
    title: string;
    subtitle?: string;
    date: string;
  };
}

const OfferForm = ({ id, mode = "create", offer }: OfferFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const isUpdateMode = mode === "update" && !!id;

  // Populate fields for update mode
  useEffect(() => {
    if (!isUpdateMode || !offer) return;
    setTitle(offer.title || "");
    setSubtitle(offer.subtitle || "");
    setDate(offer.date ? offer.date.slice(0, 10) : "");
  }, [isUpdateMode, offer]);

  const showMessage = (text: string, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = async () => {
    if (!title || !date) {
      showMessage("Title and Date are required", true);
      return;
    }

    setLoading(true);
    try {
      const payload = { title, subtitle, date };

      const res = await fetch(isUpdateMode ? `/api/offer/${id}` : "/api/offer", {
        method: isUpdateMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showMessage(data.error || "Something went wrong", true);
        return;
      }

      showMessage(isUpdateMode ? "Offer updated successfully!" : "Offer created successfully!");
      setTimeout(() => router.push("/manage/sale"), 1000);
    } catch (error) {
      console.error("Offer error:", error);
      showMessage("Unexpected error. Try again.", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isUpdateMode ? "Update Offer" : "Create Offer"}
        </h2>

        {message && (
          <div
            className={`p-3 rounded-lg ${
              message.isError
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter offer title"
            className="w-full p-3 outline-none border rounded-lg focus:ring-2 focus:ring-amber-400"
            disabled={loading}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Subtitle
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter offer subtitle (optional)"
            className="w-full p-3 outline-none border rounded-lg focus:ring-2 focus:ring-amber-400"
            disabled={loading}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 outline-none border rounded-lg focus:ring-2 focus:ring-amber-400"
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={() => router.push("/manage/sale")}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isUpdateMode
              ? "Update Offer"
              : "Create Offer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferForm;
