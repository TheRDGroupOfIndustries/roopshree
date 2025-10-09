"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Interfaces for better type safety
interface ExpenseCategory {
  category: string;
  total: number;
}

interface MonthlyExpenseData {
  month: string;
  total: number;
  category: ExpenseCategory[];
}

export function formatMonthYear(dateString: string): string {
  if (!dateString) return "N/A";
  // The date string format is "YYYY-MM" (e.g., "2025-10")
  const [year, month] = dateString.split("-");

  // Note: JavaScript months are 0-based, so month - 1
  const date = new Date(Number(year), Number(month) - 1);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

// Currency formatter for INR (assuming Indian Rupees based on previous context)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          borderRadius: "8px",
          border: "1px solid #4F39F6",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          backgroundColor: "white",
          padding: "10px",
        }}
      >
        <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>
          Month: {formatMonthYear(label)}
        </p>
        <p
          style={{ margin: "4px 0 0 0", color: "#4F39F6", fontWeight: "bold" }}
        >
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function ExpenseAnalyticsChart() {
  const [expenseAnalytics, setExpenseAnalytics] = useState<
    MonthlyExpenseData[] | null
  >(null);
  const [monthlyExpenses, setMonthlyExpenses] =
    useState<MonthlyExpenseData | null>(null);
  const [loadingExpenseAnalytics, setLoadingExpenseAnalytics] = useState(false);

  const fetchExpenseAnalytics = async () => {
    setLoadingExpenseAnalytics(true);
    try {
      // NOTE: Using mock data for demonstration purposes since the API is external.
      // Replace this with your actual fetch logic when deploying.
      const mockData: MonthlyExpenseData[] = [
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
          // Added mock historical data to make the chart useful
          month: "2025-09",
          total: 95000,
          category: [
            { category: "OTHER", total: 3500 },
            { category: "SALARY", total: 65000 },
            { category: "MARKETING", total: 6500 },
            { category: "LOGISTICS", total: 5000 },
            { category: "INVENTORY", total: 15000 },
          ],
        },
      ];

      const res = await fetch("/api/expenses/analytics");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();

      //   const data = mockData; // Use mock data

      const curMonth = new Date().getMonth();
      const curYear = new Date().getFullYear();

      // Find data for the current month and year
      const curMonthData = data.find((item: MonthlyExpenseData) => {
        const itemDate = new Date(`${item.month}-01`);
        return (
          itemDate.getMonth() === curMonth && itemDate.getFullYear() === curYear
        );
      });

      // If current month data isn't found, default to the first entry
      setMonthlyExpenses(curMonthData || data[0] || null);
      setExpenseAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch expense analytics:", error);
    } finally {
      setLoadingExpenseAnalytics(false);
    }
  };

  useEffect(() => {
    fetchExpenseAnalytics();
  }, []);

  // Map category names for the summary list
  const categories = ["SALARY", "INVENTORY", "MARKETING", "LOGISTICS", "OTHER"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Expense Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Expense Analytics (Monthly)
        </h3>

        <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          {loadingExpenseAnalytics ? (
            <LoaderCircle className="animate-spin h-6 w-6" />
          ) : expenseAnalytics && expenseAnalytics.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expenseAnalytics}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                {/* CartesianGrid for the background lines (like the example) */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e0e0e0"
                />

                {/* XAxis: Monthly labels */}
                <XAxis
                  dataKey="month"
                  angle={-15}
                  textAnchor="end"
                  height={50}
                  stroke="#666"
                  tick={{ fill: "#444", fontSize: 12 }}
                  // Use the custom formatter for the display name
                  tickFormatter={(value: string) =>
                    formatMonthYear(value).split(" ")[0]
                  }
                />

                {/* YAxis: total value */}
                <YAxis
                  stroke="#666"
                  tickFormatter={(value) =>
                    `${new Intl.NumberFormat().format(Number(value) / 1000)}k`
                  }
                  domain={[0, "auto"]} // Allows the Y-axis to scale automatically based on data max
                />

                {/* Tooltip on hover - FIXED */}
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(79, 57, 246, 0.1)" }}
                />

                {/* Bar element */}
                <Bar
                  onClick={(data) => {
                    // When clicking a bar, set the monthlyExpenses to the clicked data point
                    setMonthlyExpenses(data as any);
                    console.log("Clicked month:", (data as any).month);
                  }}
                  dataKey="total"
                  fill="#4F39F6"
                  radius={[4, 4, 0, 0]} // Added slight radius for modern look
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available for expense analytics.</p>
          )}
        </div>
      </div>

      {/* Top Products/Categories Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex justify-between items-center">
          <span>
            {monthlyExpenses
              ? formatMonthYear(monthlyExpenses.month)
              : "No Data"}
          </span>
        </h3>
        <ul className="space-y-3">
          {categories.map((item, index) => {
            const categoryData = monthlyExpenses?.category.find(
              (c: any) => c.category.toUpperCase() === item.toUpperCase()
            );
            const totalAmount = categoryData?.total || 0;

            return (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b"
              >
                <span className="text-gray-700">{item}</span>
                <span className="font-medium text-[#4F39F6]">
                  {formatCurrency(totalAmount)}
                </span>
              </li>
            );
          })}
          <li className="flex justify-between text-lg items-center py-2 ">
            <span className="text-gray-700 font-bold">Total</span>
            <span className="font-bold text-[#4F39F6]">
              {formatCurrency(monthlyExpenses?.total || 0)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
