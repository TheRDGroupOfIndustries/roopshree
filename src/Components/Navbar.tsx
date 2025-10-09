"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiCategory } from "react-icons/bi";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { RiHomeFill, RiCustomerService2Line } from "react-icons/ri";

export default function Navbar() {
  const pathname = usePathname();
  const cartCount = 3;
  const hiddenPaths = ["/auth", "/manage", "/admin"];

  if (hiddenPaths.some((path) => pathname.startsWith(path)) || pathname === "/") return null;

  const navItems = [
    {
      name: "home",
      label: "Home",
      icon: <RiHomeFill size={22} />,
      href: "/home",
    },
    {
      name: "categories",
      label: "Categories",
      icon: <BiCategory size={22} />,
      href: "/categories",
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
      name: "profile",
      label: "Profile",
      icon: <GoPerson size={22} />,
      href: "/profile",
    },
  ];

  return (
    <>
      {/* Support Icon */}
      {/* <Link
        href="/support"
        className="fixed bottom-20 right-5 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110 z-100"
        title="Support"
      >
        <RiCustomerService2Line size={24} />
      </Link> */}

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-md flex justify-around items-center h-16 z-100">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center relative transition-colors duration-200 ${
                isActive ? "text-[var(--color-brand)]" : "text-gray-500"
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.name === "cart" && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-brand)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
