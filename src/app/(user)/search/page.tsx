"use client";

import { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ProductCard from "@/Components/ProductCard";
import Image from "next/image";
import CategorySkeleton from "@/Components/CategorySkeleton";
import CategoryList from "@/Components/CategoryList";
import { getAllCategories } from "@/services/categoryService";
import { getAllProducts } from "@/services/productService";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
   const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState(categoryQuery ||"");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const res = await getAllCategories();
        // console.log("Fetched Categories:", res);
        setCategories(res);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryQuery) {
      setSearchTerm(categoryQuery);
    }
  }, []);

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
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);
useEffect(() => {
  if (categoryQuery) {
    setSearchTerm(categoryQuery);
  }
}, [categoryQuery]);


  // 🔹 Filter products based on search term (using title)
  // 🔎 Filtered Products
 const filteredProducts = products.filter((product) =>
  product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.category?.toLowerCase().includes(searchTerm.toLowerCase())
);


  // 🔹 Get unique categories
  // 🏷️ Get Unique Categories
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

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
        <h3 className="text-base font-semibold text-gray-700 mb-2">
          Popular Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {products.length > 0 && (
  <div className="px-4 mb-5">
    {/* <h3 className="text-base font-semibold text-gray-700 mb-2">
      Popular Searches
    </h3> */}
    <div className="flex flex-wrap gap-2">
      {products.slice(0, 5).map((product) => (
        <button
          key={product.id}
          onClick={() => setSearchTerm(product.title)}
          className="px-3 py-1.5 bg-gray-100 text-[var(--color-brand)] text-xs font-medium rounded-full hover:bg-amber-50 transition"
        >
          {product.title}
        </button>
      ))}
    </div>
  </div>
)}
        </div>
      </div>

      {/* 🛍️ Product Section */}
      {/* 🟣 Category Section */}
      <div className="mt-6 px-4">
        <h3 className="font-semibold text-base mb-3">Categories</h3>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {categoryLoading ? (
            <CategorySkeleton />
          ) : (
            <CategoryList categories={categories} />
          )}
        </div>
      </div>

      {/* 🛍️ Products Section */}
      <div className="px-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
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
                     reviews={p.reviews}
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
          uniqueCategories.map((category) => (
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
                       reviews={p.reviews}
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
