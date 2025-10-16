"use client";

import React, { useState } from "react";
import { Star, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

const RateAppPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating before submitting.");
      return;
    }
    alert(`Thank you for your feedback! You rated ${rating} stars.\nReview: ${review}`);
    setRating(0);
    setReview("");
    // In a real app, you would send this data to an API here.
  };

  // --- Header Component ---
  const Header = () => (
    <header className="sticky top-0  -white flex justify-between items-center px-4 sm:px-6 py-3 shadow-lg z-50 border-b border-gray-100">
      <button
        className="text-gray-700 hover:text-sky-600 transition-colors p-2 hover: -sky-50 rounded-full"
        onClick={() => window.history.back()}
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>
      <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center 
      ">
        Rate & Review App
      </h2>
      <Link href="/my-cart" aria-label="View shopping cart">
        <button className="relative text-gray-700 hover:text-sky-600 p-2 hover: -sky-50 rounded-full transition-colors">
          <ShoppingCart size={24} />
          <span className="absolute -top-1 -right-1  -red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            2
          </span>
        </button>
      </Link>
    </header>
  );

  // Helper text based on rating
  const getRatingText = (currentRating: number) => {
    switch (currentRating) {
      case 1:
        return "Terrible 😔";
      case 2:
        return "Poor 🙁";
      case 3:
        return "Average 🙂";
      case 4:
        return "Good 👍";
      case 5:
        return "Excellent! ⭐";
      default:
        return "Tap a star to rate";
    }
  };

  return (
    <div className="min-h-screen  -gray-50">
      {/* 1. Sticky Header (Moved outside the content wrapper) */}
      <Header />

      {/* 2. Main Content Wrapper */}
      <div className="px-4 sm:px-6 py-8 flex justify-center">
        <div className="w-full max-w-2xl  -white shadow-2xl rounded-xl p-8 md:p-10 text-center">
          
          <h1 className="text-3xl font-extrabold 
           mb-2">
            How was your experience?
          </h1>
          <p className="  text-lg mb-8 border-b pb-6 border-gray-100">
            Your honest feedback helps us improve.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-4">
              {stars.map((star) => (
                <Star
                  key={star}
                  className={`w-12 h-12 cursor-pointer transition-all duration-200 
                    ${(hover || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-100"}
                    hover:scale-110 active:scale-90`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
            
            <p className={`text-xl font-semibold transition-colors ${rating > 0 ? 'text-orange-500' : 'text-gray-500'}`}>
                {getRatingText(rating)}
            </p>

            {/* Review Textarea */}
            <textarea
              placeholder="Tell us what you loved or how we can improve (optional)..."
              className="w-full border border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 text-gray-700 placeholder-gray-400 transition-all"
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <button
              type="submit"
              disabled={rating === 0}
              className={`w-full py-3 rounded-xl  font-bold text-lg transition-all shadow-md ${
                rating === 0
                  ? " -gray-300   cursor-not-allowed"
                  : " -orange-500  bg-red-500 hover: -orange-600 active:scale-[0.99] "
              }`}
            >
              {rating === 0 ? "Select a Rating to Submit" : "Submit Feedback"}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default RateAppPage;