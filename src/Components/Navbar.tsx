"use client";

import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiCategory } from "react-icons/bi";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { RiHomeFill } from "react-icons/ri";

export default function Navbar() {
  const pathname = usePathname();
  const hiddenPaths = ["/auth", "/manage", "/admin"];
  const { user } = useAuth();
  const cartCount = user?.cart?.items?.length || 0;
  
  if (hiddenPaths.some((path) => pathname.startsWith(path)) || pathname === "/")
    return null;

  const navItems = [
    {
      name: "home",
      label: "Home",
      icon: <RiHomeFill size={22} />,
      href: "/home",
    },
    // {
    // 	name: "categories",
    // 	label: "Categories",
    // 	icon: <BiCategory size={22} />,
    // 	href: "/categories",
    // },
    {
      name: "search",
      label: "Search",
      icon: <FiSearch size={22} />,
      href: "/search",
    },
    {
      name: "cart",
      label: "Cart",
      icon: <FiShoppingCart size={22} />,
      href: "/my-cart",
    },
    {
      name: "profile",
      label: "Profile",
      icon: <GoPerson size={22} />,
      href: "/profile",
    },
  ];

  return (
    <>
      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[var(--color-brand-hover)] to-[var(--color-brand)] shadow-lg flex justify-around items-center h-16 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center relative transition-colors duration-200 ${
                isActive ? "text-white" : "text-gray-200 hover:text-white"
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.name === "cart" && cartCount > 0 && (
                  // Resolved conflict: Using red background and white text for high visibility badge
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}