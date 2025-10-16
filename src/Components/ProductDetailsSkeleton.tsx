"use client";
import React from "react";

export default function ProductDetailsSkeleton() {
  return (
    <div className="flex flex-col h-screen   animate-pulse">
      {/* Header */}
      <div className="  flex justify-between items-center px-4 py-3 shadow-sm">
        <div className="w-6 h-6  rounded-full" />
        <div className="h-5 w-32  rounded" />
        <div className="flex gap-4">
          <div className="w-6 h-6  rounded-full" />
          <div className="w-6 h-6  rounded-full" />
        </div>
      </div>

      {/* Product Image */}
      <div className="flex-1  w-full"></div>

      {/* Product Info (Bottom Section) */}
      <div className="  p-4 rounded-t-2xl shadow-inner">
        <div className="h-4 w-20  rounded mb-2"></div>
        <div className="h-6 w-3/4  rounded mb-2"></div>
        <div className="h-3 w-full  rounded mb-4"></div>

        <div className="flex items-center gap-2 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4  rounded" />
          ))}
        </div>

        <div className="w-full h-10  rounded-lg"></div>
      </div>
    </div>
  );
}
