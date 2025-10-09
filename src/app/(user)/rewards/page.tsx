"use client";

import React, { useState } from "react";
import { Gift, Star, Tag } from "lucide-react";

const RewardsPage: React.FC = () => {
  const [points, setPoints] = useState(320);

  const rewards = [
    {
      id: 1,
      title: "₹100 OFF Coupon",
      description: "Use on any order above ₹999",
      pointsRequired: 100,
      expiry: "Expires on Oct 30, 2025",
      image: "/images/image.png",
    },
    {
      id: 2,
      title: "Free Shipping",
      description: "Valid for next 3 orders",
      pointsRequired: 150,
      expiry: "Expires on Nov 5, 2025",
      image: "/images/image.png",
    },
    {
      id: 3,
      title: "Exclusive Gift Box",
      description: "Special skincare trial kit",
      pointsRequired: 250,
      expiry: "Expires on Dec 1, 2025",
      image: "/images/image.png",
    },
  ];

  const handleRedeem = (pointsNeeded: number) => {
    if (points < pointsNeeded) {
      alert("Not enough points to redeem this reward!");
      return;
    }
    setPoints(points - pointsNeeded);
    alert("Reward redeemed successfully! 🎉");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10 lg:px-20">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Gift className="text-pink-500 w-6 h-6" />
        My Rewards & Gifts
      </h1>

      {/* Reward Points Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-gray-500 text-sm">Your Reward Points</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1 flex items-center gap-2">
            <Star className="text-yellow-400" />
            {points} pts
          </h2>
        </div>
        <button
          className="mt-4 sm:mt-0 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300"
          onClick={() => alert("Keep shopping to earn more points!")}
        >
          Earn More
        </button>
      </div>

      {/* Available Rewards Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Tag className="text-gray-500" />
          Available Gifts & Coupons
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all p-4 flex flex-col"
            >
              <img
                src={reward.image}
                alt={reward.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="text-gray-800 font-semibold">{reward.title}</h4>
              <p className="text-gray-500 text-sm mb-2">{reward.description}</p>
              <p className="text-xs text-gray-400 mb-3">{reward.expiry}</p>

              <div className="mt-auto flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">
                  {reward.pointsRequired} pts
                </p>
                <button
                  onClick={() => handleRedeem(reward.pointsRequired)}
                  className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
