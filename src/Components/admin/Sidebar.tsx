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
} from "lucide-react";

// --- Navigation Data ---
const navItems = [
  { name: "Dashboard", path: "/manage", icon: LayoutGrid },
  { name: "Products", path: "/manage/products", icon: Box },
  { name: "Orders", path: "/manage/orders", icon: ShoppingCart },
  { name: "Users", path: "/manage/users", icon: Users },
  { name: "Employee", path: "/manage/employee", icon: BriefcaseBusiness },
  { name: "Offer", path: "/manage/sale", icon: BarChart3 },
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
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 bg-white border-b sticky top-0 z-40 shadow-sm flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 text-black rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
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
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-2xl
          w-64 transform transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:translate-x-0 md:shadow-xl md:border-r md:border-gray-100
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
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
                  ${isActive ? "bg-amber-50 text-amber-600 shadow-md" : "text-black hover:bg-gray-50"}
                `}
              >
                <item.icon
                  className={`w-5 h-5 mr-4 transition-colors ${
                    isActive ? "text-amber-600" : "text-gray-500 group-hover:text-gray-700"
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
