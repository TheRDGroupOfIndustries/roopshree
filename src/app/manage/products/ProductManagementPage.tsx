"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

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
}

const ProductManagementPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupImages, setPopupImages] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        console.log("Fetched product data:", data);

        let fetchedProducts: Product[] = [];
        if (Array.isArray(data)) {
          fetchedProducts = data;
        } else if (Array.isArray(data.products)) {
          fetchedProducts = data.products;
        } else {
          console.error("Unexpected API response:", data);
          fetchedProducts = [];
        }

        // ✅ Reverse to show newest first
        setProducts(fetchedProducts.reverse());
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper to calculate total stock
  const getTotalStock = (stock: Stock[] | Stock | undefined) => {
    if (!stock) return 0;
    const stockArray = Array.isArray(stock) ? stock : [stock];
    return stockArray.reduce((acc, s) => acc + (s.currentStock || 0), 0);
  };

  // Handle delete product
  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setDeletingId(productId);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }

      // Remove from UI
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => router.push("/manage/product")}
          className="flex items-center gap-2 px-4 py-2 bg-[#7e57c2] text-white rounded-lg font-medium hover:bg-[#5d40a2] transition duration-150"
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
                    {["Title", "Description", "Stock", "Images", "Actions"].map((header) => (
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
                          <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                            {product.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                totalStock > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
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
                              className="text-[#7e57c2] hover:text-[#5d40a2] font-medium text-sm"
                            >
                              View Images
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => router.push(`/manage/product/${product.id}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit Product"
                                disabled={isDeleting}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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
                      <td colSpan={5} className="text-center py-8 text-gray-500 text-sm">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.length > 0 ? (
              products.map((product) => {
                const totalStock = getTotalStock(product.stock);
                const isDeleting = deletingId === product.id;
                return (
                  <div
                    key={product.id}
                    className="bg-white p-4 rounded-xl shadow border border-gray-100"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Title:</span>
                      <span className="text-gray-700">{product.title}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Description:</span>
                      <span className="text-gray-700 truncate max-w-[200px]">
                        {product.description}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Stock:</span>
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          totalStock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {totalStock}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <button
                        onClick={() => {
                          setPopupImages(product.images);
                          setCurrentImageIndex(0);
                        }}
                        className="text-[#7e57c2] hover:text-[#5d40a2] font-medium text-sm"
                      >
                        View Images
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/manage/product/${product.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Product"
                          disabled={isDeleting}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Delete Product"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">No products found.</div>
            )}
          </div>
        </>
      )}

      {/* Image Popup */}
      {popupImages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {currentImageIndex < popupImages.length - 1 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;