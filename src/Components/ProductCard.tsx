"use client";
import Image from "next/image";
import { BiHeart, BiPlus } from "react-icons/bi";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
}

export default function ProductCard({
  name,
  description,
  price,
  oldPrice,
  image,
  badge,
  badgeColor,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image + Badge */}
      <div className="relative">
        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-2 left-2 ${badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-lg`}
          >
            {badge}
          </span>
        )}

        {/* Wishlist Icon */}
        <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-50">
          <BiHeart className="w-4 h-4 text-gray-600" />
        </button>

        {/* Product Image */}
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
      <div className="p-3">
        <h4 className="font-semibold text-lg text-gray-900 mb-1">{name}</h4>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>

        {/* Price + Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-orange-400">{price}</span>
            {oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                {oldPrice}
              </span>
            )}
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2 shadow-md transition-colors">
            <BiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
