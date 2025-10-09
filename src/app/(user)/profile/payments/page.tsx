"use client";
import Image from "next/image";
import React from "react";
import { CreditCard, Plus } from "lucide-react";

const PaymentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CreditCard className="text-gray-600 w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              Payment Methods
            </h1>
          </div>

          <button className="flex items-center gap-2 text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>

        {/* Saved Cards */}
        <div className="space-y-5">
          {/* Card 1 */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/visa.png"
                  fill
                  alt="Visa"
                  className="w-10 h-6 object-contain"
                ></Image>
                <p className="text-gray-800 font-medium">Visa •••• 3456</p>
              </div>
              <span className="text-xs text-gray-500">Expires 06/28</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <p>Card Holder: Priya Sharma</p>
              <div className="flex gap-3">
                <button className="hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/mastercard.png"
                  fill
                  alt="MasterCard"
                  className="w-10 h-6 object-contain"
                ></Image>
                <p className="text-gray-800 font-medium">
                  MasterCard •••• 7890
                </p>
              </div>
              <span className="text-xs text-gray-500">Expires 02/26</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <p>Card Holder: Priya Sharma</p>
              <div className="flex gap-3">
                <button className="hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          You have 2 saved cards.
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
