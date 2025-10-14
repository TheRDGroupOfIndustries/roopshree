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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Offer Management</h2>
        <button
          onClick={() => router.push("/manage/sale/create")}
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition duration-150 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Create Offer
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">Loading offers...</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg border border-gray-100">
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
                          className="hover:bg-gray-50 transition duration-100 text-sm"
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {offers.length > 0 ? (
              offers.map((offer) => {
                const isDeleting = deletingId === offer.id;
                return (
                  <div
                    key={offer.id}
                    className="bg-white p-4 rounded-xl shadow border border-gray-100"
                  >
                    <div className="space-y-3">
                      {/* Title */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Title</p>
                        <p className="font-semibold text-gray-900">{offer.title}</p>
                      </div>

                      {/* Subtitle */}
                      {offer.subtitle && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Subtitle</p>
                          <p className="text-gray-700 text-sm">{offer.subtitle}</p>
                        </div>
                      )}

                      {/* Date & Created At */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</p>
                          <p className="text-gray-700 text-sm">
                            {new Date(offer.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Created</p>
                          <p className="text-gray-700 text-sm">
                            {new Date(offer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => router.push(`/manage/sale/${offer.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                          disabled={isDeleting}
                        >
                          <Edit className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm bg-white rounded-xl border border-gray-100">
                No offers found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Offers;