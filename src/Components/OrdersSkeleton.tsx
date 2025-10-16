"use client";

import React from "react";

const OrdersSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-gray-100 shadow-sm flex gap-3 animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="w-18 h-18 bg-gray-300 rounded-lg flex-shrink-0" />

          {/* Info Skeleton */}
          <div className="flex-1 min-w-0 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-300 rounded w-1/2 mt-2" />
            <div className="h-3 bg-gray-300 rounded w-1/3 mt-1" />
          </div>

          {/* Status/Cancel Skeleton */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="h-5 w-20 bg-gray-300 rounded-full" />
            <div className="h-6 w-20 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersSkeleton;
