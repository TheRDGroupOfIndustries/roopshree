"use client";

import React from "react";
import { Check, ArrowLeft, ShoppingCart, TrendingUp } from "lucide-react"; // Added TrendingUp for the main icon and Check
import Link from "next/link"; // Ensure Link is imported

// Plan interface and data definition
interface Plan {
  name: string;
  price: string;
  features: string[];
  color: string;
  buttonColor: string;
  isPopular: boolean; // Added to highlight one plan
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: "₹499 / month",
    features: [
      "Free standard delivery (3-5 days)",
      "Access to basic product range",
      "Standard email support",
      "Monthly exclusive coupon"
    ],
    color: "bg-gray-50 border-2 border-gray-200",
    buttonColor: "bg-gray-800 hover:bg-gray-700",
    isPopular: false,
  },
  {
    name: "Standard",
    price: "₹999 / month",
    features: [
      "Guaranteed free express delivery (1-2 days)",
      "Early access to new launches (48h)",
      "1.5x Extra reward points",
      "Priority customer support",
      "Dedicated account manager",
    ],
    color: "bg-sky-50 border-2 border-sky-600",
    buttonColor: "bg-sky-600 hover:bg-sky-700",
    isPopular: true,
  },
  {
    name: "Premium",
    price: "₹1499 / month",
    features: [
      "All Standard features",
      "Exclusive seasonal collections",
      "Personal concierge service",
      "Free gift wrapping on all orders",
      "VIP invitation to brand events"
    ],
    color: "bg-pink-50 border-2 border-pink-500",
    buttonColor: "bg-pink-600 hover:bg-pink-700",
    isPopular: false,
  },
];

// Reusable Header Component
const Header = () => (
  <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-3 shadow-lg z-50 border-b border-gray-100">
    <button
      className="text-gray-700 hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-full"
      onClick={() => window.history.back()}
      aria-label="Go back"
    >
      <ArrowLeft size={24} />
    </button>
    <h2 className="font-bold text-xl sm:text-2xl flex-1 text-center text-gray-800">
      Subscription Plans
    </h2>
    <Link href="/my-cart" aria-label="View shopping cart">
      <button className="relative text-gray-700 hover:text-sky-600 p-2 hover:bg-sky-50 rounded-full transition-colors">
        <ShoppingCart size={24} />
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          2
        </span>
      </button>
    </Link>
  </header>
);

const UpgradePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sticky Header */}
      <Header />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <TrendingUp className="w-10 h-10 text-sky-600 mx-auto mb-3" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Unlock Premium Benefits
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan to enhance your shopping experience with exclusive access, faster delivery, and personalized service.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col p-8 rounded-2xl shadow-xl transition-all duration-300 transform 
                ${plan.isPopular ? 'scale-105 ring-4 ring-sky-300 shadow-2xl z-10' : 'hover:shadow-2xl hover:scale-[1.02]'} 
                ${plan.color} text-gray-800`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-sky-600 text-white text-xs font-bold uppercase rounded-full shadow-lg rotate-3">
                    Recommended
                  </div>
                )}
                
                {/* Plan Name */}
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-sm font-medium uppercase opacity-75">Membership Plan</p>

                {/* Price */}
                <p className="mt-4 pb-6 border-b border-gray-300">
                  <span className="text-4xl font-extrabold">{plan.price.split(' ')[0]}</span>
                  <span className="text-lg font-medium text-gray-600"> {plan.price.split(' ')[1]}</span>
                </p>

                {/* Features */}
                <ul className="flex-1 space-y-3 mt-6 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-base">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all duration-200 
                  ${plan.buttonColor} active:scale-[0.98] mt-auto`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
          
          {/* Disclaimer */}
          <p className="text-center text-sm text-gray-500 mt-12">
            *All subscriptions renew monthly. Cancel anytime through your account settings. Prices include all applicable taxes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
