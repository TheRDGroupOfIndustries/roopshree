"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid, // Dashboard
  Box, // Products
  ShoppingCart, // Orders
  Users, // Users
  BarChart3, // Reports
  CreditCard, // Expenses
  LogOut, // Sign Out
  Menu, // Mobile Menu Icon
  X,
  BriefcaseBusiness,
   // Close Icon
} from "lucide-react";

// --- Navigation Data ---
const navItems = [
  { name: "Dashboard", path: "/manage", icon: LayoutGrid },
  { name: "Products", path: "/manage/products", icon: Box },
  { name: "Orders", path: "/manage/orders", icon: ShoppingCart },
  { name: "Users", path: "/manage/users", icon: Users },
  { name: "Employee", path: "/manage/employee", icon: BriefcaseBusiness },
  { name: "Reports", path: "/manage/reports", icon: BarChart3 },
  { name: "Expenses (WIP)", path: "/manage/expenses", icon: CreditCard },
];

/* ---------------- Sidebar Component ---------------- */
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  const handleSignOut = useCallback(() => {
    alert("Simulating Sign Out..."); // Replace with real sign-out logic
    // Add real sign-out logic here: router.push('/login');
  }, []);

  return (
    <>
      {/* Mobile Menu Button (Top Bar) */}
      <div className="md:hidden p-4 bg-white border-b sticky top-0 z-40 shadow-sm flex-1">
        <button
          onClick={toggleSidebar}
          // Updated color to match new palette
          className="p-2 text-indigo-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar Drawer */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-2xl
          w-64 transform transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:translate-x-0 md:shadow-xl md:border-r md:border-gray-100
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        {/* Header / Logo */}
        {/* <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-indigo-800 tracking-wider font-sans">
            <span className="text-3xl font-serif text-indigo-600">R</span>oop{" "}
            <span className="text-3xl font-serif text-indigo-600">S</span>hree
            <div className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">
              Admin Panel
            </div>
          </h1>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-full focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div> */}

        {/* Navigation */}
        {/* Added flex-grow to make nav take up available space */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            // Logic for active path remains the same
            const isActive =
              item.path === "/manage"
                ? pathname === "/manage"
                : pathname.startsWith(item.path);

            const baseClasses =
              "relative flex items-center py-2.5 px-4 rounded-xl text-base font-medium transition-all duration-200 group";

            // Enhanced active/hover styles for a premium look
            const activeClasses = isActive
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" // Stronger shadow and background
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"; // Lighter hover background

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeSidebar}
                className={`${baseClasses} ${activeClasses}`}
              >
                {/* Active Link Indicator (Subtle line) */}
                {isActive && (
                  <div className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r-full" />
                )}
                {/* Icon Styling */}
                <item.icon
                  className={`w-5 h-5 mr-4 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-indigo-700"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center py-2.5 px-4 rounded-xl text-sm w-full transition-colors duration-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-4 text-red-500" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
