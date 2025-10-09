"use client";

import React from "react";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  features: string[];
  color: string;
  buttonColor: string;
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: "₹499 / month",
    features: ["Free delivery", "Access to basic products", "Standard support"],
    color: "bg-blue-100 text-blue-800",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "Standard",
    price: "₹999 / month",
    features: ["Free delivery", "Early access", "Extra rewards", "Priority support"],
    color: "bg-purple-100 text-purple-800",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
  {
    name: "Premium",
    price: "₹1499 / month",
    features: ["All Standard features", "Exclusive offers", "Personal concierge"],
    color: "bg-pink-100 text-pink-800",
    buttonColor: "bg-pink-600 hover:bg-pink-700",
  },
];

const UpgradePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
        Choose Your Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`flex flex-col p-6 rounded-2xl shadow-lg ${plan.color} transition-transform hover:scale-105`}
          >
            {/* Plan Name */}
            <h2 className="text-xl md:text-2xl font-bold mb-4">{plan.name}</h2>

            {/* Price */}
            <p className="text-lg md:text-xl font-semibold mb-6">{plan.price}</p>

            {/* Features */}
            <ul className="flex-1 space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm md:text-base">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`w-full py-3 text-white font-semibold rounded-xl ${plan.buttonColor} transition-colors active:scale-95`}
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpgradePage;
