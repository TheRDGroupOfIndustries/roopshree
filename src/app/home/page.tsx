"use client";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiHeart, BiPlus } from "react-icons/bi";

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

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* Sticky Top Area */}
      <div className="sticky top-0 z-20 bg-white shadow pb-1">
        <header className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-black">Roop Shree</h1>
          <div className="flex items-center gap-4">
            {/* Cart with Badge */}
            <div className="relative">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <FiUser size={22} />
          </div>
        </header>

        <div className="flex items-center bg-gray-100 rounded-xl mx-4 mb-3 px-3 py-2">
          <AiOutlineSearch size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search cosmetics..."
            className="flex-1 bg-transparent outline-none ml-3 text-sm"
          />
        </div>
      </div>

      {/* Main Scrollable Content */}
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
          <div className="absolute inset-0 bg-orange-400/30"></div>

          {/* Content container */}
          <div className="relative z-10 p-6 flex flex-col items-start">
            <h2 className="text-xl font-bold mb-2 text-white">
              24-Hour Delivery
            </h2>
            <p className="text-sm mb-4 text-white/90">
              Premium cosmetics delivered across Varanasi
            </p>
            <button className="px-4 py-2 bg-white text-orange-500 rounded-lg text-sm font-semibold hover:bg-gray-200 hover:text-black transition-colors">
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
        <div className="mx-4 mt-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white p-4 rounded-xl flex justify-between items-center">
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-900">
              Featured Products
            </h3>
            <button className="text-orange-600 text-sm font-medium hover:text-orange-700">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Product Card 1 - New */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Image Section with Badges */}
              <div className="relative">
                {/* New Badge */}
                <span className="absolute top-2 left-2 bg-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                  New
                </span>
                {/* Wishlist Icon */}
                <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-50">
                  <BiHeart className="w-4 h-4 text-gray-600" />
                </button>

                {/* Product Image */}
                <div className="w-full flex items-center justify-center h-auto">
                  <Image
                    src="/images/image.png"
                    alt="Luxury Foundation"
                    width={0} 
                    height={0}
                    sizes="100vw" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-3">
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  Luxury Foundation
                </h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  Perfect coverage for all skin types
                </p>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹1,299
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹1,599
                    </span>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2 shadow-md transition-colors">
                    <BiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 - Sale */}
             <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Image Section with Badges */}
              <div className="relative">
                {/* New Badge */}
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                  Sale
                </span>
                {/* Wishlist Icon */}
                <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-50">
                  <BiHeart className="w-4 h-4 text-gray-600" />
                </button>

                {/* Product Image */}
                <div className="w-full flex items-center justify-center h-auto">
                  <Image
                    src="/images/image.png"
                    alt="Luxury Foundation"
                    width={0}
                    height={0}
                    sizes="100vw" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-3">
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  Luxury Foundation
                </h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  Perfect coverage for all skin types
                </p>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹1,299
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹1,599
                    </span>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2 shadow-md transition-colors">
                    <BiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
             <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Image Section with Badges */}
              <div className="relative">
                {/* New Badge */}
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                  Best Seller
                </span>
                {/* Wishlist Icon */}
                <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-50">
                  <BiHeart className="w-4 h-4 text-gray-600" />
                </button>

                {/* Product Image */}
                <div className="w-full flex items-center justify-center h-auto">
                  <Image
                    src="/images/image.png"
                    alt="Luxury Foundation"
                    width={0}
                    height={0}
                    sizes="100vw" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-3">
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  Luxury Foundation
                </h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  Perfect coverage for all skin types
                </p>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹1,299
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹1,599
                    </span>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2 shadow-md transition-colors">
                    <BiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
             <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Image Section with Badges */}
              <div className="relative">
            

                {/* Wishlist Icon */}
                <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-50">
                  <BiHeart className="w-4 h-4 text-gray-600" />
                </button>

                {/* Product Image */}
                <div className="w-full flex items-center justify-center h-auto">
                  <Image
                    src="/images/image.png"
                    alt="Luxury Foundation"
                    width={0}
                    height={0}
                    sizes="100vw" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-3">
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  Luxury Foundation
                </h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  Perfect coverage for all skin types
                </p>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹1,299
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹1,599
                    </span>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2 shadow-md transition-colors">
                    <BiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

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

          <div className="mt-6 relative">
            {/* Header */}
            <div className="mb-4">
              <h3 className="font-bold text-xl text-gray-900">Trending Now</h3>
            </div>

            {/* Horizontal Scrollable Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[
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
              ].map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[140px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative w-full h-28">
                    {/* Wishlist Icon */}
                    <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 z-10">
                      <BiHeart className="w-3.5 h-3.5 text-gray-600" />
                    </button>

                    {/* Product Image */}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="140px"
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Product Info Section */}
                  <div className="p-2">
                    <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">
                      {product.name}
                    </h4>

                    {/* Price and Add Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-orange-400">
                        {product.price}
                      </span>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-1.5 shadow-sm transition-colors">
                        <BiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
