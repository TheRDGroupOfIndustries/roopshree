"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  DollarSign,
  CreditCard,
  LogOut,
  Grid,
  TrendingUp,
  TrendingDown,
  X, // Added X icon for closing mobile menu
} from "lucide-react";
import UserManagementPage from "./user/UserManagementPage";
import ProductManagementPage from "./product/ProductManagementPage";

// --- MOCK DATA ---
const mockData = {
  // Data for the main dashboard cards
  summary: [
    {
      title: "Total Sales",
      value: "$45,231.89",
      trend: 12.5,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "New Orders",
      value: "1,245",
      trend: 5.8,
      icon: ShoppingCart,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Active Products",
      value: "348",
      trend: -1.2,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "New User",
      value: "284",
      trend: 9.1,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ],
  // Data for the recent orders table
  recentOrders: [
    {
      id: "#1001",
      customer: "Aarav Sharma",
      total: "$89.99",
      status: "Processing",
      date: "2025-10-01",
    },
    {
      id: "#1002",
      customer: "Priya Verma",
      total: "$34.50",
      status: "Shipped",
      date: "2025-10-01",
    },
    {
      id: "#1003",
      customer: "Rajesh Kumar",
      total: "$145.00",
      status: "Delivered",
      date: "2025-09-30",
    },
    {
      id: "#1004",
      customer: "Sneha Patel",
      total: "$56.25",
      status: "Cancelled",
      date: "2025-09-30",
    },
    {
      id: "#1005",
      customer: "Vikram Singh",
      total: "$210.75",
      status: "Processing",
      date: "2025-09-29",
    },
  ],
};

// --- HELPER COMPONENTS ---

// Card component for summary statistics
const StatCard = ({
  title,
  value,
  trend,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  value: string;
  trend: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}) => {
  const isPositive = trend >= 0;
  return (
    <div
      className={`p-6 rounded-xl shadow-lg transition duration-300 ease-in-out hover:shadow-xl border border-gray-100 ${bg}`}
    >
      <div className="flex items-center justify-between">
        <Icon className={`w-8 h-8 ${color}`} />
        <div
          className={`flex items-center text-sm font-medium rounded-full px-3 py-1 ${
            isPositive
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={16} className="mr-1" />
          ) : (
            <TrendingDown size={16} className="mr-1" />
          )}
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
      <p className="text-3xl font-bold mt-3 text-gray-800">{value}</p>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">
        {title}
      </p>
    </div>
  );
};

// Component to display the status tag in the orders table
const StatusTag = ({ status }: { status: string }) => {
  let colorClass = "";
  switch (status) {
    case "Delivered":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "Shipped":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    case "Processing":
      colorClass = "bg-orange-100 text-orange-800";
      break;
    case "Cancelled":
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

// --- MAIN LAYOUT COMPONENTS ---

// Sidebar Navigation
const Sidebar = ({
  activePage,
  setActivePage, // Corrected type to React.Dispatch<React.SetStateAction<string>>
  isMobileOpen,
  toggleMobileMenu,
}: {
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
  isMobileOpen: boolean;
  toggleMobileMenu: () => void;
}) => {
  const navItems = [
    { name: "Dashboard", icon: Grid, key: "dashboard", section: "ecommerce" },
    { name: "Products", icon: Package, key: "products", section: "ecommerce" },
    { name: "Orders", icon: ShoppingCart, key: "orders", section: "ecommerce" },
    { name: "User", icon: Users, key: "User", section: "ecommerce" },
    { name: "Reports", icon: BarChart2, key: "reports", section: "ecommerce" },
    {
      name: "Expenses (WIP)",
      icon: CreditCard,
      key: "expenses",
      section: "finance",
    },
  ];

  return (
    // Conditional classes for mobile vs desktop positioning
    <div
      className={`h-full w-64 flex flex-col bg-white border-r border-gray-200 shadow-xl fixed top-0 left-0 bottom-0 z-40 transition-transform duration-300 ease-in-out
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 md:shadow-xl md:z-20`}
    >
      {/* Logo/App Name */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-[#7e57c2] tracking-wider font-inter">
          Roop Shree Admin
        </h1>
        {/* Close Button for mobile menu */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-800"
          onClick={toggleMobileMenu}
        >
          {/* Using Lucide-react X icon for closing */}
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActivePage(item.key);
              // Close sidebar on mobile after selection
              if (isMobileOpen) toggleMobileMenu();
            }}
            className={`w-full flex items-center p-3 rounded-xl transition duration-150 ease-in-out group
              ${
                activePage === item.key
                  ? "bg-[#7e57c2] text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition duration-150">
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// Header
const Header = ({ toggleMobileMenu }: { toggleMobileMenu: () => void }) => (
  <header className="bg-white shadow-md p-4 sticky top-0 z-30 border-b border-gray-200">
    <div className="flex justify-between items-center">
      {/* Mobile Menu Button - visible only on small screens */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 text-gray-600 hover:text-[#7e57c2] rounded-lg transition duration-150"
        aria-label="Toggle menu"
      >
        {/* Menu icon (hamburger) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Mobile Logo/Title (visible when sidebar is closed) */}
      <h1 className="md:hidden text-lg font-bold text-gray-800">Admin Panel</h1>

      {/* Search Bar (Hidden on Mobile, simplified on desktop) */}
      <div className="hidden md:block w-1/3">
        <input
          type="text"
          placeholder="Search for orders, products, or User..."
          className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-[#7e57c2] focus:border-[#7e57c2] transition duration-150"
        />
      </div>

      {/* User/Profile Icon */}
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block text-right">
          <p className="font-semibold text-gray-800">Admin User</p>
          <p className="text-xs text-gray-500">Super Administrator</p>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold border-2 border-[#7e57c2]">
          AD
        </div>
      </div>
    </div>
  </header>
);

// --- PAGE VIEWS (Unchanged as they were already responsive) ---

// Dashboard View
const DashboardPage = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>

    {/* Summary Cards: Responsive grid used (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockData.summary.map((card, index) => (
        <StatCard key={index} {...card} />
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
          <tbody className="bg-white divide-y divide-gray-200">
            {mockData.recentOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition duration-100"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#7e57c2]">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusTag status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-[#7e57c2] hover:text-[#5d40a2] text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Generic Placeholder View for other pages
const PlaceholderPage = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-lg text-gray-500 mb-8 text-center">{description}</p>
    <div className="p-6 bg-[#f3f0fa] border border-[#7e57c2] rounded-lg text-[#7e57c2] font-semibold">
      UI elements for this section (e.g., Table, Forms, Filters) would go here.
    </div>
  </div>
);

// Expense Management Placeholder View
const ExpensePage = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-gray-800">
      Expense Management System
    </h2>
    <PlaceholderPage
      title="Ready for Integration"
      description="This section is reserved for the future integration of your financial and expense tracking tools. You can start designing tables and forms for expense categories, transactions, and budget tracking here."
    />
  </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
  const [activePage, setActivePage] = useState("dashboard");
  // State to manage the sidebar open/close state on mobile
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileSidebarOpen((prev) => !prev);

  const renderContent = useMemo(() => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "products":
        return (
          // <PlaceholderPage
          //   title="Product Inventory"
          //   description="Manage all product listings, stock levels, and variants for your e-commerce store."
          // />
          <ProductManagementPage />
        );
      case "orders":
        return (
          <PlaceholderPage
            title="Order Management"
            description="View, process, and track all incoming customer orders."
          />
        );
      case "User":
        return (
          // <PlaceholderPage
          //   title="Customer Directory"
          //   description="Manage customer accounts, view order history, and handle support requests."
          // />
          <UserManagementPage />
        );
      case "reports":
        return (
          <PlaceholderPage
            title="Business Reports"
            description="Analyze sales performance, customer trends, and marketing campaign effectiveness."
          />
        );
      case "expenses":
        return <ExpensePage />;
      default:
        return <DashboardPage />;
    }
  }, [activePage]);

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      {/* Mobile Backdrop Overlay - visible when sidebar is open on screens smaller than md */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - Now handles mobile drawer and desktop fixed position */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileSidebarOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Main Content Area: md:ml-64 ensures space is reserved for the fixed sidebar on desktop */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Header toggleMobileMenu={toggleMobileMenu} />

        {/* Content Body */}
        <main className="p-4 sm:p-6 md:p-8 flex-1">{renderContent}</main>
      </div>
    </div>
  );
};

export default App;
