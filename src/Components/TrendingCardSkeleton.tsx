// TrendingCardSkeleton.tsx
"use client";
import React from "react";

export default function TrendingCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[140px]   rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-28 relative"></div>

      {/* Product Info Skeleton */}
      <div className="p-2 space-y-2">
        <div className="h-4 rounded w-3/4"></div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-baseline">
            <div className="h-4 w-10 rounded"></div>
            <div className="h-3 w-6 rounded"></div>
          </div>
          <div className="h-6 w-6 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
