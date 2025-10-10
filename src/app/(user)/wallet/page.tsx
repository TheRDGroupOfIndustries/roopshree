"use client";

import React, { useState } from "react";
import { PlusCircle, ArrowUpRight, ArrowDownLeft, ArrowLeft, ShoppingCart, Wallet, TrendingUp, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(1250.75);

  const transactions = [
    {
      id: 1,
      title: "Order Payment",
      subtitle: "Order #2546",
      type: "debit",
      amount: 499.0,
      date: "Oct 6, 2025",
      time: "2:30 PM",
      status: "completed"
    },
    {
      id: 2,
      title: "Refund Received",
      subtitle: "Order #2532",
      type: "credit",
      amount: 299.0,
      date: "Oct 3, 2025",
      time: "11:45 AM",
      status: "completed"
    },
    {
      id: 3,
      title: "Money Added",
      subtitle: "Via UPI",
      type: "credit",
      amount: 1000.0,
      date: "Sep 30, 2025",
      time: "9:15 AM",
      status: "completed"
    },
    {
      id: 4,
      title: "Order Payment",
      subtitle: "Order #2521",
      type: "debit",
      amount: 750.0,
      date: "Sep 28, 2025",
      time: "5:20 PM",
      status: "completed"
    },
  ];

  const quickActions = [
    { icon: PlusCircle, label: "Add Money", color: "blue" },
    { icon: TrendingUp, label: "Send Money", color: "purple" },
    { icon: Clock, label: "History", color: "green" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white flex justify-between items-center px-4 sm:px-6 py-4 shadow-sm z-20">
        <button
          className="text-gray-700 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-semibold text-lg sm:text-xl text-gray-900">
          My Wallet
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

      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Wallet size={20} className="text-blue-200" />
              <p className="text-blue-100 text-sm font-medium">Available Balance</p>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              ₹{balance.toFixed(2)}
            </h2>

            <button
              className="bg-white text-blue-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg flex items-center gap-2"
              onClick={() => setBalance(balance + 100)}
            >
              <PlusCircle size={18} />
              Add Money
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${action.color}-50 text-${action.color}-600 group-hover:scale-110 transition-transform`}>
                <action.icon size={22} />
              </div>
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>

          <div className="divide-y divide-gray-100">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${
                        tx.type === "credit"
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDownLeft className="text-green-600" size={20} />
                      ) : (
                        <ArrowUpRight className="text-red-500" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {tx.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{tx.subtitle}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {tx.date} • {tx.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p
                      className={`font-semibold text-sm ${
                        tx.type === "credit" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                    </p>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="text-gray-400" size={28} />
                </div>
                <p className="text-gray-500 text-sm">No transactions yet</p>
                <p className="text-gray-400 text-xs mt-1">Your transaction history will appear here</p>
              </div>
            )}
          </div>

          {transactions.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2">
                View All Transactions
              </button>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-12">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Earn Cashback</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Get up to 5% cashback on every purchase. Money will be added to your wallet instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;