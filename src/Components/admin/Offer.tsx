"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

interface Offer {
  id: string;
  title: string;
  subtitle?: string | null;
  date: string; // ISO string from backend
  createdAt: string;
  updatedAt: string;
}

const Offers = () => {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/offer", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch offers");

        const data = await res.json();
        if (Array.isArray(data)) {
          setOffers(data.reverse());
        } else {
          console.error("Unexpected API response:", data);
          setOffers([]);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this offer?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/offer/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete offer");
      }

      setOffers((prev) => prev.filter((offer) => offer.id !== id));
      toast.success("Offer deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete offer");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Offer Management</h2>
        <button
          onClick={() => router.push("/manage/sale/create")}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition duration-150"
        >
          <Plus className="w-4 h-4" /> Create Offer
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">Loading offers...</div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Title", "Subtitle", "Date", "Created At", "Actions"].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.length > 0 ? (
                  offers.map((offer) => {
                    const isDeleting = deletingId === offer.id;
                    return (
                      <tr
                        key={offer.id}
                        className="hover:bg-gray-50 transition duration-100 text-sm sm:text-base"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {offer.title}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {offer.subtitle || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(offer.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/manage/sale/${offer.id}`)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="Edit Offer"
                              disabled={isDeleting}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(offer.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                              title="Delete Offer"
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-500 text-sm"
                    >
                      No offers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
