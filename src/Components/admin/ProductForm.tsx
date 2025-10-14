"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import Image from "next/image";
import CategoryDropdown from "@/Components/CategoryDropdown";

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
  const [items, setItems] = useState<string[]>([""]); // initial input

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);

    // If typing in the last box and it has value, add a new empty box
    if (index === items.length - 1 && value.trim() !== "") {
      setItems([...newItems, ""]);
    }
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length ? newItems : [""]);
  };

  // Product form
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [oldPrice, setOldPrice] = useState<number>();
  const [exclusive, setExclusive] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const isUpdateMode = mode === "update" && !!id;

  const showMessage = (text: string, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 5000);
  };

  // Populate fields for update
  useEffect(() => {
    if (!isUpdateMode || !product) return;

    setTitle(product.title || "");
    setDetails(product.details || "");
    setDescription(product.description || "");
    setStock(product.stock?.currentStock || 0);
    setPrice(product.price || 0);
    setOldPrice(product.oldPrice || 0);
    setExclusive(product.exclusive || undefined);
    setCategory(product.category || "");
    setItems(product.insideBox?.length ? product.insideBox : [""]);

    if (product.images?.length) {
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
      images.forEach((img) => img.file && URL.revokeObjectURL(img.url));
    };
  }, [images]);

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

  const handleRemoveImage = (imgId: string) => {
    setImages((prev) => {
      const imgToRemove = prev.find((i) => i.id === imgId);
      if (imgToRemove?.file) URL.revokeObjectURL(imgToRemove.url);
      return prev.filter((i) => i.id !== imgId);
    });
  };

  const uploadImages = async (productId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    const newFiles = images.filter((i) => i.file).map((i) => i.file as File);
    if (!newFiles.length) return uploadedUrls;

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
    if (res.ok && (data.urls?.length || data.url)) {
      if (data.urls?.length) uploadedUrls.push(...data.urls);
      else if (data.url) uploadedUrls.push(data.url);
    } else {
      throw new Error(data.error || "Image upload failed");
    }

    return uploadedUrls;
  };

  // CREATE product
  const handleCreate = async () => {
    if (
      !title ||
      !description ||
      !stock ||
      !price ||
      !oldPrice ||
      !category ||
      images.length === 0
    ) {
      showMessage(
        "Please fill all required fields and upload at least one image",
        true
      );
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
          images: [], // Upload separately
          details,
          insideBox: items.filter(i => i.trim() !== ""),
          initialStock: stock,
          price,
          oldPrice,
          exclusive: exclusive || undefined,
          category,
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

      const uploadedImageUrls = await uploadImages(productId);
      if (!uploadedImageUrls.length) {
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

  // UPDATE product
  const handleUpdate = async () => {
    if (
      !title ||
      !description ||
      !stock ||
      !price ||
      !oldPrice ||
      !id ||
      !category
    ) {
      showMessage("Fill all required fields", true);
      return;
    }

    setLoading(true);
    try {
      const existingImages = images
        .filter((i) => i.serverId)
        .map((i) => i.serverId!);
      const newImages = images.filter((i) => i.file);

      const payload = {
        title,
        description,
        stock,
        images: existingImages,
        price,
        oldPrice,
        exclusive,
        category,
        details,
        insideBox: items.filter(i => i.trim() !== ""),
      };

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

      if (newImages.length > 0) await uploadImages(productId);

      showMessage("Product updated successfully!");
      setTimeout(() => router.push("/manage/products"), 1000);
    } catch (err) {
      console.error("Update error:", err);
      showMessage("Unexpected error", true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isUpdateMode) await handleUpdate();
    else await handleCreate();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-8">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100 space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {isUpdateMode ? `Update Product: ${title}` : "Create Product"}
        </h2>

        {message && (
          <div
            className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
              message.isError
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter product title"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base outline-none border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
            disabled={loading}
          />
        </div>

        {/* sub title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
            SubTitle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter product subtitle"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base outline-none border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="w-full outline-none p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0"
              className="w-full outline-none p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
              disabled={loading}
            />
          </div>

          {/* Old Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Old Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={oldPrice || ""}
              onChange={(e) => setOldPrice(Number(e.target.value))}
              placeholder="0"
              className="w-full outline-none p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
              disabled={loading}
            />
          </div>

          {/* Exclusive */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Exclusive
            </label>
            <input
              type="number"
              value={exclusive || ""}
              onChange={(e) =>
                setExclusive(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Optional"
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base outline-none border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
              disabled={loading}
            />
          </div>
        </div>

        {/* Stock */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
          {/* Stock Input */}
          <div className="flex-1 flex flex-col">
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={stock || ""}
              onChange={(e) => setStock(Number(e.target.value))}
              placeholder="0"
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base outline-none border rounded-lg focus:ring-2 focus:ring-[#fcd34d]"
              disabled={loading}
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex-1 flex flex-col">
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Category <span className="text-red-500">*</span>
            </label>
            <CategoryDropdown
              selectedCategory={category}
              onCategoryChange={setCategory}
              disabled={loading}
            />
          </div>
        </div>

        {/* inside box */}
        <div className="space-y-2">
          {/* Single label at the top */}
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Inside box <span className="text-red-500">*</span>
          </label>

          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3"
            >
              <input
                type="text"
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Enter something..."
                className="flex-1 outline-none p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border focus:ring-2 focus:ring-[#fcd34d]"
              />
              {items.length > 1 && (
                <button
                  onClick={() => handleRemove(index)}
                  className="text-red-500 font-bold px-3 py-2 text-sm sm:text-base border rounded-lg hover:bg-red-200 whitespace-nowrap"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Images */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Images <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {images.map((imgObj) => (
              <div key={imgObj.id} className="relative w-24 h-24 sm:w-32 sm:h-32">
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
                  className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
                  onClick={() => handleRemoveImage(imgObj.id)}
                  disabled={loading}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <label
              className={`w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition ${
                loading
                  ? "border-gray-200 text-gray-400"
                  : "border-gray-300 hover:border-[#fcd34d]"
              }`}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mb-1" />
              <span className="text-gray-400 text-xs sm:text-sm">Upload</span>
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
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Please upload at least one product image
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-2 sm:pt-4">
          <button
            type="button"
            onClick={() => router.push("/manage")}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
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