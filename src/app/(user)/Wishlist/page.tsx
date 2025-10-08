"use client";

import React from "react";
import { Heart, Search } from "lucide-react";
import { BiPlus } from "react-icons/bi";
import Image from "next/image";
interface Product {
  id: number;
  description: string;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  peopleliked: string;
  img: string;
}

const WishlistPage: React.FC = () => {
  const products: Product[] = [
    {
      id: 1,
      description: "Glow Lab",
      title: "Vitamin C Brightness Serum",
      price: 2499,
      originalPrice: 4999,
      rating: 4.5,
      peopleliked: "(5323)",
      img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      description: "Equa Glow",
      title: "Hydration Face Serum",
      price: 3999,
      originalPrice: 4999,
      rating: 4.7,
      peopleliked: "(4521)",
      img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      description: "Pure Skin",
      title: "Niacinamide Face Cream",
      price: 1999,
      originalPrice: 3999,
      rating: 4.4,
      peopleliked: "(3892)",
      img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      description: "Radiance Co",
      title: "Retinol Night Serum",
      price: 1499,
      originalPrice: 2999,
      rating: 4.6,
      peopleliked: "(6234)",
      img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=400&fit=crop",
    },
  ];

   const discount = (original: number, current: number): number => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 mb-20">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold text-amber-600">
          BeautyBloom
        </h1>

        {/* Search Icon */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <Search className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </nav>

      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
          Your Favorites
        </h1>
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600">
          Wishlist ({products.length} items)
        </h2>
      </div>

      {/* Products Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((item: Product) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  fill
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                ></Image>
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500" />
                </button>
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  20% OFF
                </div>
              </div>

              {/* Product Details */}
              <div className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide mb-1">
                  {item.description}
                </p>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-2 h-10 sm:h-12">
                  {item.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-500 text-sm sm:text-base">
                    ⭐
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {item.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.peopleliked}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <p className="text-lg sm:text-xl font-bold text-amber-600">
                    ₹{item.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    ₹{item.originalPrice.toLocaleString()}
                  </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2 shadow-md transition-colors">
                         <BiPlus className="w-4 h-4" />
                       </button>
                </div>

               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
