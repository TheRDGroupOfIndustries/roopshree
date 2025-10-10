"use client";
import Image from "next/image";
import { BiHeart, BiPlus } from "react-icons/bi";

interface TrendingCardProps {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  image: string;
}

export default function TrendingCard({
  name,
  price,
  oldPrice,
  image,
}: TrendingCardProps) {
  return (
    <div className="flex-shrink-0 w-[140px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image Section */}
      <div className="relative w-full h-28">
        {/* Wishlist Icon */}
        <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 z-10">
          <BiHeart className="w-3.5 h-3.5 text-gray-600" />
        </button>

        {/* Product Image */}
        <Image
          src={image}
          alt={name}
          fill
          sizes="140px"
          className="object-cover"
          priority
        />
      </div>

      {/* Product Info Section */}
      <div className="p-2">
        <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">
          {name}
        </h4>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between">
  <div className="flex gap-1 items-baseline">
    <span className="text-lg font-bold text-[var(--color-brand)]">
      ₹{price}
    </span>
    {oldPrice && oldPrice > price && (
      <span className="text-xs font-medium text-gray-500 line-through">
        ₹{oldPrice}
      </span>
    )}
  </div>

  <button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white rounded-lg p-1.5 shadow-sm transition-colors">
    <BiPlus className="w-4 h-4" />
  </button>
</div>

      </div>
    </div>
  );
}
