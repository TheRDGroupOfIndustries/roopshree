"use client";

import React, { useState } from "react";
import {
  Gift,
  Star,
  Tag,
  ArrowLeft,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    alert("🎉 Reward redeemed successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-4 shadow-md z-20 border-b border-gray-200">
        <button
          className="text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center text-gray-800">
          Super Rewards
        </h2>
        <Link href="/my-cart">
          <button className="relative text-gray-700 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              2
            </span>
          </button>
        </Link>
      </header>

      <div className="px-4 py-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
        {/* Points Card */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl p-8 mb-10 overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-yellow-300" size={24} />
                <p className="text-blue-100 text-sm font-medium">
                  Your SuperCoins Balance
                </p>
              </div>
              <h2 className="text-5xl sm:text-6xl font-extrabold flex items-center gap-3">
                <Star className="text-yellow-400 fill-yellow-400" size={40} />
                {points}
              </h2>
              <p className="text-blue-100 text-sm mt-2">
                Keep shopping to earn more rewards!
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="bg-white text-blue-700 px-6 py-3 rounded-full text-sm font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                onClick={() => alert("Keep shopping to earn more points!")}
              >
                <TrendingUp size={18} />
                Earn More Coins
              </button>
              <button
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white hover:text-blue-700 transition-all flex items-center justify-center gap-2"
                onClick={() => alert("Points History")}
              >
                <Gift size={18} />
                View History
              </button>
            </div>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-2 rounded-xl">
              <Tag className="text-white" size={24} />
            </div>
            Available Rewards
          </h3>
          <p className="text-gray-600">
            Redeem your points for exclusive deals and gifts
          </p>
        </div>

        {/* Available Rewards Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col"
            >
              <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                <Image
                  src={reward.image}
                  alt={reward.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h4 className="text-gray-800 font-semibold text-lg mb-1">
                {reward.title}
              </h4>
              <p className="text-gray-500 text-sm mb-1">
                {reward.description}
              </p>
              <p className="text-xs text-gray-400 mb-3">{reward.expiry}</p>

              <div className="mt-auto flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  {reward.pointsRequired} pts
                </p>
                <button
                  onClick={() => handleRedeem(reward.pointsRequired)}
                  className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
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
