// // product/[id]/page.tsx
// "use client";

import ProductForm from "@/Components/admin/ProductForm";
import prisma from "@/lib/prisma";

// import React, { useState, ChangeEvent, useEffect } from "react";
// import { X, Plus } from "lucide-react";
// import { useRouter } from "next/navigation";

// // --- Types ---
// interface PreviewImage {
//   id: string;
//   url: string;
//   file?: File;
//   serverId?: string;
// }

// // Props from Next.js app router
// interface PageProps {
//   params: { id: string };
// }

// // Your page component
// const UpdateProductPage = async ({ params }: PageProps) => {
//   const router = useRouter();
//   const {id:productId} = await params; // ✅ dynamic product ID

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [stock, setStock] = useState<number>(0);
//   const [images, setImages] = useState<PreviewImage[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

//   const showMessage = (text: string, isError = false) => {
//     setMessage({ text, isError });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   // Fetch product data
//   useEffect(() => {
//     if (!productId) return;

//     const fetchProduct = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/products/${productId}`);
//         if (!res.ok) return showMessage("Failed to fetch product", true);

//         const data = await res.json();
//         console.log("Product:", data)
//         const product = data.product || data;

//         setTitle(product.title || "");
//         setDescription(product.description || "");
//         setStock(product.stock || 0);

//         if (product.images && product.images.length > 0) {
//           const serverImages = product.images.map((img: any) => ({
//             id: Math.random().toString(),
//             url: typeof img === "string" ? img : img.url,
//             serverId: typeof img === "string" ? img : img.url,
//           }));
//           setImages(serverImages);
//         }
//       } catch (err) {
//         console.error(err);
//         showMessage("Network error while fetching product", true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   // Cleanup object URLs
//   useEffect(() => {
//     return () => {
//       images.forEach((img) => img.file && URL.revokeObjectURL(img.url));
//     };
//   }, []);

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//     const newPreviews: PreviewImage[] = Array.from(e.target.files).map((file) => ({
//       id: Math.random().toString(),
//       url: URL.createObjectURL(file),
//       file,
//     }));
//     setImages((prev) => [...prev, ...newPreviews]);
//   };

//   const handleRemoveImage = (id: string) => {
//     setImages((prev) =>
//       prev.filter((img) => {
//         if (img.id === id && img.file) URL.revokeObjectURL(img.url);
//         return img.id !== id;
//       })
//     );
//   };

//   const handleSubmit = async () => {
//     if (!title || !description || !stock) return showMessage("Fill all fields", true);
//     if (!productId) return showMessage("Product ID missing", true);

//     setLoading(true);

//     try {
//       const existingImages = images.filter((i) => i.serverId).map((i) => i.serverId!);

//       if (images.length > 0 && existingImages.length === 0) {
//         showMessage("New image files need to be uploaded separately", true);
//         setLoading(false);
//         return;
//       }

//       const payload = { title, description, stock, images: existingImages };
//       const res = await fetch(`/api/product/${productId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) return showMessage(data.error || "Update failed", true);

//       showMessage("Product updated successfully!");
//       setTimeout(() => router.push("/manage"), 100);
//     } catch (err) {
//       console.error(err);
//       showMessage("Unexpected error", true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
//       <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-2xl border border-gray-100 space-y-6">
//         <h2 className="text-3xl font-bold text-gray-800">Update Product (ID: {title})</h2>

//         {message && (
//           <div className={`p-4 rounded-lg ${message.isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//             {message.text}
//           </div>
//         )}

//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Title *</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2]"
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Description *</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={4}
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2]"
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-1">Stock *</label>
//           <input
//             type="number"
//             value={stock}
//             onChange={(e) => setStock(Number(e.target.value))}
//             min={0}
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e57c2]"
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Images *</label>
//           <div className="flex flex-wrap gap-4">
//             {images.map((img) => (
//               <div key={img.id} className="relative w-32 h-32">
//                 <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
//                   <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveImage(img.id)}
//                   className="absolute -top-3 -right-3 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center"
//                   disabled={loading}
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </div>
//             ))}

//             <label className={`w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${loading ? 'border-gray-200 text-gray-400' : 'border-gray-300 hover:border-[#7e57c2]'}`}>
//               <Plus className="w-6 h-6 text-gray-400 mb-1" />
//               <span className="text-gray-400 text-sm">Upload</span>
//               <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
//             </label>
//           </div>
//         </div>

//         <div className="flex justify-end gap-4 pt-4">
//           <button onClick={() => router.push("/manage")} className="px-6 py-2 bg-gray-100 rounded-lg" disabled={loading}>Cancel</button>
//           <button onClick={handleSubmit} className="px-6 py-2 bg-[#7e57c2] text-white rounded-lg" disabled={loading}>
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateProductPage;


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const product = await prisma.products.findFirst({
    where: {
      id: id,
    },
    include: {
      stock: true,
    },
  })
  console.log("server product: ", product)
  return (
    <ProductForm id={id} mode="update" product={product} />
  );
};

