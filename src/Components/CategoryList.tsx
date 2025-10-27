"use client";
import Link from "next/link";
import React from "react";

interface CategoryListProps {
  categories: any[];
  onSelect?: (category: any) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onSelect,
}) => {
  return (
    <div className="px-3 sm:px-6 lg:px-10">
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/search?category=${encodeURIComponent(cat.name)}`}
            className="flex flex-col items-center cursor-pointer shrink-0 w-20 sm:w-24"
          >
            <div
              onClick={() => onSelect?.(cat)}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-md flex items-center justify-center text-base sm:text-lg font-semibold text-[var(--color-brand)] transition-all hover:scale-105">
                {cat.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium mt-2 text-center truncate max-w-[5rem] text-gray-400">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
