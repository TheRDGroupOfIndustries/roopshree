"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Box,
  ShoppingCart,
  Users,
  BarChart3,
  CreditCard,
  LogOut,
  Menu,
  X,
  BriefcaseBusiness,
  TicketPercent,
  Tags,
} from "lucide-react";

// --- Navigation Data ---
const navItems = [
  { name: "Dashboard", path: "/manage", icon: LayoutGrid },
  { name: "Products", path: "/manage/products", icon: Box },
  { name: "Orders", path: "/manage/orders", icon: ShoppingCart },
  { name: "Users", path: "/manage/users", icon: Users },
  { name: "Employee", path: "/manage/employee", icon: BriefcaseBusiness },
  { name: "Offer", path: "/manage/sale", icon: TicketPercent },
  { name: "Banner", path: "/manage/banner", icon: Tags },
  { name: "Expenses", path: "/manage/expenses", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  const handleSignOut = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }, [router]);

  return (
    <>
      {/* Mobile Menu Button - FIXED */}
      <div className="md:hidden p-4 bg-white border-b sticky top-0 z-30 shadow-sm">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Backdrop (mobile only) - FIXED */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar Drawer - FIXED */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-2xl
          w-64 transform transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:translate-x-0 md:shadow-xl md:border-r md:border-gray-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col h-screen
        `}
      >
        {/* Close Button - Mobile Only - NEW */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo Area - Desktop Only - NEW */}
        <div className="hidden md:block p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === "/manage"
                ? pathname === "/manage"
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeSidebar}
                className={`relative flex items-center py-2.5 px-4 rounded-xl text-base font-medium transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-amber-50 text-amber-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 mr-4 transition-colors ${
                    isActive
                      ? "text-amber-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <span>{item.name}</span>
                
                {/* Active Indicator - NEW */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-600 rounded-r-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center py-2.5 px-4 rounded-xl text-sm w-full transition-colors duration-200 text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <LogOut className="w-5 h-5 mr-4 text-red-500" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}