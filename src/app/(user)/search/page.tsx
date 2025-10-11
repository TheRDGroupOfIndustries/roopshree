"use client";

import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ProductCard from "@/Components/ProductCard";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const popularSearches = [
    "Lipstick",
    "Moisturizer",
    "Foundation",
    "Perfume",
    "Serum",
    "Sunscreen",
    "Bella Vita Perfumes",
  ];

  // 🔹 Fetch products dynamically from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        console.log("🔥 API response:", data);
        setProducts(data.products || data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Filter products based on search term (using title)
  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Get unique categories
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

      {/* 🛍️ Product Section */}
      <div className="px-4">
        {loading ? (
          <p className="text-gray-500 text-sm text-center mt-10">
            Loading products...
          </p>
        ) : searchTerm ? (
          <>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              Results for “{searchTerm}”
            </h3>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.title}
                    description={p.description}
                    price={p.price}
                    oldPrice={p.oldPrice}
                    image={
                      Array.isArray(p.images)
                        ? p.images[0]
                        : "/images/placeholder.png"
                    }
                    category={p.category}
                  />
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
                  .map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.title}
                      description={p.description}
                      price={p.price}
                      oldPrice={p.oldPrice}
                      image={
                        Array.isArray(p.images)
                          ? p.images[0]
                          : "/images/placeholder.png"
                      }
                      category={p.category}
                    />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
