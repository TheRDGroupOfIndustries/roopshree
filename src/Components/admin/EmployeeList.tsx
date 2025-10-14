"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { ConfirmDialog } from "@/Components/ConfirmDialog";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  hireDate: string;
  position: string;
  salary: number;
}

const Employees = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employee");
        const data = await res.json();

        let fetched: Employee[] = [];
        if (Array.isArray(data)) fetched = data;
        else if (Array.isArray(data.employees)) fetched = data.employees;
        setEmployees(fetched.reverse());
      } catch (err) {
        console.error("Failed to fetch employees", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees by position
  const filteredEmployees = employees.filter((employee) =>
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique positions for popular searches
  const uniquePositions = [...new Set(employees.map((e) => e.position))];

  const handleDelete = async (id: string) => {
    setPendingDeleteId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDialogOpen(false);
    const id = pendingDeleteId!;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/employee/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      alert("Employee deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header - FIXED FOR MOBILE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Employee Management</h2>
        <button
          onClick={() => router.push("/manage/employee/create")}
          className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Create Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 mb-4">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none ml-3 text-sm"
          />
        </div>

        {/* Popular Positions */}
        {uniquePositions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Filter by Position
            </h3>
            <div className="flex flex-wrap gap-2">
              {uniquePositions.map((position, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(position)}
                  className="px-3 py-1.5 bg-gray-100 text-amber-600 text-xs font-medium rounded-full hover:bg-amber-50 transition"
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading employees...</div>
      ) : (
        <>
          {/* Results Header */}
          {searchTerm && (
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-900">
                Results for "{searchTerm}" ({filteredEmployees.length})
              </h3>
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Table */}
          <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["First Name", "Last Name", "Email", "Phone", "Position", "Salary", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((e) => {
                      const isDeleting = deletingId === e.id;
                      return (
                        <tr key={e.id} className="hover:bg-gray-50 transition text-sm">
                          <td className="px-6 py-4 whitespace-nowrap">{e.firstName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{e.lastName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{e.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{e.phone || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                              {e.position}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{e.salary}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => router.push(`/manage/employee/${e.id}`)}
                                className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition"
                                title="Edit Employee"
                                disabled={isDeleting}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(e.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                title="Delete Employee"
                                disabled={isDeleting}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm ? `No employees found for position "${searchTerm}"` : "No employees found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((e) => {
                const isDeleting = deletingId === e.id;
                return (
                  <div key={e.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Name:</span>
                      <span>{e.firstName} {e.lastName}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Email:</span>
                      <span className="text-sm">{e.email}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Phone:</span>
                      <span>{e.phone || "-"}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Position:</span>
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                        {e.position}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Salary:</span>
                      <span>{e.salary}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => router.push(`/manage/employee/${e.id}`)}
                        className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition"
                        title="Edit Employee"
                        disabled={isDeleting}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Delete Employee"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No employees found for position "${searchTerm}"` : "No employees found."}
              </div>
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Employee?"
        message="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  );
};

export default Employees;