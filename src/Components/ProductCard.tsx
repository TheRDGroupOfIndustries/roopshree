"use client";
import Image from "next/image";
import { BiHeart, BiPlus } from "react-icons/bi";
import { IoStarSharp } from "react-icons/io5";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
   rating:number,
}

export default function ProductCard({
  name,
  description,
  price,
  oldPrice,
  image,
  badge,
  badgeColor,
   rating
}: ProductCardProps) {
  return (
   <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
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
        i < rating ? "text-yellow-400" : "text-gray-300"
      } text-xs`}
    />
  ))}
  <span className="text-sm text-gray-500">(127)</span>
</div>


    {/* Price + Add Button */}
    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-[var(--color-brand)]">
          {price}
        </span>
        {oldPrice && (
          <span className="text-xs text-gray-400 line-through">{oldPrice}</span>
        )}
      </div>
      <button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white rounded-lg p-2 shadow-md transition-colors">
        <BiPlus className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>

  );
}
