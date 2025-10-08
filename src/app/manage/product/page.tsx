"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import Image from "next/image";

interface PreviewImage {
  id: string;
  url: string;
}

const CreateProductPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [images, setImages] = useState<PreviewImage[]>([]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    const newPreviews: PreviewImage[] = filesArray.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const imgToRemove = prev.find((i) => i.id === id);
      if (imgToRemove) URL.revokeObjectURL(imgToRemove.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleSubmit = () => {
    // For now, just log the product
    const newProduct = {
      title,
      description,
      stock,
      images: images.map((img) => img.url),
    };
    console.log("Product created:", newProduct);

    alert("Product created successfully!");
    router.push("/manage/products"); // Navigate back to product management page
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Create Product</h2>

      {/* Product Title */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter product title"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2] focus:border-transparent"
        />
      </div>

      {/* Product Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2] focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="0"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2] focus:border-transparent"
        />
      </div>

      {/* Product Images */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Images</label>
        <div className="flex flex-wrap gap-4">
          {images.map((imgObj) => (
            <div key={imgObj.id} className="relative w-32 h-32">
              {/* Image */}
              <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={imgObj.url}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Remove Button */}
              <button
                className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
                onClick={() => handleRemoveImage(imgObj.id)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#7e57c2] transition">
            <Plus className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-gray-400 text-sm">Upload</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => router.push("/manage/product")}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#7e57c2] text-white rounded-lg hover:bg-[#5d40a2] transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateProductPage;
