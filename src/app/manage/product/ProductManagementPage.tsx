"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock product data
const products = [
  {
    title: "Face Cream",
    description: "Hydrating face cream",
    stock: 120,
    images: [
      "https://images.unsplash.com/photo-1759221778524-69d10f928aed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
      "https://plus.unsplash.com/premium_photo-1759808655898-8cd5d6e11d16?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0",
    ],
  },
  {
    title: "Lipstick",
    description: "Red matte lipstick",
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1759221778524-69d10f928aed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
      "https://plus.unsplash.com/premium_photo-1759808655898-8cd5d6e11d16?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0",
    ],
  },
  {
    title: "Perfume",
    description: "Floral fragrance",
    stock: 10,
    images: [
      "https://images.unsplash.com/photo-1759221778524-69d10f928aed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
      "https://plus.unsplash.com/premium_photo-1759808655898-8cd5d6e11d16?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0",
    ],
  },
  {
    title: "Shampoo",
    description: "Hair cleansing shampoo",
    stock: 0,
    images: [
      "https://images.unsplash.com/photo-1759221778524-69d10f928aed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
      "https://plus.unsplash.com/premium_photo-1759808655898-8cd5d6e11d16?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0",
    ],
  },
];

const ProductManagementPage = () => {
  const router = useRouter();
  const [popupImages, setPopupImages] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


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

      {/* Desktop Table */}
      <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Description", "Stock", "Images"].map((header) => (
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
                products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition duration-100 text-sm sm:text-base">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setPopupImages(product.images)}
                        className="text-[#7e57c2] hover:text-[#5d40a2] font-medium text-sm"
                      >
                        View Images
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500 text-sm">
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
          products.map((product, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-800">Title:</span>
                <span className="text-gray-700">{product.title}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-800">Description:</span>
                <span className="text-gray-700">{product.description}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-800">Stock:</span>
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setPopupImages(product.images)}
                  className="text-[#7e57c2] hover:text-[#5d40a2] font-medium text-sm"
                >
                  View Images
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">No products found.</div>
        )}
      </div>

      {/* Image Popup */}
{popupImages && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="relative max-w-lg w-full">
      {/* Close Button: outside the rounded container so it's fully visible */}
      <button
        className="absolute -top-6 -right-2 bg-white rounded-full p-2 shadow-lg z-50 hover:bg-gray-100 transition"
        onClick={() => setPopupImages(null)}
      >
        <X className="w-5 h-5 text-black" />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden bg-transparent flex items-center justify-center">
        <Image
          src={popupImages[currentImageIndex]}
          alt={`Product Image ${currentImageIndex + 1}`}
          fill
          className="object-contain"
        />

        {/* Left Arrow */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
