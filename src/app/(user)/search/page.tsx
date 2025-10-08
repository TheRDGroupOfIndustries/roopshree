"use client";

import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ProductCard from "@/Components/ProductCard";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: 1,
      name: "Luxury Foundation",
      description: "Perfect coverage for all skin types",
      price: "₹1,299",
      oldPrice: "₹1,599",
      image: "/images/image.png",
      badge: "New",
      badgeColor: "bg-orange-400",
      rating:4
    },
    {
      id: 2,
      name: "Matte Lipstick",
      description: "Smooth and long-lasting finish",
      price: "₹499",
      oldPrice: "₹699",
      image: "/images/image.png",
      badge: "Best Seller",
      badgeColor: "bg-green-600",
      rating:5
    },
    {
      id: 3,
      name: "Glow Moisturizer",
      description: "Keeps your skin hydrated all day",
      price: "₹799",
      image: "/images/image.png",
      rating:4
    },
  ];

  const popularSearches = [
    "Lipstick",
    "Moisturizer",
    "Foundation",
    "Perfume",
    "Serum",
    "Sunscreen",
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-4 pb-20">
      <div className="sticky top-3 z-20 flex items-center bg-gray-100 rounded-xl mx-4 mb-3 px-3 py-2">
        <AiOutlineSearch size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search cosmetics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none ml-3 text-sm"
        />
      </div>

      {/*  Popular Searches */}
      <div className="px-4 mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Popular Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term, index) => (
            <button
              key={index}
              onClick={() => setSearchTerm(term)}
              className="px-3 py-1.5 bg-gray-100 text-[var(--color-brand)] text-xs font-medium rounded-full"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/*  All Products */}
      <div className="px-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-3">
          {searchTerm ? `Results for "${searchTerm}"` : "All Products"}
        </h3>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-10 text-center">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
