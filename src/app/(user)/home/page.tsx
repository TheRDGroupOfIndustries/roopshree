"use client";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiHeart } from "react-icons/bi";
import ProductCard from "@/Components/ProductCard";
import TrendingCard from "@/Components/TrendingNow";
import Link from "next/link";
import { getAllProducts } from "@/services/productService";
import { useAuth } from "@/context/AuthProvider";
import { getAllCategories } from "@/services/categoryService";
import TrendingCardSkeleton from "@/Components/TrendingCardSkeleton";
import ProductCardSkeleton from "@/Components/ProductCardSkeleton";
import CategorySkeleton from "@/Components/CategorySkeleton";
import CategoryList from "@/Components/CategoryList";
export default function HomePage() {
  const { user, refreshUser } = useAuth();
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 45 * 60 + 27);
  const [products, setProducts] = useState<any[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const cartCount = user?.cart?.items?.length || 0;
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [shuffledProducts, setShuffledProducts] = useState<any[]>([]);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Shuffle products randomly for Trending Now
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductLoading(true);
        const res = await getAllProducts();
        console.log("Fetched Products:", res);
        setProducts(res);
        const shuffled = [...res].sort(() => Math.random() - 0.5);
        setShuffledProducts(shuffled);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const res = await getAllCategories();
        // console.log("Fetched Categories:", res);
        setCategories(res);
      } catch (error) {
        console.log("Error fetching categories:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* Sticky Top Area */}
      <div className="sticky top-0 z-20 bg-white shadow pb-1">
        <header className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-black">Roop Shree</h1>
          <div className="flex items-center gap-4">
            {/* Cart with Badge */}
            <div className="relative">
              <Link href={"/my-cart"}>
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-brand)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <Link href={"/wishlist"}>
              <BiHeart size={22} />
            </Link>
          </div>
        </header>

        <div className="flex items-center bg-gray-100 rounded-xl mx-4 mb-3 px-3 py-2">
          <AiOutlineSearch size={20} className="text-red-500" />
          <input
            type="text"
            placeholder="Search cosmetics..."
            className="flex-1 bg-transparent outline-none ml-3 text-sm"
          />
        </div>
      </div>

      <div className="pt-1">
        {/* Banner */}
        <div className="mx-4 rounded-2xl overflow-hidden relative">
          {/* Background image with orange tones */}
          <Image
            width={200}
            height={300}
            src="/images/image.png"
            alt="Faded orange background with soft gradient texture"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Semi-transparent orange overlay for faded effect */}
          <div className="absolute inset-0 bg-[var(--color-brand)]/20"></div>

          {/* Content container */}
          <div className="relative z-10 p-6 flex flex-col items-start">
            <h2 className="text-xl font-bold mb-2 text-white">
              24-Hour Delivery
            </h2>
            <p className="text-sm mb-4 text-white/90">
              Premium cosmetics delivered across Varanasi
            </p>
            <button className="px-4 py-2 bg-white text-[var(--color-brand)] rounded-lg text-sm font-semibold hover:bg-gray-200 hover:text-black transition-colors">
              Shop Now
            </button>
          </div>
        </div>

        {/* Categories */}
        {/* <div className="mt-6 px-4">
          <h3 className="font-semibold text-lg mb-3">Categories</h3>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide ">
            {categoryLoading ? (
              // 🔄 Loading placeholders
              <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center min-w-max animate-pulse"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded mt-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {categories.map((cat: any) => (
                  <div
                    key={cat.id}
                    className="flex flex-col items-center cursor-pointer "
                  >
                    <div className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-lg font-semibold text-[var(--color-brand)]">
                      {cat.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium mt-2 text-center truncate max-w-[6rem]">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> */}

<div className="mt-6 px-4">
  <h3 className="font-semibold text-lg mb-3">Categories</h3>
  <div className="flex gap-6 overflow-x-auto scrollbar-hide">
    {categoryLoading ? (
      <CategorySkeleton />
    ) : (
      <CategoryList categories={categories} />
    )}
  </div>
</div>

        {/* Flash Sale */}
        <div className="mx-4 mt-6 bg-gradient-to-r from-[var(--color-brand-hover)] to-[var(--color-brand)] text-white p-4 rounded-xl flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Flash Sale</h4>
            <p className="text-sm">Up to 50% off on selected items</p>
          </div>
          <div className="flex flex-col text-end">
            <span>End in</span>
            <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Featured Products */}

        <div className="mt-6 px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-900">
              Featured Products
            </h3>
            <button
              className="text-[var(--color-brand)] text-sm font-medium hover:text-[var(--color-brand-hover)]"
              onClick={() => setShowAllProducts(!showAllProducts)}
            >
              {showAllProducts ? "Show Less" : "View All"}
            </button>
          </div>

          {/* Product Grid */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : products.length > 0 ? (
              (showAllProducts ? products : products.slice(0, 2)).map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.title}
                    description={product.description}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    category={product.category}
                    image={
                      product.images?.[0] || "/images/placeholder_image.png"
                    }
                  />
                )
              )
            ) : (
              <p className="text-gray-500 text-sm col-span-full text-center">
                No products available
              </p>
            )}
          </div>
        </div>

        {/* Special Offers */}
        <div className="mt-6 px-4">
          <div className="mt-6 ">
            <h3 className="font-semibold text-lg">Special Offers</h3>
            <div className="bg-purple-100 rounded-xl p-4 flex justify-between items-center mt-2">
              <div>
                <p className="text-lg font-medium">Buy 2 Get 1 Free</p>
                <p className="text-xs text-gray-600">
                  On all skincare products
                </p>
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                Claim
              </button>
            </div>
            <div className="bg-orange-200/90 rounded-xl p-4 flex justify-between items-center mt-2">
              <div>
                <p className="text-lg font-medium">Free Delivery</p>
                <p className="text-xs text-gray-600">On orders above ₹999</p>
              </div>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Trending Now */}

        <div className="mt-6 relative px-4">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-bold text-xl text-gray-900">Trending Now</h3>
          </div>

          {/* Horizontal Scrollable Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {productLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TrendingCardSkeleton key={i} />
                ))
              : shuffledProducts.map((product) => (
                  <TrendingCard
                    key={product.id}
                    id={product.id}
                    name={product.title}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    image={
                      product.images?.[0] || "/images/placeholder_image.png"
                    }
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
