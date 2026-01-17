"use client";

import Image from "next/image";
import Link from "next/link";
import { BiHeart } from "react-icons/bi";
import { IoStarSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import toast from "react-hot-toast";
import SmallLoadingSpinner from "./SmallLoadingSpinner";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  reviews?: { rating: number; comment: string }[];
  refreshWishlist?: () => void;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  oldPrice,
  image,
  reviews,
  refreshWishlist,
}: ProductCardProps) {
  const { user, refreshUser } = useAuth();

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    if (!user) return;

    const wishlistExists = user.wishlist?.some(
      (item: any) => item.productId === id
    );
    setIsInWishlist(!!wishlistExists);
  }, [user, id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) return toast.error("Please login to manage wishlist");

    try {
      setLoadingWishlist(true);

      if (isInWishlist) {
        setIsInWishlist(false);
        await removeFromWishlist(id);
        toast.success("Removed from wishlist");
        refreshWishlist?.();
      } else {
        setIsInWishlist(true);
        await addToWishlist(id);
        toast.success("Added to wishlist");
      }

      refreshUser(); // background refresh
    } catch (err) {
      console.error(err);
      setIsInWishlist((prev) => !prev);
      toast.error("Something went wrong");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <Link href={`/product/${id}`}>
      <div className="rounded-2xl overflow-hidden bg-white text-black shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition duration-300">
        {/* Image + Wishlist */}
        <div className="relative">
          <button
            className={`absolute top-2 right-2 rounded-full p-1.5 shadow-md z-10
              ${
                isInWishlist
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            onClick={handleWishlistToggle}
            disabled={loadingWishlist}
          >
            {loadingWishlist ? (
              <SmallLoadingSpinner />
            ) : (
              <BiHeart className="w-4 h-4" />
            )}
          </button>

          <div className="w-full h-48 sm:h-56 flex items-center justify-center">
            <Image
              src={image}
              alt={name}
              width={300}
              height={300}
              className="w-full h-full object-contain p-4"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 flex flex-col flex-grow">
          <h4 className="font-semibold text-base mb-1 line-clamp-1">{name}</h4>
          <p className="text-xs mb-3 line-clamp-2 flex-grow">{description}</p>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <IoStarSharp
                key={i}
                className={`${
                  i < Math.round(avgRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } text-xs`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">
              ({reviews?.length || 0})
            </span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--color-brand)]">
                ₹{price.toLocaleString()}
              </span>
              {oldPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{oldPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
