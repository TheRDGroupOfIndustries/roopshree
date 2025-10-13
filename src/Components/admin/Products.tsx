"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/Components/ConfirmDialog";

interface Stock {
  id: string;
  productId: string;
  currentStock: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  stock: Stock[];
  images: string[];
  price: number;
  oldPrice: number;
  exclusive?: number;
  category: string;
}

export const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupImages, setPopupImages] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ConfirmDialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch("/api/products", { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();
        let fetchedProducts: Product[] = [];

        if (Array.isArray(data)) fetchedProducts = data;
        else if (Array.isArray(data.products)) fetchedProducts = data.products;

        setProducts(fetchedProducts.reverse());
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.error("Request timed out");
          toast.error("Request timed out while fetching products");
        } else {
          console.error("Failed to fetch products:", error);
          toast.error("Failed to fetch products");
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getTotalStock = (stock: Stock[] | Stock | undefined) => {
    if (!stock) return 0;
    const stockArray = Array.isArray(stock) ? stock : [stock];
    return stockArray.reduce((acc, s) => acc + (s.currentStock || 0), 0);
  };

  // Open ConfirmDialog
  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setIsDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setDeletingId(id);
    setIsDialogOpen(false);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => router.push("/manage/products/create")}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 cursor-pointer transition duration-150"
        >
          <Plus className="w-4 h-4" /> Create Product
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">Loading products...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Title", "Description", "Category", "Stock", "Images", "Actions"].map((header) => (
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
                  {products.length > 0 ? (
                    products.map((product) => {
                      const totalStock = getTotalStock(product.stock);
                      const isDeleting = deletingId === product.id;
                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 transition duration-100 text-sm sm:text-base"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {product.title}
                          </td>
                          <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{product.description}</td>
                          <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{product.category || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                totalStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {totalStock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setPopupImages(product.images);
                                setCurrentImageIndex(0);
                              }}
                              className="text-amber-500 hover:text-amber-600 font-medium text-sm cursor-pointer"
                            >
                              View Images
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => router.push(`/manage/products/${product.id}`)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                                title="Edit Product"
                                disabled={isDeleting}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                                title="Delete Product"
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
                      <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Image Popup */}
          {popupImages && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
              <div className="relative max-w-lg w-full">
                <button
                  className="absolute -top-6 -right-2 bg-white rounded-full p-2 shadow-lg z-50 hover:bg-gray-100 transition"
                  onClick={() => setPopupImages(null)}
                >
                  <X className="w-5 h-5 text-black" />
                </button>

                <div className="relative w-full h-96 rounded-xl overflow-hidden bg-transparent flex items-center justify-center">
                  <Image
                    src={popupImages[currentImageIndex]}
                    alt={`Product Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                  {currentImageIndex > 0 && (
                    <button
                      onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
                    >
                      ←
                    </button>
                  )}
                  {currentImageIndex < popupImages.length - 1 && (
                    <button
                      onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Product?"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};
