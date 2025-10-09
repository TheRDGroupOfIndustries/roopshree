"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EmployeeFormProps {
  id?: string;
  mode?: "create" | "update";
  employee?: any;
}

const EmployeeForm = ({ id, mode = "create", employee }: EmployeeFormProps) => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const isUpdateMode = mode === "update" && !!id;

  const showMessage = (text: string, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 5000);
  };

  /**
   * Converts date to YYYY-MM-DD format for input[type="date"]
   */
  const formatDateForInput = (dateValue: any): string => {
    if (!dateValue) return "";
    
    try {
      let date: Date;
      
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else if (typeof dateValue === 'object' && dateValue.$date) {
        date = new Date(dateValue.$date);
      } else {
        return "";
      }

      if (isNaN(date.getTime())) {
        return "";
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Prefill form data in update mode
  useEffect(() => {
    if (isUpdateMode && employee) {
      console.log("Prefilling employee data:", employee);
      
      setFirstName(employee.firstName || "");
      setLastName(employee.lastName || "");
      setEmail(employee.email || "");
      setPhone(employee.phone || "");
      setGender(employee.gender || "");
      setPosition(employee.position || "");
      setSalary(employee.salary ? Number(employee.salary) : undefined);
      
      const dobFormatted = formatDateForInput(employee.dateOfBirth);
      const hireDateFormatted = formatDateForInput(employee.hireDate);
      
      setDateOfBirth(dobFormatted);
      setHireDate(hireDateFormatted);
      
      console.log("Form prefilled successfully");
    }
  }, [id, employee, isUpdateMode]);

  // CREATE Employee
  const handleCreate = async () => {
    if (!firstName || !lastName || !email || !position || !salary) {
      showMessage("Please fill all required fields", true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        gender: gender || null,
        hireDate: hireDate ? new Date(hireDate).toISOString() : null,
        position,
        salary: Number(salary),
      };

      const res = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || "Employee creation failed", true);
        setLoading(false);
        return;
      }

      showMessage("Employee created successfully! 🎉");
      setTimeout(() => router.push("/manage/employee"), 1500);
    } catch (err) {
      console.error("Create error:", err);
      showMessage("Unexpected error occurred", true);
      setLoading(false);
    }
  };

  // UPDATE Employee
  const handleUpdate = async () => {
    if (!firstName || !lastName || !email || !position || !salary || !id) {
      showMessage("Please fill all required fields", true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        gender: gender || null,
        hireDate: hireDate ? new Date(hireDate).toISOString() : null,
        position,
        salary: Number(salary),
      };

      const res = await fetch(`/api/employee/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || "Update failed", true);
        setLoading(false);
        return;
      }

      showMessage("Employee updated successfully! 🚀");
      setTimeout(() => router.push("/manage/employee"), 1500);
    } catch (err) {
      console.error("Update error:", err);
      showMessage("Unexpected error", true);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isUpdateMode) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {isUpdateMode ? `Update Employee${firstName ? `: ${firstName} ${lastName}` : ''}` : "Create Employee"}
        </h2>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
              placeholder="John"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
              placeholder="Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
              placeholder="john.doe@company.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
              placeholder="(123) 456-7890"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Hire Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Hire Date</label>
            <input
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
              placeholder="Software Engineer"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Salary <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={salary || ""}
              onChange={(e) => setSalary(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
              placeholder="75000"
              min="0"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={() => router.push("/manage/employee")}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : isUpdateMode ? "Update Employee" : "Create Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;