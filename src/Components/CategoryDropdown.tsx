"use client";

import React, { useState, useEffect, useRef } from "react";

interface CategoryDropdownProps {
  onCategoryChange: (category: string) => void;
  disabled?: boolean;
  selectedCategory?: string; // The category coming from ProductForm (for update)
}

interface Category {
  id: string;
  name: string;
}

const CategoryDropdown = ({
  selectedCategory,
  onCategoryChange,
  disabled = false,
}: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalSelected, setInternalSelected] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal state with prop whenever selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      setInternalSelected(selectedCategory);
    }
  }, [selectedCategory]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/category");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();

      let cats: Category[] = [];

      if (Array.isArray(data)) {
        cats = data.map((cat: any, i: number) => ({
          id: cat.id || `cat-${i}`,
          name: String(cat.name || cat).trim(),
        }));
      } else if (data.categories && Array.isArray(data.categories)) {
        cats = data.categories.map((cat: any, i: number) => ({
          id: cat.id || `cat-${i}`,
          name: String(cat.name || cat).trim(),
        }));
      } else if (data.name && Array.isArray(data.name)) {
        cats = data.name.map((n: string, i: number) => ({
          id: `cat-${i}`,
          name: String(n).trim(),
        }));
      }

      cats = cats.filter(cat => cat.name.length > 0);
      setCategories(cats);

      // Initialize selection if nothing is selected
      if (!internalSelected && cats.length > 0) {
        setInternalSelected(cats[0].name);
        onCategoryChange(cats[0].name);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      alert("Failed to load categories. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    const trimmedCat = newCat.trim();
    if (!trimmedCat) return alert("Enter category name");
    if (trimmedCat.length < 2) return alert("Category must be at least 2 characters");
    if (categories.some(cat => cat.name.toLowerCase() === trimmedCat.toLowerCase())) {
      return alert("This category already exists!");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedCat }),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || "Failed to add category");

      await fetchCategories();

      setInternalSelected(trimmedCat);
      onCategoryChange(trimmedCat);

      setNewCat("");
      setIsOpen(false);
      alert("Category added successfully!");
    } catch (err: any) {
      console.error("Error adding category:", err);
      alert(err.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleCategorySelect = (catName: string) => {
    setInternalSelected(catName);
    onCategoryChange(catName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`w-full p-3 border rounded-lg text-left ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-white hover:border-[#7e57c2] focus:ring-2 focus:ring-[#fcd34d] focus:outline-none"
        } ${!internalSelected && !loading ? "text-gray-400" : "text-gray-900"}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {loading ? "Loading categories..." : internalSelected || "Select category"}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {categories.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No categories available. Add one below!
            </div>
          ) : (
            <div className="py-1">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-amber-100 transition ${
                    internalSelected === cat.name
                      ? "bg-amber-50 font-semibold text-zinc-700"
                      : "text-gray-900"
                  }`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}

          <div className="border-t p-3 bg-gray-50">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add new category"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-[#fcd34d] focus:outline-none"
                disabled={loading}
                maxLength={50}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className={`px-4 py-2 rounded text-white font-medium transition ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"
                }`}
                disabled={loading}
              >
                {loading ? "..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
