"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/Components/ProductCard";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  images: string[];
  video?: string | null;
  stock: number;
  reviews: { rating: number; comment: string }[];
  isSpotlight: boolean;
}

export default function SpotlightPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotlightProducts = async () => {
      try {
        const res = await fetch("/api/products/spotlight");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching spotlight products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlightProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white flex items-center px-4 py-3 shadow-sm z-10">
        <button
          onClick={() => router.back()}
          className="text-gray-600 text-xl mr-3"
        >
          <IoArrowBackOutline />
        </button>
        <h1 className="text-lg font-semibold">Spotlight Products</h1>
      </header>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No spotlight products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                description={product.description}
                price={product.price}
                oldPrice={product.oldPrice}
                image={product.images[0]}
                video={product.video}
                reviews={product.reviews}
                isSpotlight={true} // ✅ Important!
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}