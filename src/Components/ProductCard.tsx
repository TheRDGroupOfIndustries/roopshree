"use client";
import Image from "next/image";
import Link from "next/link";
import { BiHeart, BiPlus, BiMinus } from "react-icons/bi";
import { IoStarSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import { addToCart, removeCartItem } from "@/services/cartService";
import toast from "react-hot-toast";
import SmallLoadingSpinner from "./SmallLoadingSpinner";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  refreshWishlist?: () => void;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  oldPrice,
  image,
  refreshWishlist,
}: ProductCardProps) {
  const { user, refreshUser } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Initialize wishlist and cart state
  useEffect(() => {
    if (!user) return;

    const wishlistExists = user.wishlist?.some(
      (item: any) => item.productId === id
    );
    setIsInWishlist(!!wishlistExists);

    const cartExists = user.cart?.items?.some(
      (item: any) => item.productId === id
    );
    setIsInCart(!!cartExists);
  }, [user, id]);

  // Toggle wishlist
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to manage wishlist");

    try {
      setLoadingWishlist(true);

      if (isInWishlist) {
        setIsInWishlist(false);
        await removeFromWishlist(id);
        toast.success("Removed from wishlist");
        if (refreshWishlist) refreshWishlist();
      } else {
        setIsInWishlist(true);
        await addToWishlist(id);
        toast.success("Added to wishlist");
      }

      refreshUser(); // background refresh (no await)
    } catch (err) {
      console.error(err);
      // rollback UI state if API fails
      setIsInWishlist((prev) => !prev);
      toast.error("Something went wrong");
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to add to cart");

    try {
      setLoadingCart(true);
      setIsInCart(true); // update UI immediately
      await addToCart(id, 1);
      toast.success("Added to cart");
      refreshUser(); // don't await — background refresh
    } catch (err) {
      console.error(err);
      setIsInCart(false); // rollback if failed
      toast.error("Failed to add to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  // Remove from cart
  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to remove from cart");

    try {
      const cartItem = user.cart?.items?.find(
        (item: any) => item.productId === id
      );
      if (!cartItem) return toast.error("Product not found in cart");

      setLoadingCart(true);
      setIsInCart(false); // instant UI feedback
      await removeCartItem(cartItem.id);
      toast.success("Removed from cart");
    
      refreshUser(); // background refresh
    } catch (err) {
      console.error(err);
      setIsInCart(true); // rollback if failed
      toast.error("Failed to remove from cart");
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <Link href={`/product/${id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
        {/* Image + Wishlist */}
        <div className="relative">
          <button
            className={`absolute top-2 right-2 rounded-full p-1.5 shadow-sm flex items-center justify-center
              ${
                isInWishlist
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600"
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

          <div className="w-full flex items-center justify-center h-auto">
            <Image
              src={image}
              alt={name}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 flex flex-col flex-grow">
          <h4 className="font-semibold text-lg text-gray-900 mb-1">{name}</h4>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-grow">
            {description}
          </p>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <IoStarSharp
                key={i}
                className={`${
                  i < 5 ? "text-yellow-400" : "text-gray-300"
                } text-xs`}
              />
            ))}
            <span className="text-sm text-gray-500">(127)</span>
          </div>

          {/* Price + Cart Button */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--color-brand)]">
                ₹{price}
              </span>
              {oldPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{oldPrice}
                </span>
              )}
            </div>

            <button
              className={`p-2 rounded-lg shadow-md transition-colors flex items-center justify-center
                ${
                  isInCart
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
                }`}
              onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
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
