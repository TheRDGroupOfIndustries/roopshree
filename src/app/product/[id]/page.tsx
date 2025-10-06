"use client";
import { useState } from "react";
import { AiOutlineHeart, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import Image from "next/image";
import { IoArrowBackOutline, IoStarSharp } from "react-icons/io5";
import { RiTruckLine } from "react-icons/ri";
import { GoShareAndroid } from "react-icons/go";

interface Shade {
  id: number;
  color: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  totalReviews: number;
  badge?: string;
  cartQuantity: number;
  imageUrl: string;
  shades: Shade[];
  deliveryInfo: string;
  ingredients: string[];
  reviews: Review[];
}

export default function ProductDetails() {
  // ✅ In future you can fetch this via API call
  const [product] = useState<Product>({
    id: 1,
    title: "Luxury Foundation",
    description:
      "Perfect coverage for all skin types with 24-hour wear. Our premium luxury foundation provides flawless coverage with a natural finish.",
    price: 1299,
    originalPrice: 1599,
    discountPercent: 19,
    rating: 4.5,
    totalReviews: 128,
    badge: "New Arrival",
    imageUrl: "/images/image.png",
    shades: [
      { id: 1, color: "bg-yellow-300" },
      { id: 2, color: "bg-amber-200" },
      { id: 3, color: "bg-red-200" },
      { id: 4, color: "bg-pink-200" },
    ],
    deliveryInfo: "Free Delivery in 24 Hours across Varanasi",
    cartQuantity: 3,
    ingredients: ["Hyaluronic Acid", "Vitamin E", "SPF 30", "Natural Extracts"],
    reviews: [
      {
        id: 1,
        name: "Priya Sharma",
        rating: 5,
        comment:
          "Amazing foundation! Perfect coverage and lasts all day. Highly recommend for oily skin.",
      },
      {
        id: 2,
        name: "Anjali Gupta",
        rating: 5,
        comment:
          "Good quality foundation. The shade matches perfectly and delivery was quick.",
      },
    ],
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedShade, setSelectedShade] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleShadeSelect = (shadeId: number) => setSelectedShade(shadeId);
  const toggleDescription = () => setIsDescriptionExpanded((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header
        className="sticky top-0 bg-white flex justify-between items-center px-4 py-3 shadow-sm z-10"
        style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}
      >
        {/* Back Button */}
        <button
          aria-label="Back"
          className="text-gray-600 text-xl flex-shrink-0"
        >
          <IoArrowBackOutline />
        </button>

        {/* Title */}
        <h2 className="font-semibold text-lg text-center flex-1">
          Product Details
        </h2>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Share Button */}
          <button
            aria-label="Share"
            className="text-gray-600 text-xl hover:text-orange-500"
          >
            <GoShareAndroid />
          </button>

          {/* Cart Button */}
          <div className="relative">
            <button
              aria-label="View cart"
              className="text-gray-600 text-xl hover:text-orange-500"
            >
              <FiShoppingCart />
            </button>

            {product.cartQuantity > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center 
          text-[10px] font-bold text-white bg-orange-500 rounded-full 
          w-[16px] h-[16px]"
              >
                {product.cartQuantity}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Product Image */}
      <div className="relative w-full h-56 bg-white mt-2">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
        />
        <button
          aria-label="Add to wishlist"
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <AiOutlineHeart className="text-xl text-gray-600" />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex-1 bg-white px-3 py-6 shadow-sm my-2">
        {product.badge && (
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded text-xs font-medium">
            {product.badge}
          </span>
        )}

        <h1 className="text-2xl font-bold mt-3">{product.title}</h1>
        <p className="text-gray-500 mt-2">{product.description}</p>

        {/* Rating and Price */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <IoStarSharp
                key={i}
                className={`${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } text-lg`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
            <span className="text-sm text-gray-600 ml-1">
              ({product.totalReviews})
            </span>
          </div>

          <div className="flex gap-3 items-center">
            <h2 className="text-2xl font-bold text-orange-500">
              ₹{product.price}
            </h2>
            <span className="line-through text-gray-500 font-semibold">
              ₹{product.originalPrice}
            </span>
            <span className="bg-green-300 rounded px-2 py-1 text-xs font-medium">
              {product.discountPercent}% OFF
            </span>
          </div>

          <div className="p-3 bg-orange-200/50 border-2 border-orange-200  rounded-lg flex items-center gap-2 text-orange-800 ">
            <RiTruckLine className="text-xl font-bold" />
            <p className="text-sm font-semibold">{product.deliveryInfo}</p>
          </div>
        </div>
      </div>

      {/* Shades & Quantity */}
      <div className="flex-1 bg-white px-3 py-6 shadow-sm my-2">
        <h2 className="text-lg font-semibold mb-2">Select Shade</h2>
        <div className="flex space-x-2 mb-4" role="radiogroup">
          {product.shades.map((shade) => (
            <button
              key={shade.id}
              className={`w-10 h-10 ${shade.color} rounded-full border-2 ${
                selectedShade === shade.id
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleShadeSelect(shade.id)}
              role="radio"
              aria-checked={selectedShade === shade.id}
            />
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-2">Quantity</h2>
        <div className="flex items-center space-x-2 mb-4">
          <button
            className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center"
            onClick={handleDecrement}
            disabled={quantity === 1}
          >
            <AiOutlineMinus className="text-sm" />
          </button>
          <span className="text-lg">{quantity}</span>
          <button
            className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center"
            onClick={handleIncrement}
          >
            <AiOutlinePlus className="text-sm" />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 bg-white px-3 py-6 shadow-sm my-2">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-700 text-sm">
          {product.description}
          {isDescriptionExpanded && (
            <span>
              {" "}
              Additional details about the product can go here, such as
              application tips or certifications.
            </span>
          )}
        </p>
        <button
          className="text-orange-400 text-sm font-semibold "
          onClick={toggleDescription}
        >
          {isDescriptionExpanded ? "Read Less" : "Read More"}
        </button>
      </div>

      {/* Key Ingredients */}
      <div className="flex-1 bg-white px-3 py-6 shadow-sm my-2">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Key Ingredients
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm mb-6">
          {product.ingredients.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Reviews ({product.totalReviews})
          </h2>
          <a href="#" className="text-orange-600 text-sm font-medium">
            View All
          </a>
        </div>

        {product.reviews.map((review) => (
          <div key={review.id} className="mb-5">
            <div className="flex gap-3 items-center mb-1">
              <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-semibold flex items-center justify-center flex-shrink-0">
                {review.name.charAt(0)}
              </span>
              <p className="text-gray-800 text-sm font-semibold flex-1">
                {review.name}
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <IoStarSharp
                    key={i}
                    className={`${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    } text-sm`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Buttons */}
      <div
        className="fixed bottom-[60px] left-0 right-0 bg-white flex justify-between items-center p-4 z-50"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
          boxShadow: "0 -4px 6px -4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button className="flex items-center justify-center gap-2 w-[48%] py-3 bg-gray-200 rounded-xl font-medium hover:bg-gray-300 min-w-0">
          <FiShoppingCart className="text-lg flex-shrink-0" />
          <span className="truncate">Add to Cart</span>
        </button>
        <button className="flex items-center justify-center gap-2 w-[48%] py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-400 min-w-0">
          <FaBolt className="text-lg flex-shrink-0" />
          <span className="truncate">Buy Now</span>
        </button>
      </div>
    </div>
  );
}
