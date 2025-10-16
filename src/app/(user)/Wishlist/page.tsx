// "use client";

// import React from "react";
// import ProductCard from "@/Components/ProductCard";
// import { BiSearch } from "react-icons/bi";

// const WishlistPage: React.FC = () => {

//    const discount = (original: number, current: number): number => {
//     return Math.round(((original - current) / original) * 100);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 mb-20">
//       {/* Navbar */}
//       <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-md sticky top-0 z-50">
//         {/* Logo */}
//         <h1 className="text-xl sm:text-2xl font-bold text-amber-600">
//           Roop Shree
//         </h1>

//         {/* Search Icon */}
//         <button className="p-2 hover:bg-gray-100 rounded-full transition">
//           <BiSearch className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
//         </button>
//       </nav>

//       {/* Header Section */}
//       <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
//           Your Favorites
//         </h1>
//         <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600">
//           Wishlist ({products.length} items)
//         </h2>
//       </div>

//       {/* Products Grid */}
//       <div className="px-4 sm:px-6 lg:px-8 pb-8">
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {products.map((item) => (
//            <ProductCard/>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WishlistPage;

"use client";

import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import ProductCard from "@/Components/ProductCard";
import { getWishlist } from "@/services/wishlistService";
import LoadingSpinner from "@/Components/LoadingSpinner";

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
      console.log("fetchWishlist: ",data);
      
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
      {loading ? (
        <LoadingSpinner message="Loading wishlist..." />
      ) : wishlist.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
             {Array.isArray(wishlist) && wishlist.length > 0 ? (
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
            ) : (
              <p className="text-center text-gray-600">
                Your wishlist is empty.
              </p>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
