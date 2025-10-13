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
