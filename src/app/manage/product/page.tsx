"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import Image from "next/image";

interface PreviewImage {
  id: string;
  url: string;
  file?: File;
}

const CreateProductPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [loading, setLoading] = useState(false);

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
      file,
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

  // Upload images using your server API (with productId)
  const uploadImages = async (productId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const img of images) {
      if (!img.file) continue;

      const formData = new FormData();
      formData.append("files", img.file);
      formData.append("type", "product");
      formData.append("productId", productId); // ✅ Now we have productId!

      const res = await fetch("/api/upload-images", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.urls && data.urls.length > 0) {
        uploadedUrls.push(...data.urls);
      } else if (res.ok && data.url) {
        uploadedUrls.push(data.url);
      } else {
        console.error("Upload failed:", data);
        throw new Error(data.error || "Image upload failed");
      }
    }

    return uploadedUrls;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!title || !description || !stock || images.length === 0) {
      alert("Please fill all required fields and upload at least one image");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create product WITHOUT images first
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          images: [], // Empty initially
          details: "Product details placeholder",
          insideBox: ["Item1", "Item2"],
          initialStock: stock,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Product creation failed:", data);
        alert(data.error || "Product creation failed");
        setLoading(false);
        return;
      }

      // Make sure we have a product ID
      const productId = data.id || data.productId || data.product?.id;
      
      if (!productId) {
        console.error("No product ID returned:", data);
        alert("Product created but ID missing. Please refresh the page.");
        setLoading(false);
        return;
      }

      // 2️⃣ Upload images with the productId
      const uploadedImageUrls = await uploadImages(productId);
      
      if (uploadedImageUrls.length === 0) {
        alert("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }

      // 3️⃣ Success! Navigate to manage page
      alert("Product created successfully!");
      router.push("/manage");
      
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Create Product</h2>

      {/* Title */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter product title"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2] focus:border-transparent"
          disabled={loading}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2] focus:border-transparent"
          rows={4}
          disabled={loading}
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Stock <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="0"
          min="0"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2] focus:border-transparent"
          disabled={loading}
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Images <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-4">
          {images.map((imgObj) => (
            <div key={imgObj.id} className="relative w-32 h-32">
              <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={imgObj.url}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <button
                type="button"
                className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition"
                onClick={() => handleRemoveImage(imgObj.id)}
                disabled={loading}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#7e57c2] transition">
            <Plus className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-gray-400 text-sm">Upload</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={loading}
            />
          </label>
        </div>
        {images.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Please upload at least one product image
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.push("/app/manage")}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#7e57c2] text-white rounded-lg hover:bg-[#5d40a2] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default CreateProductPage;