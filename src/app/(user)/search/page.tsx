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
   reviews: { rating: number; comment: string }[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState(categoryQuery || "");
  const [products, setProducts] = useState<Product[]>([]); // Using the defined interface
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  // Hardcoded Popular Searches (Good for SEO/User Experience)
  // const popularSearches = [
  //   "Lipstick",
  //   "Moisturizer",
  //   "Foundation",
  //   "Perfume",
  //   "Serum",
  //   "Sunscreen",
  //   "Bella Vita Perfumes",
  // ];

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);

      // ✅ Add this block right here to create 5 random popular searches
      const titles = [...new Set(data.map((p) => p.title).filter(Boolean))]; // Get unique, non-empty titles
      const shuffled = titles.sort(() => 0.5 - Math.random()); // Shuffle
      const selected = shuffled.slice(0, 5); // Pick first 5
      setPopularSearches(selected); // Update state
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


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

  const clearSearch = () => {
    setSearchTerm("");
  };

  // 🔹 Update searchTerm when categoryQuery changes
  useEffect(() => {
    if (categoryQuery) {
      setSearchTerm(categoryQuery);
    }
  }, [categoryQuery]); // Dependency array includes categoryQuery

  // 🔹 Fetch all products dynamically from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        // console.log("fetchProducts: ",data);
        
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
  const uniqueCategories = [...new Set(products.map((p) => p.category))].filter(
    Boolean
  );

  return (
    <div className="min-h-screen pb-20 bg-white text-black">
      {/* 🔍 Search Bar */}
      <div className="sticky top-0 z-20 bg-white shadow py-3">
        <div className="flex items-center border border-gray-200 shadow-sm rounded-xl mx-4 px-3 py-2">
          <AiOutlineSearch size={20} className=" " />
          <input
            type="text"
            placeholder="Search cosmetics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none ml-3 text-sm placeholder:text-gray-400 "
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="hover:text-gray-700 ml-2 text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 🔥 Popular Searches */}
      <div className="px-4 mb-5">
        <h3 className="text-base font-semibold   mb-2">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
          {/* Using the hardcoded popularSearches array */}
          {popularSearches.slice(0, 5).map((term, index) => (
  <button
    key={index}
    onClick={() => setSearchTerm(term)}
    className="px-3 py-1.5 border border-amber-300 text-amber-600 text-xs font-medium rounded-full hover:bg-amber-50 transition whitespace-nowrap"
  >
    {term}
  </button>
))}

        </div>
      </div>

      {/* 🟣 Category Section */}
      <div className="mt-6 px-4">
        <h3 className="font-semibold text-base mb-3  ">Categories</h3>
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {categoryLoading ? (
            <CategorySkeleton />
          ) : (
            // Pass setSearchTerm to CategoryList for filtering
            <CategoryList
              categories={categories}
              // onSelect={(cat) => setSearchTerm(cat.name)}
            />
          )}
        </div>
      </div>

      {/* 🛍️ Products Section */}
      <div className="px-4 mt-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Show a reasonable number of skeletons while loading */}
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
              <p className=" text-sm mt-10 text-center">
                No products found matching "{searchTerm}". Try a different
                search!
              </p>
            )}
          </>
        ) : (
          // Display products categorized by unique categories when no search term is active
          uniqueCategories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="font-semibold text-xl  mb-3 border-b border-gray-200 pb-2">
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
