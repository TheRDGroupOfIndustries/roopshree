"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import Image from "next/image";

interface PreviewImage {
  id: string;
  url: string;
  file?: File;
  serverId?: string;
}

interface ProductFormProps {
  id?: string;
  mode?: "create" | "update";
  product?: any;
}

const ProductForm = ({ id, mode = "create", product }: ProductFormProps) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number>();
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<PreviewImage[]>([]);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const isUpdateMode = mode === "update" && !!id;

  const showMessage = (text: string, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 5000);
  };

  // Fetch product data for update mode
  useEffect(() => {
    if (!isUpdateMode || !product) return;

    setTitle(product.title || "");
    setDescription(product.description || "");
    setStock(product.stock?.currentStock || 0);

    if (product.images && product.images.length > 0) {
      const serverImages = product.images.map((img: any) => ({
        id: crypto.randomUUID(),
        url: typeof img === "string" ? img : img.url,
        serverId: typeof img === "string" ? img : img.url,
      }));
      setImages(serverImages);
    }
  }, [id, isUpdateMode, product]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
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

    // ✅ Update images array directly so validation works
    setImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove selected image
  const handleRemoveImage = (imgId: string) => {
    setImages((prev) => {
      const imgToRemove = prev.find((i) => i.id === imgId);
      if (imgToRemove?.file) URL.revokeObjectURL(imgToRemove.url);
      return prev.filter((i) => i.id !== imgId);
    });
  };

  // Upload images
  const uploadImages = async (productId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    const newFiles = images.filter((i) => i.file).map((i) => i.file as File);

    if (newFiles.length === 0) return uploadedUrls;

    const formData = new FormData();
    newFiles.forEach((file) => formData.append("files", file));
    formData.append("type", "product");
    formData.append("productId", productId);

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

    return uploadedUrls;
  };

  // CREATE
  const handleCreate = async () => {
    if (!title || !description || !stock || images.length === 0) {
      showMessage("Please fill all required fields and upload at least one image", true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          images: [],
          details: "Product details placeholder",
          insideBox: ["Item1", "Item2"],
          initialStock: stock,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || "Product creation failed", true);
        setLoading(false);
        return;
      }

      const productId = data.id || data.productId || data.product?.id;
      if (!productId) {
        showMessage("Product created but ID missing. Please refresh.", true);
        setLoading(false);
        return;
      }

      // Upload images
      const uploadedImageUrls = await uploadImages(productId);
      if (uploadedImageUrls.length === 0) {
        showMessage("Image upload failed. Please try again.", true);
        setLoading(false);
        return;
      }

      showMessage("Product created successfully!");
      setTimeout(() => router.push("/manage/products"), 1000);
    } catch (err) {
      console.error("Error:", err);
      showMessage("Something went wrong. Please try again.", true);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!title || !description || !stock || !id) {
      showMessage("Fill all required fields", true);
      return;
    }

    setLoading(true);
    try {
      const existingImages = images.filter((i) => i.serverId).map((i) => i.serverId!);
      const newImages = images.filter((i) => i.file);

      const payload = { title, description, stock, images: existingImages };
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showMessage(data.error || "Update failed", true);
        setLoading(false);
        return;
      }

      const productId = data.id || data.productId || data.product?.id;
      if (!productId) {
        showMessage("Product updated but ID missing. Please refresh.", true);
        setLoading(false);
        return;
      }

      if (newImages.length > 0) {
        const uploadedImageUrls = await uploadImages(productId);
        if (uploadedImageUrls.length === 0) {
          showMessage("Image upload failed. Please try again.", true);
          setLoading(false);
          return;
        }
      }

      showMessage("Product updated successfully!");
      setTimeout(() => router.push("/manage/products"), 1000);
    } catch (err) {
      console.error("Update error:", err);
      showMessage("Unexpected error", true);
    } finally {
      setLoading(false);
    }
  };

  // Main submit
  const handleSubmit = async () => {
    if (isUpdateMode) await handleUpdate();
    else await handleCreate();
  };

  // UI
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {isUpdateMode ? `Update Product: ${title}` : "Create Product"}
        </h2>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {message.text}
          </div>
        )}

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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7e57c2]"
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7e57c2]"
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
            value={stock || ""}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="0"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#7e57c2]"
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
                  <Image src={imgObj.url} alt="Preview" fill style={{ objectFit: "cover" }} />
                </div>
                <button
                  type="button"
                  className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
                  onClick={() => handleRemoveImage(imgObj.id)}
                  disabled={loading}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <label
              className={`w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition ${
                loading ? "border-gray-200 text-gray-400" : "border-gray-300 hover:border-[#7e57c2]"
              }`}
            >
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
            <p className="text-sm text-gray-500 mt-2">Please upload at least one product image</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={() => router.push("/manage")}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#7e57c2] text-white rounded-lg hover:bg-[#5d40a2] transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : isUpdateMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
