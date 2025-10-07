"use client";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiHeart, BiPlus } from "react-icons/bi";
import ProductCard from "@/Components/ProductCard";
import TrendingCard from "@/Components/TrendingNow";
import Link from "next/link";
export default function HomePage() {
  const cartCount = 3;
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 45 * 60 + 27);

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

  const categories = [
    { name: "Skincare", img: "/images/image.png" },
    { name: "Makeup", img: "/images/image.png" },
    { name: "Hair Care", img: "/images/image.png" },
    { name: "Fragrance", img: "/images/image.png" },
    { name: "Accessories", img: "/images/image.png" },
  ];

  const products = [
    {
      id: 1,
      name: "Luxury Foundation",
      description: "Perfect coverage for all skin types",
      price: "₹1,299",
      oldPrice: "₹1,599",
      image: "/images/image.png",
      badge: "New",
      badgeColor: "bg-orange-400",
      rating: 4,
    },
    {
      id: 2,
      name: "Luxury Foundation",
      description: "Perfect coverage for all skin types",
      price: "₹1,299",
      oldPrice: "₹1,599",
      image: "/images/image.png",
      badge: "Sale",
      badgeColor: "bg-red-600",
      rating: 5,
    },
    {
      id: 3,
      name: "Luxury Foundation",
      description: "Perfect coverage for all skin types",
      price: "₹1,299",
      oldPrice: "₹1,599",
      image: "/images/image.png",
      badge: "Best Seller",
      badgeColor: "bg-green-600",
      rating: 4,
    },
    {
      id: 4,
      name: "Luxury Foundation",
      description: "Perfect coverage for all skin types",
      price: "₹1,299",
      oldPrice: "₹1,599",
      image: "/images/image.png",
      badge: "",
      badgeColor: "",
      rating: 5,
    },
  ];

  const trendingProducts = [
    {
      id: 1,
      name: "Moisturizer",
      price: "₹799",
      image: "/images/image.png",
    },
    {
      id: 2,
      name: "Lipstick",
      price: "₹499",
      image: "/images/image.png",
    },
    {
      id: 3,
      name: "Perfume",
      price: "₹1299",
      image: "/images/image.png",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* Sticky Top Area */}
      <div className="sticky top-0 z-20 bg-white shadow pb-1">
        <header className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-black">Roop Shree</h1>
          <div className="flex items-center gap-4">
            {/* Cart with Badge */}
            <div className="relative">
              <Link href={"/cart"}>
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-brand)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <Link href={"/Wishlist"}>
              <BiHeart size={22} />
            </Link>
            <FiUser size={22} />
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
        <div className="mt-6 px-4">
          <h3 className="font-semibold text-lg mb-3">Categories</h3>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide ">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col items-center min-w-max"
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="object-contain rounded-full"
                  />
                </div>
                <span className="text-sm mt-1 truncate max-w-[5rem] text-center">
                  {cat.name}
                </span>
              </div>
            ))}
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
            <button className="text-[var(--color-brand)] text-sm font-medium hover:text-[var(--color-brand-hover)]">
              View All
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
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
            {trendingProducts.map((product) => (
              <TrendingCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
