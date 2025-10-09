"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EmployeeForm from "@/Components/admin/EmployeeForm"; // Adjust path to your component

export default function EmployeeEditPage() {
  const params = useParams();
  const id = params.id as string;

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        console.log("Fetching employee with ID:", id);
        
        const res = await fetch(`/api/employee/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch employee");
        }

        const data = await res.json();
        console.log("Fetched employee data:", data);
        
        // Handle different response formats
        const employeeData = data.employee || data;
        setEmployee(employeeData);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Employee not found"}</p>
        </div>
      </div>
    );
  }

  return <EmployeeForm id={id} mode="update" employee={employee} />;
}