"use client";

import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ProductCard from "@/Components/ProductCard";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    // 💄 Makeup
    {
      id: 1,
      name: "Luxury Foundation",
      description: "Perfect coverage for all skin types",
      price: "₹1,299",
      oldPrice: "₹1,599",
      image: "/images/image.png",
      badge: "New",
      badgeColor: "bg-orange-400",
      rating: 4,
      category: "Makeup",
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
      rating: 5,
      category: "Makeup",
    },

    // 🧴 Skincare
    {
      id: 3,
      name: "Glow Moisturizer",
      description: "Keeps your skin hydrated all day",
      price: "₹799",
      image: "/images/image.png",
      rating: 4,
      category: "Skincare",
    },
    {
      id: 4,
      name: "Vitamin C Serum",
      description: "Brightens dull and tired skin",
      price: "₹999",
      oldPrice: "₹1,299",
      image: "/images/image.png",
      badge: "Popular",
      badgeColor: "bg-pink-500",
      rating: 5,
      category: "Skincare",
    },

    // 🌸 Fragrance
    {
      id: 5,
      name: "Floral Perfume",
      description: "A light, elegant fragrance for daily wear",
      price: "₹1,499",
      image: "/images/image.png",
      badge: "New",
      badgeColor: "bg-blue-400",
      rating: 4,
      category: "Fragrance",
    },
    {
      id: 6,
      name: "Woody Musk Eau De Parfum",
      description: "Strong, long-lasting aroma for evenings",
      price: "₹1,899",
      oldPrice: "₹2,199",
      image: "/images/image.png",
      badge: "Limited",
      badgeColor: "bg-purple-600",
      rating: 5,
      category: "Fragrance",
    },

    // 💇 Haircare
    {
      id: 7,
      name: "Keratin Shampoo",
      description: "Smoothens and strengthens hair",
      price: "₹699",
      image: "/images/image.png",
      rating: 4,
      category: "Haircare",
    },
    {
      id: 8,
      name: "Argan Oil Hair Serum",
      description: "Adds shine and reduces frizz",
      price: "₹899",
      oldPrice: "₹1,099",
      image: "/images/image.png",
      badge: "Hot",
      badgeColor: "bg-red-500",
      rating: 5,
      category: "Haircare",
    },

    // 👓 Accessories
    {
      id: 9,
      name: "Makeup Brush Set",
      description: "Soft bristles for a perfect blend",
      price: "₹1,099",
      image: "/images/image.png",
      badge: "Trending",
      badgeColor: "bg-yellow-500",
      rating: 4,
      category: "Accessories",
    },
    {
      id: 10,
      name: "Compact Mirror",
      description: "Portable and stylish mirror for travel",
      price: "₹299",
      image: "/images/image.png",
      rating: 4,
      category: "Accessories",
    },

    // 👨 Men's Grooming
    {
      id: 11,
      name: "Beard Oil",
      description: "Softens and nourishes beard",
      price: "₹649",
      image: "/images/image.png",
      badge: "Top Rated",
      badgeColor: "bg-green-500",
      rating: 5,
      category: "Men’s Grooming",
    },
    {
      id: 12,
      name: "Charcoal Face Wash",
      description: "Deep cleans pores and removes dirt",
      price: "₹499",
      image: "/images/image.png",
      rating: 4,
      category: "Men’s Grooming",
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

  // Group products by category
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-white py-4 pb-20">
      {/* 🔍 Search Bar */}
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
{/* catogery section */}
{/* <div className="w-full mt-6">
  <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>

  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
    {[
      { name: "Electronics", img: "https://via.placeholder.com/100?text=E" },
      { name: "Fashion", img: "https://via.placeholder.com/100?text=F" },
      { name: "Home", img: "https://via.placeholder.com/100?text=H" },
      { name: "Beauty", img: "https://via.placeholder.com/100?text=B" },
      { name: "Toys", img: "https://via.placeholder.com/100?text=T" },
      { name: "Sports", img: "https://via.placeholder.com/100?text=S" },
    ].map((cat, i) => (
      <div
        key={i}
        className="flex flex-col items-center justify-center min-w-[90px]"
      >
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500 shadow-md flex items-center justify-center bg-white">
          <img
            src={cat.img}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-gray-700 mt-2">{cat.name}</p>
      </div>
    ))}
  </div>
</div> */}

      {/* 🔥 Popular Searches */}
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

      {/* 🛍️ Products Section */}
      <div className="px-4">
        {searchTerm ? (
          <>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              Results for {searchTerm}
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
          </>
        ) : (
          categories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {products
                  .filter((p) => p.category === category)
                  .map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
