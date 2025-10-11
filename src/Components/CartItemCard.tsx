"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Heart } from "lucide-react";
import SmallLoadingSpinner from "./SmallLoadingSpinner";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  prePrice?: number;
  image: string;
  quantity: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onMoveToWishlist: (productId: string) => void;
}

const CartItemCard: React.FC<CartItemProps> = ({
  id,
  productId,
  name,
  description,
  price,
  prePrice,
  image,
  quantity,
  onRemove,
  onUpdateQuantity,
}) => {
  const { user, refreshUser } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  useEffect(() => {
    if (!user) return;
    const wishlistExists = user.wishlist?.some(
      (item: any) => item.productId === productId
    );
    setIsInWishlist(!!wishlistExists);
  }, [user, productId]);

  const handleWishlistToggle = async () => {
    if (!user) return toast.error("Please login to manage wishlist");

    try {
      setLoadingWishlist(true);

      setIsInWishlist((prev) => !prev);

      if (isInWishlist) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      }

      // Refresh user after backend update
      refreshUser();
    } catch (err) {
      console.error(err);
      setIsInWishlist((prev) => !prev);
      toast.error("Something went wrong");
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Remove Button */}
      <button
        className="absolute top-1 right-1 z-10 w-6 h-6 text-black rounded-full flex items-center justify-center text-sm"
        aria-label="Remove item"
        onClick={() => onRemove(id)}
      >
        <X className="w-3 h-3" />
      </button>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%]" />

      <div className="p-3 sm:p-4">
        <div className="flex gap-3">
          {/* Product Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <Image
              src={image}
              fill
              alt={name}
              sizes="(max-width: 768px) 64px, 128px"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                {name}
              </h3>
              <p className="text-xs text-gray-500 mb-1 truncate">
                {description}
              </p>

              <div className="flex items-center gap-1 mb-2">
                <span className="text-base font-bold text-[var(--color-brand)]">
                  ₹{price.toLocaleString()}
                </span>
                {prePrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{prePrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity & Wishlist */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(id, -1)}
                  className="w-6 h-6 flex items-center justify-center border border-gray-300 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 text-gray-700" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(id, 1)}
                  className="w-6 h-6 flex items-center justify-center border border-gray-300 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 text-gray-700" />
                </button>
              </div>

              <button
                onClick={handleWishlistToggle}
                disabled={loadingWishlist}
                className="flex items-center gap-1 text-[var(--color-brand)] text-xs font-medium"
              >
                {loadingWishlist ? (
                  <SmallLoadingSpinner />
                ) : (
                  <>
                    <span>
                      {isInWishlist ? "Added to Wishlist" : "Move to Wishlist"}
                    </span>
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist ? "fill-red-500" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
