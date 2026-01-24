"use client";

import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  rating: number;
  stock: number; // ✅ stock included
}

export default function SpotlightPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products"); // GET all products
        const data = await res.json();
        setProducts(
          data.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            image: p.images?.[0] || "", // first image
            rating: p.reviews?.length
              ? p.reviews.reduce((a: any, r: any) => a + r.rating, 0) /
                p.reviews.length
              : 0,
            stock: p.stock || 0,
          }))
        );
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-24">
      {/* Page Title */}
      <h1 className="text-xl font-semibold mb-4 text-black">
        🌟 Spotlight Products
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden relative"
          >
            {/* Wishlist Icon */}
            <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-sm">
              🤍
            </button>

            {/* Image */}
            <div className="bg-gray-50 flex items-center justify-center h-44">
              <img
                src={p.image}
                alt={p.title}
                className="h-40 object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h3 className="text-sm font-medium text-black line-clamp-2">
                {p.title}
              </h3>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {p.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2 text-xs">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-gray-500">({p.rating.toFixed(1)})</span>
              </div>

              {/* Stock / Grab from our store */}
              {p.stock === 0 ? (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  Out of Stock
                </p>
              ) : (
                <p className="mt-2 text-xs text-amber-600 font-medium">
                  Grab from our store
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
