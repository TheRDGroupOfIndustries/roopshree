"use client";
import React from "react";

interface CategoryListProps {
  categories: any[];
  onSelect?: (category: any) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelect?.(cat)}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-lg font-semibold text-[var(--color-brand)]">
            {cat.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium mt-2 text-center truncate max-w-[6rem]">
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
