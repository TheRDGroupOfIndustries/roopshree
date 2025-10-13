"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/Components/ConfirmDialog"; // Import the dialog component

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Employee Management</h2>
        <button
          onClick={() => router.push("/manage/employee/create")}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition"
        >
          <Plus className="w-4 h-4" /> Create Employee
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading employees...</div>
      ) : (
        <>
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
                  {employees.length > 0 ? (
                    employees.map((e) => {
                      const isDeleting = deletingId === e.id;
                      return (
                        <tr key={e.id} className="hover:bg-gray-50 transition text-sm">
                          <td className="px-6 py-4 whitespace-nowrap">{e.firstName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{e.lastName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{e.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{e.phone || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{e.position}</td>
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
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {employees.length > 0 ? (
              employees.map((e) => {
                const isDeleting = deletingId === e.id;
                return (
                  <div key={e.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Name:</span>
                      <span>{e.firstName} {e.lastName}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Email:</span>
                      <span>{e.email}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Phone:</span>
                      <span>{e.phone || "-"}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">Position:</span>
                      <span>{e.position}</span>
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
              <div className="text-center py-8 text-gray-500">No employees found.</div>
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