"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

const RateAppPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`You rated ${rating} stars.\nReview: ${review}`);
    setRating(0);
    setReview("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-yellow-500" />
          <h1 className="text-xl font-semibold text-gray-800">Rate Our App</h1>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Your feedback helps us improve. Please rate your experience with our app.
        </p>

        {/* Star Rating */}
        <div className="flex gap-2 mb-6">
          {stars.map((star) => (
            <Star
              key={star}
              className={`w-10 h-10 cursor-pointer transition-colors ${
                (hover || rating) >= star ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

        {/* Review Textarea */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Write your review (optional)..."
            className="w-full border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors active:scale-95"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default RateAppPage;
