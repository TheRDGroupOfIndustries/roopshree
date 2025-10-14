"use client";

import React, { useState, useEffect } from "react";
import { Filter, PlusCircle, Edit3, Trash2, Loader2 } from "lucide-react";
import ExpenseAnalyticsChart from "./ExpenseAnalyticsChart";
import ExpenseFormModal from "./ExpenseForm";
import { getExpenseLenghtByCategory } from "@/lib/actions/expenseActions";

// --- MOCK DATA ---

const MOCK_EXPENSE_LIST = [
  {
    id: "cmgji2cdt000jnnrw3y8y93fw",
    title: "Website Hosting Renewal",
    category: "OTHER",
    amount: 3400,
    date: "2025-10-09T14:15:26.867Z",
    user: {
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
    user: {
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
    user: {
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
    user: {
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
    user: {
      id: "cmgj1imnz0000f0u0tijde14o",
      name: "admin",
      email: "admin@ad.com",
    },
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
  // const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpenseToEdit, setCurrentExpenseToEdit] = useState<any>(null);

  const [fetching, setFetching] = useState(false);
  const [deleting, setDeleting] = useState<any>(null);
  const [totalExpenseCount, setTotalExpenseCount] = useState(0);

  const ITEMS_PER_PAGE = 20;

  const handleOpenCreate = () => {
    setCurrentExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setCurrentExpenseToEdit(id);
    setIsModalOpen(true);
  };

  const fetchExpensesLength = async () => {
    try {
      const res = await getExpenseLenghtByCategory(filterCategory);
      console.log(res);
      setTotalExpenseCount(res);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchExpenses = async () => {
    setFetching(true);
    try {
      const res = await fetch(
        `/api/expenses?page=${currentPage}&limit=${ITEMS_PER_PAGE}&category=${filterCategory}`
      );
      const data = await res.json();
      console.log("Fetched Expenses:", data);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, filterCategory]);

  useEffect(() => {
    fetchExpensesLength();
  }, [filterCategory]);

  const totalPages = totalExpenseCount
    ? Math.ceil(totalExpenseCount / ITEMS_PER_PAGE)
    : 0;

  const handleDelete = async (id: string) => {
    console.log("Delete Expense", id);
    setDeleting(id);
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense.id !== id)
        );
      } else {
        console.error("Error deleting expense:", res.statusText);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateExpense = (id: string, data: any) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, ...data } : expense
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
        <button
  onClick={handleOpenCreate}
  className="flex items-center px-3 sm:px-4 py-2 bg-amber-600 text-white rounded-lg shadow-md hover:bg-amber-700 transition duration-150 text-sm font-medium"
>
  <PlusCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
  <span className="hidden xs:inline sm:inline md:inline">Add New Expense</span>
  <span className="inline xs:hidden sm:hidden md:hidden">Add</span>
</button>

      </header>

      {/* Analytics Section (Chart + Summary) */}
      <div className=" mb-8">
        <ExpenseAnalyticsChart />
      </div>

      {/* Expense List Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden p-6 relative">
        {fetching && (
          <div className="w-full h-full bg-neutral-300/50 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <h2 className="text-xl font-bold ">All Expenses</h2>
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
              {expenses.length > 0 ? (
                expenses.map((expense) => (
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
                      {expense.user.name}
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
                          {deleting && deleting === expense.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
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
              {Math.min(currentPage * ITEMS_PER_PAGE, totalExpenseCount)}
            </span>{" "}
            of <span className="font-medium">{totalExpenseCount}</span> results.
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
          expenseId={currentExpenseToEdit}
          onClose={() => setIsModalOpen(false)}
          onUpdate={(id, data) => handleUpdateExpense(id, data)}
        />
      )}
    </div>
  );
};

export default Expenses;
