// Components/CategorySkeleton.tsx
import React from "react";

const CategorySkeleton = () => {
  return (
    <div className="flex gap-5 overflow-x-auto scrollbar-hide">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center min-w-max animate-pulse"
        >
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div className="h-3 w-14 bg-gray-200 rounded mt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
