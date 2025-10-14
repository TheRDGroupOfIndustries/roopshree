"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Edit, Trash2, Search } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/Components/ConfirmDialog";

interface BannerType {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
}

const Banner = () => {
  const router = useRouter();
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Fetch banners with better error handling and logging
  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        console.log("Fetching banners from /api/banners...");
        const res = await fetch("/api/banners", { credentials: "include" });
        
        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Raw API response:", data);
        console.log("Is array?", Array.isArray(data));
        console.log("Data length:", data?.length);
        
        // Handle different response structures
        let bannersData = data;
        
        // Check if data is wrapped in a property (common API patterns)
        if (data.banners) {
          bannersData = data.banners;
        } else if (data.data) {
          bannersData = data.data;
        } else if (data.results) {
          bannersData = data.results;
        }
        
        if (Array.isArray(bannersData)) {
          console.log("Setting banners:", bannersData.length, "items");
          setBanners(bannersData.reverse());
        } else {
          console.error("Data is not an array:", bannersData);
          toast.error("Invalid data format received");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(`Failed to fetch banners: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Filter banners - handle missing category
  const filteredBanners = banners.filter((b) => {
    if (!searchTerm) return true; // Show all if no search term
    return (b.category || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  const uniqueCategories = [
    ...new Set(banners.map((b) => b.category).filter(Boolean)),
  ];

  // Delete handlers
  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setDeletingId(id);
    setIsDialogOpen(false);
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Banner deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setPendingDeleteId(null);
  };

  // Add debug info to UI
  console.log("Current state:", {
    loading,
    bannersCount: banners.length,
    filteredCount: filteredBanners.length,
    searchTerm
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">
          Banner Management <span className="text-gray-500 text-base sm:text-xl">({banners.length})</span>
        </h2>
        <button
          onClick={() => router.push("/manage/banner/create")}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition w-full sm:w-auto text-sm sm:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> 
          <span className="hidden sm:inline">Create Banner</span>
          <span className="sm:hidden">Create Banner</span>
        </button>
      </div>
      {/* Search */}
      <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2">
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-3 flex-1 bg-transparent outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category filters */}
      {uniqueCategories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSearchTerm("")}
            className={`px-3 py-1 rounded-full ${
              !searchTerm
                ? "bg-amber-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            All
          </button>
          {uniqueCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSearchTerm(cat)}
              className={`px-3 py-1 rounded-full ${
                searchTerm === cat
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-amber-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Banner list */}
      {loading ? (
        <p className="text-center py-8">Loading banners...</p>
      ) : filteredBanners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">
            {banners.length === 0
              ? "No banners found. Create your first banner!"
              : "No banners match your search."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-amber-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBanners.map((banner) => {
            const isDeleting = deletingId === banner.id;
            return (
              <div
                key={banner.id}
                className="bg-white p-4 rounded-xl shadow border flex flex-col"
              >
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={banner.image || "/placeholder.jpg"}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      console.error("Image load error:", banner.image);
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </div>
                <h3 className="font-semibold text-gray-800 truncate">
                  {banner.title || "Untitled"}
                </h3>
                <p className="text-gray-600 text-sm truncate">
                  {banner.description || "No description"}
                </p>
                {banner.category && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs mb-3 inline-block w-fit">
                    {banner.category}
                  </span>
                )}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => router.push(`/manage/banner/${banner.id}`)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                    disabled={isDeleting}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Banner?"
        message="Are you sure you want to delete this banner? This action cannot be undone."
      />
    </div>
  );
};

export default Banner;