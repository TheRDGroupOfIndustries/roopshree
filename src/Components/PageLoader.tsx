"use client";
import React from "react";

const PageLoader = () => {
  return (
    <div className="bg-gray-50 font-sans p-4 sm:p-6 max-w-lg mx-auto animate-pulse">
      {/* Product Item Placeholder */}
      <div className="flex p-4 bg-white rounded-xl shadow-sm mb-6 items-center">
        <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 mr-4" />
        <div className="flex-grow space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
          <div className="h-4 w-1/4 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Delivery Address Placeholder */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="h-5 w-1/3 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-3 bg-gray-100 rounded-lg space-y-2">
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-4/5 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Placeholder */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 space-y-3">
        <div className="h-5 w-1/3 bg-gray-200 rounded mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-1/5 bg-gray-100 rounded" />
            <div className="h-3 w-1/6 bg-gray-200 rounded" />
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
          <div className="h-5 w-1/5 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Payment Methods Placeholder */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-8 space-y-4">
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-gray-100 rounded-xl" />
        ))}
      </div>

      {/* Place Order Button Placeholder */}
      <div className="w-full h-14 bg-gray-300 rounded-xl shadow-lg" />
    </div>
  );
};

export default PageLoader;
