"use client";

import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import ProductCard from "@/Components/ProductCard";
import { getWishlist } from "@/services/wishlistService";
import LoadingSpinner from "@/Components/LoadingSpinner";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { FiHeart } from "react-icons/fi";
import Link from "next/link";

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
    price: number;
    oldPrice: number;
    images: string[];
    category: string;
    description: string;
  };
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      // console.log("fetchWishlist: ", data);

      setWishlist(data);
      // console.log("Wishlist API response:", data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 mb-20">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-600">
          Roop Shree
        </h1>
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <BiSearch className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </nav>

      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
          Your Favorites
        </h1>
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600">
          Wishlist ({wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          )
        </h2>
      </div>

      {/* Loading */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            // Show 8 skeleton cards while loading
            Array.from({ length: 4}).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : wishlist.length === 0 ? (
             <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4 ">
              <FiHeart className="text-[var(--color-brand)] w-16 h-16" />
              <h2 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty!</h2>
              <p className="text-gray-600 text-center max-w-xs">
                Looks like you haven’t added any favorites yet. Explore products and add items you love!
              </p>
              <Link
                href="/home"
                className="px-6 py-2 bg-[var(--color-brand)] text-white rounded-lg 500 "
              >
                Shop Now
              </Link>
            </div>
          ) : (
            wishlist.map(({ product }) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                description={product.description}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.images?.[0]}
                refreshWishlist={fetchWishlist}
                reviews={product.reviews}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
