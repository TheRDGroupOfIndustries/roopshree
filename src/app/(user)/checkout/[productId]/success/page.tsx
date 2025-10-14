"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { IoArrowBackOutline } from "react-icons/io5";

// Icon for success (using inline SVG for simplicity and consistency)
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M9 11l3 3L22 4" />
  </svg>
);

// Mock order data for display purposes
const mockOrder = {
  id: "ORD-S6B2-20240915",
  date: new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  totalAmount: "₹999",
  paymentMethod: "UPI / Google Pay",
  estimatedDelivery: "3-4 working days",
};

{
  /* <div className="bg-white p-8 rounded-2xl shadow-xl mt-12 text-center animate-pulse">
  <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 mb-6" />

  <div className="h-8 w-2/3 mx-auto bg-gray-200 rounded-md mb-4" />
  <div className="h-4 w-4/5 mx-auto bg-gray-200 rounded-md mb-10" />

  <div className="border border-gray-200 bg-gray-50 p-4 rounded-xl mb-8">
    <div className="flex justify-between items-center mb-3">
      <div className="h-4 w-1/3 bg-gray-200 rounded" />
      <div className="h-4 w-1/4 bg-gray-300 rounded" />
    </div>
    <div className="flex justify-between items-center mb-3 border-t border-gray-100 pt-3">
      <div className="h-4 w-1/4 bg-gray-200 rounded" />
      <div className="h-4 w-1/5 bg-gray-300 rounded" />
    </div>
    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
      <div className="h-4 w-1/5 bg-gray-200 rounded" />
      <div className="h-4 w-1/4 bg-gray-300 rounded" />
    </div>
  </div>

  <div className="text-left mb-8 p-3 bg-gray-100 rounded-lg border border-gray-200">
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
    <div className="h-3 w-full bg-gray-200 rounded mb-1" />
    <div className="h-3 w-5/6 bg-gray-200 rounded" />
  </div>

  <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-200">
    <div className="h-6 w-1/3 bg-gray-200 rounded" />
    <div className="h-8 w-1/4 bg-gray-300 rounded" />
  </div>

  <div className="mt-8 space-y-4">
    <div className="w-full h-12 bg-gray-300 rounded-xl shadow-md" />
    <div className="w-full h-12 bg-gray-200 rounded-xl border border-gray-300" />
  </div>
</div>; */
}

const App = () => {
  const { id, date, totalAmount, paymentMethod, estimatedDelivery } = mockOrder;
  const [orderData, setOrderData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("orderData");
    if (data) setOrderData(JSON.parse(data));
    console.log("Order:", data);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header
        className="sticky top-0 bg-white flex justify-between items-center px-4 py-3 shadow-sm z-10"
        style={{ boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)" }}
      >
        {/* Back Button */}
        <button
          aria-label="Back"
          className="text-gray-600 text-xl flex-shrink-0"
          onClick={() => router.back()}
        >
          <IoArrowBackOutline size={20} />
        </button>
      </header>
      <div className="  font-sans p-4 sm:p-6 max-w-lg mx-auto">
        <div className="p-8 rounded-2xl shadow-xl mt-6 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 text-green-500 mb-6">
            <CheckCircleIcon className="w-full h-full" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Order Placed!
          </h1>
          <p className="text-gray-600 mb-8">
            Your order has been confirmed and is being prepared for shipment.
          </p>

          {/* Order Details Card */}
          <div className="border border-green-200 bg-green-50 p-4 rounded-xl mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Order ID:
              </span>
              <span className="text-sm font-bold text-green-700">
                {orderData?.orderId || id}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2 border-t border-green-100 pt-2">
              <span className="text-sm font-semibold text-gray-700">
                Order Date:
              </span>
              <span className="text-sm text-gray-600">
                {orderData?.orderDate
                  ? new Date(orderData.orderDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : date}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2 border-t border-green-100 pt-2">
              <span className="text-sm font-semibold text-gray-700">
                Payment:
              </span>
              <span className="text-sm text-gray-600">
                {orderData?.paymentMethod || paymentMethod}
              </span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="text-left mb-8 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="font-semibold text-amber-700 text-sm">
              Estimated Delivery:
            </p>
            <p className="text-xs text-amber-600 mt-1">
              You can expect your products within **{estimatedDelivery}**. We'll
              send tracking updates to your email.
            </p>
          </div>

          {/* Total Amount Summary */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-200">
            <span className="text-xl font-bold text-gray-800">Total Paid:</span>
            <span className="text-2xl font-extrabold text-red-600">
              ₹{orderData?.orderAmount || totalAmount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mt-10">
          <button
            className="w-full py-3 text-white font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 transition-colors shadow-md active:scale-[0.98]"
            onClick={() => router.push("/my-orders")}
          >
            View Order History
          </button>
          <button
            className="w-full py-3 text-amber-600 font-semibold rounded-xl bg-white border border-amber-600 hover:bg-amber-50 transition-colors active:scale-[0.98]"
            onClick={() => router.push("/home")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
