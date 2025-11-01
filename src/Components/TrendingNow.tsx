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
import { BsCartFill, BsCartCheckFill } from "react-icons/bs";

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
  // const [isInCart, setIsInCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  // const [loadingCart, setLoadingCart] = useState(false);

  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Sync state with user once
  useEffect(() => {
    if (!user) return;
    const wishlistExists = user.wishlist?.some(
      (item: any) => String(item.productId) === String(id)
    );
    // const cartExists = user.cart?.items?.some(
    //   (item: any) => String(item.productId) === String(id)
    // );
    setIsInWishlist(!!wishlistExists);
    // setIsInCart(!!cartExists);
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
      } else {
        setIsInWishlist(true);
        await addToWishlist(id);
        toast.success("Added to wishlist");
      }
      refreshUser(); // update user state
    } catch (err) {
      console.error(err);
      // rollback UI state if API fails
      setIsInWishlist((prev) => !prev);
      toast.error("Something went wrong");
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Toggle cart
  // const handleCartToggle = async (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   if (!user) return toast.error("Please login to manage cart");
  //   try {
  //     setLoadingCart(true);
  //     if (isInCart) {
  //       const cartItem = user.cart?.items?.find(
  //         (item: any) => String(item.productId) === String(id)
  //       );
  //       if (!cartItem) return toast.error("Product not found in cart");
        
  //       // Instant UI feedback, rollback if API fails
  //       setIsInCart(false); 
  //       // await removeCartItem(cartItem.id); 
        
  //       toast.success("Removed from cart");
  //     } else {
  //       // await addToCart(id, quantity); // Use quantity state here
  //       setIsInCart(true);
  //       toast.success(`Added ${quantity} item(s) to cart`);
  //     }
  //     refreshUser();
  //   } catch (err) {
  //     console.error(err);
  //     // rollback UI state if API fails
  //     setIsInCart((prev) => !prev);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setLoadingCart(false);
  //   }
  // };

  return (
    <Link href={`/product/${id}`}>
      {/* ⚠️ NOTE: Card width is fixed at w-[140px], so the design must be compact. */}
      <div className="flex-shrink-0 w-[140px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
        {/* Image + Wishlist */}
        <div className="relative w-full h-28">
          <button
            className={`absolute top-2 right-2 rounded-full p-1 shadow-sm z-10 transition flex items-center justify-center
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

          <Image
            src={image}
            alt={name}
            fill
            sizes="140px"
            className="object-cover p-2" // Added p-2 for padding within the small container
            priority
            unoptimized
          />
        </div>

        {/* Product Info */}
        <div className="p-2">
          <h4 className="font-medium text-sm text-black mb-1 truncate">
            {name}
          </h4>

          {/* Price and Controls Row (FIXED ALIGNMENT) */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex gap-1 items-baseline">
              <span className="text-base font-bold text-[var(--color-brand)]">
                ₹{price}
              </span>
              {oldPrice && oldPrice > price && (
                <span className="text-xs line-through font-medium text-gray-500">
                  ₹{oldPrice}
                </span>
              )}
            </div>

            {/* Quantity and Cart Buttons - Aligned to the right/bottom */}
            <div
              className="flex items-center justify-between gap-1 w-full" // **ADDED w-full for best use of space**
              onClick={(e) => e.preventDefault()}
            >
              {/* Quantity controls (Made more compact) */}
              <div className="flex items-center gap-0.5"> {/* **Reduced gap to 0.5** */}
                <button
                  className="h-6 w-6 rounded-md shadow-sm flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition" // **SIZE REDUCED (h-6 w-6) for compactness**
                  onClick={(e) => {
                    e.preventDefault();
                    handleDecrease();
                  }}
                  aria-label="Decrease quantity"
                >
                  <BiMinus className="text-xs" /> {/* **ICON SIZE REDUCED** */}
                </button>

                <span className="font-semibold text-xs w-4 text-center"> {/* **TEXT SIZE REDUCED** */}
                  {quantity}
                </span>

                <button
                  className="h-6 w-6 rounded-md shadow-sm flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition" // **SIZE REDUCED (h-6 w-6) for compactness**
                  onClick={(e) => {
                    e.preventDefault();
                    handleIncrease();
                  }}
                  aria-label="Increase quantity"
                >
                  <BiPlus className="text-xs" /> {/* **ICON SIZE REDUCED** */}
                </button>
              </div>

              {/* Add/Remove to Cart Button (UNCOMMENTED & STYLED) */}
              {/* <button
                className={`rounded-lg p-1.5 shadow-sm transition-colors flex items-center justify-center ml-auto h-8 w-8 flex-shrink-0
                ${
                  isInCart
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
                }`}
                onClick={handleCartToggle}
                disabled={loadingCart}
                aria-label={isInCart ? "Remove from cart" : "Add to cart"}
              >
                {loadingCart ? (
                  <SmallLoadingSpinner />
                ) : isInCart ? (
                  <BsCartCheckFill className="w-4 h-4" />
                ) : (
                  <BsCartFill className="w-4 h-4" />
                )}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}