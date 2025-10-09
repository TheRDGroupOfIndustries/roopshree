"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  DollarSign,
  ListOrdered,
  Calendar,
  Filter,
  PlusCircle,
  LayoutGrid,
  Menu,
  Package,
  Bell,
  Edit3,
  Trash2,
} from "lucide-react";
import ExpenseAnalyticsChart from "./ExpenseAnalyticsChart";
import ExpenseFormModal from "./ExpenseForm";

// --- MOCK DATA ---

const MOCK_EXPENSE_LIST = [
  {
    id: "cmgji2cdt000jnnrw3y8y93fw",
    title: "Website Hosting Renewal",
    category: "OTHER",
    amount: 3400,
    date: "2025-10-09T14:15:26.867Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji25so000hnnrwcmuv9fsq",
    title: "Admin Salary",
    category: "SALARY",
    amount: 22000,
    date: "2025-10-09T14:15:18.744Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji1zfi000fnnrwayuekisk",
    title: "Google Ads Campaign",
    category: "MARKETING",
    amount: 4200,
    date: "2025-10-09T14:15:10.097Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji1s7t000dnnrwcou0wdeo",
    title: "Courier Partner Charges",
    category: "LOGISTICS",
    amount: 4800,
    date: "2025-10-09T14:15:01.145Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji1iez000bnnrwcdiz6xz6",
    title: "Product Restock - Headphones",
    category: "INVENTORY",
    amount: 12200,
    date: "2025-10-09T14:14:48.050Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji1axy0009nnrwgtkpq5ym",
    title: "Office Maintenance",
    category: "OTHER",
    amount: 950,
    date: "2025-10-09T14:14:38.758Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji12kl0007nnrww6qry7qi",
    title: "Staff Salary - September",
    category: "SALARY",
    amount: 56000,
    date: "2025-10-09T14:14:27.441Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji0vnm0005nnrwjpp35omz",
    title: "Instagram Ad Campaign",
    category: "MARKETING",
    amount: 3500,
    date: "2025-10-09T14:14:18.945Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji0pyu0003nnrwkda4lrj8",
    title: "Delivery Vehicle Fuel",
    category: "LOGISTICS",
    amount: 1800,
    date: "2025-10-09T14:14:11.191Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  {
    id: "cmgji0j2q0001nnrwxia4s3d7",
    title: "Product Packaging Materials",
    category: "INVENTORY",
    amount: 2300,
    date: "2025-10-09T14:14:02.637Z",
    createdBy: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
  },
  // Add more mock data for pagination testing
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `cmgji${i}mockid`,
    title: `Mock Expense ${i + 1}`,
    category: ["OTHER", "SALARY", "MARKETING", "LOGISTICS", "INVENTORY"][i % 5],
    amount: Math.floor(Math.random() * 5000 + 1000),
    date: `2025-09-${(i % 20) + 1}T10:00:00.000Z`,
    createdBy: { id: "mockuser", name: "Mock User", email: "mock@user.com" },
  })),
];

const MOCK_ANALYTICS = [
  {
    month: "2025-10",
    total: 111150,
    category: [
      { category: "OTHER", total: 4350 },
      { category: "SALARY", total: 78000 },
      { category: "MARKETING", total: 7700 },
      { category: "LOGISTICS", total: 6600 },
      { category: "INVENTORY", total: 14500 },
    ],
  },
  {
    month: "2025-9",
    total: 111150,
    category: [
      { category: "OTHER", total: 4350 },
      { category: "SALARY", total: 78000 },
      { category: "MARKETING", total: 7700 },
      { category: "LOGISTICS", total: 6600 },
      { category: "INVENTORY", total: 14500 },
    ],
  },
];

const ALL_CATEGORIES = [
  "ALL",
  "SALARY",
  "INVENTORY",
  "MARKETING",
  "LOGISTICS",
  "OTHER",
];

// --- UTILITY FUNCTIONS ---

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatShortDate = (isoString: string) => {
  if (!isoString) return "N/A";
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
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

const Expenses = () => {
  const [expenses, setExpenses] = useState(MOCK_EXPENSE_LIST);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpenseToEdit, setCurrentExpenseToEdit] = useState<any>(null); // null for create mode

  const handleOpenCreate = () => {
    setCurrentExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setCurrentExpenseToEdit(id);
    setIsModalOpen(true);
  };

  //   const handleSubmitExpense = (data) => {
  //     console.log("Submitting Expense Data:", data);
  //     alert(
  //       `Action: ${data.id ? "UPDATE" : "CREATE"}\nTitle: ${
  //         data.title
  //       }\nAmount: ${data.amount}\nCategory: ${data.category}`
  //     );
  //     // Here you would call your API endpoint
  //     setIsModalOpen(false);
  //   };

  const ITEMS_PER_PAGE = 10; // Keeping it low for better mock data demonstration

  // --- Filtered and Paginated Logic ---

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory =
        filterCategory === "ALL" || expense.category === filterCategory;
      const matchesSearch = expense.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [expenses, filterCategory, searchTerm]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  const currentExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage, ITEMS_PER_PAGE]);

  // --- Handlers (Mock) ---

  const handleDelete = (id: string) => {
    console.log("Delete Expense", id);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Rendering ---

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 text-sm font-medium"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Expense
        </button>
      </header>

      {/* Analytics Section (Chart + Summary) */}
      <div className=" mb-8">
        <ExpenseAnalyticsChart />
      </div>

      {/* Expense List Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden p-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div className="flex items-center space-x-3">
            <label
              htmlFor="category-filter"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Filter className="w-4 h-4 mr-1 text-gray-500" /> Filter:
            </label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1); // Reset page on filter change
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
            >
              {ALL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Created By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentExpenses.length > 0 ? (
                currentExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {expense.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {formatShortDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                      {expense.createdBy.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          title="Edit Expense"
                          onClick={() => handleOpenEdit(expense.id)}
                          className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          title="Delete Expense"
                          onClick={() => handleDelete(expense.id)}
                          className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 text-lg"
                  >
                    No expenses found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredExpenses.length)}
            </span>{" "}
            of <span className="font-medium">{filteredExpenses.length}</span>{" "}
            results.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ExpenseFormModal
          initialData={currentExpenseToEdit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Expenses;
