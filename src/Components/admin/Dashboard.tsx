"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, Package, Users, LoaderCircle } from "lucide-react";
import { BiRupee } from "react-icons/bi";
import { RecentOrders } from "@/app/manage/page";
import ExpenseAnalyticsChart from "./ExpenseAnalyticsChart";
import OrderDetailsModal from "./OrderDetails";

import { Trophy } from 'lucide-react';

interface Summary {
  totalSales: number;
  newOrders: number;
  activeProducts: number;
  newUsers: Number;
}

interface UserData {
  userId: string;
  name: string;
}

const mockData = {
  summary: [
    {
      title: "Total Sales",
      value: "totalSales",
      trend: 12.5,
      icon: BiRupee,
      color: "text-green-600",
      bg: "bg-green-50",
      tag: "This Month",
    },
    {
      title: "New Orders",
      value: "newOrders",
      trend: 5.8,
      icon: ShoppingCart,
      color: "text-orange-600",
      bg: "bg-orange-50",
      tag: "This Month",
    },
    {
      title: "Active Products",
      value: "activeProducts",
      trend: -1.2,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      tag: "Total",
    },
    {
      title: "New User",
      value: "newUsers",
      trend: 9.1,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      tag: "This Month",
    },
  ],
};

export function formatMonthYear(dateString: string): string {
  if (!dateString) return "";
  const [year, month] = dateString.split("-");
  const date = new Date(Number(year), Number(month) - 1); // month is 0-based
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

// Component to display the status tag in the orders table
const StatusTag = ({ status }: { status: string }) => {
  let colorClass = "";
  switch (status) {
    case "CONFIRMED":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "DISPATCH":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    case "OUTOFDELIVERY":
      colorClass = "bg-orange-100 text-orange-800";
      break;
    case "DELIVERED":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "CANCELLED":
      colorClass = "bg-red-100 text-red-800";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-800";
  }
  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default function Dashboard({
  recentOrders,
}: {
  recentOrders: RecentOrders[];
}) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);


  useEffect(() => {
      fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Failed to fetch user data:", err));
    }, []);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch("/api/admin/summary");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      // console.log("summary data: ", data);
      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // console.log("recentOrders", recentOrders);

  return (
    <div className="space-y-8 ml-30 mr-30">
        <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.name || "Admin"}! ✨</h1>
          <p className="text-amber-100 text-lg">
            Your business is growing strong today. Here's your overview.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Trophy className="w-10 h-10 text-yellow-200" />
          </div>
        </div>
      </div>
    </div>
      {/* <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2> */}

      {/* Summary Cards: Responsive grid used (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockData.summary.map((card, index) => (
          <div
            key={card.title}
            className={`p-6 rounded-xl shadow-lg transition duration-300 ease-in-out hover:shadow-xl border border-gray-100 ${card.bg}`}
          >
            <div className="flex items-center justify-between">
              <card.icon className={`w-8 h-8 ${card.color}`} />
              <div
                className={`flex items-center ${card.color} font-medium rounded-full px-3 py-1  `}
              >
                {card.tag}
              </div>
            </div>
            <p className="text-3xl font-bold mt-3 text-gray-800">
              {loadingSummary ? (
                <LoaderCircle className="animate-spin h-6 w-6 " />
              ) : summary && summary[card.value as keyof Summary] ? (
                String(summary[card.value as keyof Summary])
              ) : (
                "NaN"
              )}
            </p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* Charts & Latest Activity: Responsive grid used (grid-cols-1 lg:grid-cols-3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Sales Analytics (Monthly)
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            [ Placeholder for Bar/Line Chart component ]
          </div>
        </div>

        {/* Top Products/Categories */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Top Performing Categories
          </h3>
          <ul className="space-y-3">
            {["Skincare", "Makeup", "Fragrance"].map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <span className="text-gray-700">{item}</span>
                <span className="font-medium text-[#7e57c2]">
                  {1500 - index * 300} Units
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Charts & Latest Activity: Responsive grid used (grid-cols-1 lg:grid-cols-3) */}
      <ExpenseAnalyticsChart />

      {/* Recent Orders Table: overflow-x-auto ensures horizontal scrolling on small screens */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Total",
                  "Status",
                  "Date",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            {recentOrders && recentOrders.length > 0 ? (
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition duration-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#7e57c2]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusTag status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt.toDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setIsDetailsModalOpen(true);
                          setSelectedOrder(order.id);
                        }}
                        className="text-[#7e57c2] hover:text-[#5d40a2] text-sm cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className="">
                <tr>
                  <td
                    colSpan={6}
                    className="h-64 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center"
                  >
                    No recent orders found.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      {isDetailsModalOpen && (
        <OrderDetailsModal
          orderId={selectedOrder}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
