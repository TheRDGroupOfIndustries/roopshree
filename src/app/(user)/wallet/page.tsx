"use client";

import React, { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(1250.75);

  const transactions = [
    {
      id: 1,
      title: "Order #2546",
      type: "debit",
      amount: 499.0,
      date: "Oct 6, 2025",
    },
    {
      id: 2,
      title: "Refund from Order #2532",
      type: "credit",
      amount: 299.0,
      date: "Oct 3, 2025",
    },
    {
      id: 3,
      title: "Added to Wallet",
      type: "credit",
      amount: 1000.0,
      date: "Sep 30, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10 lg:px-20">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Wallet</h1>

      {/* Wallet Balance Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-gray-500 text-sm">Available Balance</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            ₹{balance.toFixed(2)}
          </h2>
        </div>
        <button
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300"
          onClick={() => setBalance(balance + 100)}
        >
          <FiPlusCircle size={18} />
          Add Money
        </button>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Transactions
        </h3>

        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      tx.type === "credit"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <AiOutlineArrowDown size={18} />
                    ) : (
                      <AiOutlineArrowUp size={18} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{tx.title}</p>
                    <p className="text-gray-400 text-xs">{tx.date}</p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    tx.type === "credit"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center text-sm py-8">
            No transactions yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
