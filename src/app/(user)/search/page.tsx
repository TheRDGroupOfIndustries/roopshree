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

// Define Product structure for better type safety
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  images: string[];
  category: string;
  reviews: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState(categoryQuery || "");
  const [products, setProducts] = useState<Product[]>([]); // Use the defined interface
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // 🔹 Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const res = await getAllCategories();
        setCategories(res);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Update searchTerm when categoryQuery changes
  useEffect(() => {
    if (categoryQuery) {
      setSearchTerm(categoryQuery);
    }
  }, [categoryQuery]); // Dependency array includes categoryQuery

  // 🔹 Hardcoded Popular Searches
  const popularSearches = [
    "Lipstick",
    "Moisturizer",
    "Foundation",
    "Perfume",
    "Serum",
    "Sunscreen",
    "Bella Vita Perfumes",
  ];

  // 🔹 Fetch all products dynamically from API
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

  // 🔹 Filter products based on search term (using title or category)
  const filteredProducts = products.filter(
    (product) =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Get unique categories
  const uniqueCategories = [...new Set(products.map((p) => p.category))].filter(Boolean); // Filter out any null/undefined categories

  return (
    <div className="min-h-screen py-4 pb-20">
      {/* 🔍 Search Bar */}
      <div className="sticky top-3 z-20 flex items-center   border border-gray-200 shadow-sm rounded-xl mx-4 mb-3 px-3 py-2">
        <AiOutlineSearch size={20} className="" />
        <input
          type="text"
          placeholder="Search cosmetics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none ml-3 text-sm "
        />
      </div>

      {/* 🔥 Popular Searches - RESOLVED CONFLICT */}
      <div className="px-4 mb-5">
        <h3 className="text-base font-semibold   mb-2">
          Popular Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {/* Using the hardcoded popularSearches array */}
          {popularSearches.map((term, index) => (
            <button
              key={index}
              onClick={() => setSearchTerm(term)}
              // Added border and hover for better styling contrast
              className="px-3 py-1.5   border border-amber-300 text-amber-600 text-xs font-medium rounded-full hover:bg-amber-50 transition"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* 🟣 Category Section */}
      <div className="mt-6 px-4">
        <h3 className="font-semibold text-base mb-3  ">Categories</h3>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {categoryLoading ? (
            <CategorySkeleton />
          ) : (
            // CategoryList will need an onClick handler to set the search term
            <CategoryList categories={categories} setSearchTerm={setSearchTerm} /> 
          )}
        </div>
      </div>

      {/* 🛍️ Products Section */}
      <div className="px-4 mt-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : searchTerm ? (
          <>
            <h3 className="font-semibold text-lg  mb-3">
              Results for “{searchTerm}”
            </h3>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                No products found matching "{searchTerm}". Try a different search!
              </p>
            )}
          </>
        ) : (
          // Display products categorized by unique categories when no search term is active
          uniqueCategories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="font-semibold text-xl   mb-3 border-b border-gray-200 pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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