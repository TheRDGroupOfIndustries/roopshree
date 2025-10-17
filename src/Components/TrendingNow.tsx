// "use client";
// import Image from "next/image";
// import { BiHeart, BiPlus } from "react-icons/bi";

// interface TrendingCardProps {
//   id: number;
//   name: string;
//   price: string;
//   oldPrice: string;
//   image: string;
// }

// export default function TrendingCard({
//   name,
//   price,
//   oldPrice,
//   image,
// }: TrendingCardProps) {
//   return (
//     <div className="flex-shrink-0 w-[140px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
//       {/* Image Section */}
//       <div className="relative w-full h-28">
//         {/* Wishlist Icon */}
//         <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 z-10">
//           <BiHeart className="w-3.5 h-3.5 text-gray-600" />
//         </button>

//         {/* Product Image */}
//         <Image
//           src={image}
//           alt={name}
//           fill
//           sizes="140px"
//           className="object-cover"
//           priority
//         />
//       </div>

//       {/* Product Info Section */}
//       <div className="p-2">
//         <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">
//           {name}
//         </h4>

//         {/* Price and Add Button */}
//         <div className="flex items-center justify-between">
//   <div className="flex gap-1 items-baseline">
//     <span className="text-lg font-bold text-[var(--color-brand)]">
//       ₹{price}
//     </span>
//     {oldPrice && oldPrice > price && (
//       <span className="text-xs font-medium text-gray-500 line-through">
//         ₹{oldPrice}
//       </span>
//     )}
//   </div>

//   <button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white rounded-lg p-1.5 shadow-sm transition-colors">
//     <BiPlus className="w-4 h-4" />
//   </button>
// </div>

//       </div>
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import { BiHeart, BiPlus, BiMinus } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import { addToCart, removeCartItem } from "@/services/cartService";
import toast from "react-hot-toast";
import SmallLoadingSpinner from "./SmallLoadingSpinner";
import Link from "next/link";

interface TrendingCardProps {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
}

export default function TrendingCard({
  id,
  name,
  price,
  oldPrice,
  image,
}: TrendingCardProps) {
  const { user, refreshUser } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  // Sync state with user once
  useEffect(() => {
    if (!user) return;
    const wishlistExists = user.wishlist?.some(
      (item: any) => String(item.productId) === String(id)
    );
    const cartExists = user.cart?.items?.some(
      (item: any) => String(item.productId) === String(id)
    );
    setIsInWishlist(!!wishlistExists);
    setIsInCart(!!cartExists);
  }, [user, id]);

  // Toggle wishlist
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to manage wishlist");
    try {
      setLoadingWishlist(true);
      if (isInWishlist) {
        await removeFromWishlist(id);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(id);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
      refreshUser(); // update user state
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Toggle cart
  const handleCartToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to manage cart");
    try {
      setLoadingCart(true);
      if (isInCart) {
        const cartItem = user.cart?.items?.find(
          (item: any) => String(item.productId) === String(id)
        );
        if (!cartItem) return toast.error("Product not found in cart");
        await removeCartItem(cartItem.id);
        setIsInCart(false);
        toast.success("Removed from cart");
      } else {
        await addToCart(id, 1);
        setIsInCart(true);
        toast.success("Added to cart");
      }
      refreshUser();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <Link href={`/product/${id}`}>
      <div className="flex-shrink-0 w-[140px]   rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        {/* Image + Wishlist */}
        <div className="relative w-full h-28">
          <button
            className={`absolute top-2 right-2 rounded-full p-1 shadow-sm z-10 transition
            ${isInWishlist ? "bg-red-500 " : " hover:bg-gray-100"}`}
            onClick={handleWishlistToggle}
            disabled={loadingWishlist}
          >
            {loadingWishlist ? (
              <SmallLoadingSpinner />
            ) : (
              <BiHeart className="w-4 h-4" />
            )}
          </button>

          <Image
            src={image}
            alt={name}
            fill
            sizes="140px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Product Info */}
        <div className="p-2">
          <h4 className="font-medium text-sm text-black mb-1 truncate">{name}</h4>

          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-baseline">
              <span className="text-base font-bold text-[var(--color-brand)]">
                ₹{price}
              </span>
              {oldPrice && oldPrice > price && (
                <span className="text-xs  line-through font-medium">
                  ₹{oldPrice}
                </span>
              )}
            </div>

            <button
              className={`rounded-lg p-1.5 shadow-sm transition-colors flex items-center justify-center
              ${
                isInCart
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
              }`}
              onClick={handleCartToggle}
              disabled={loadingCart}
            >
              {loadingCart ? (
                <SmallLoadingSpinner />
              ) : isInCart ? (
                <BiMinus className="w-4 h-4" />
              ) : (
                <BiPlus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
