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
      name: "spotlight",
      label: "spotlight",
      icon: <GoPerson size={22} />,
      href: "/spotlight",
    },
    {
      name: "profile",
      label: "Profile",
      icon: <GoPerson size={22} />,
      href: "/profile",
    },
    
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="h-16 bg-gradient-to-r from-[var(--color-brand-hover)] to-[var(--color-brand)] shadow-lg flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full"
            >
              {/* 🔥 Spotlight Glow */}
              {isActive && (
                <span
                  className="
                    absolute -top-3
                    w-14 h-14
                    rounded-full
                    bg-white/30
                    blur-2xl
                    transition-all
                    duration-300
                  "
                />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                {item.icon}

                {/* 🛒 Cart Badge */}
                {item.name === "cart" && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-1 font-medium relative z-10 ${
                  isActive ? "text-white" : "text-gray-200"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}