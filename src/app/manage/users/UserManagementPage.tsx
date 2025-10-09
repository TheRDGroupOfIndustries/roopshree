"use client";

import React, { useEffect, useState } from "react";

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<
    "user" | "admin" | "delivery"
  >("user");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/auth/deleteuser");
      const data = await res.json();

      console.log("Fetched user data:", data); // 👈 ADD THIS LINE

      if (res.ok && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error("Unexpected API response:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);




  const filteredUsers = users.filter(
  (u) => u.role?.toLowerCase() === selectedRole
);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">User Management</h2>

      {/* Top Tabs */}
      <div className="flex gap-4 mb-6">
        {["user", "admin", "delivery_boy"].map((role) => (
          <button
            key={role}
            onClick={() =>
              setSelectedRole(role as "user" | "admin" | "delivery")
            }
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-150 ${
              selectedRole === role
                ? "bg-[#7e57c2] text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          Loading users...
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Email", "Role", "Status"].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user: any, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition duration-100 text-sm sm:text-base"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-500 text-sm"
                      >
                        No users found for this category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: any, index: number) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow border border-gray-100"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800">Name:</span>
                    <span className="text-gray-700">{user.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800">Email:</span>
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800">Role:</span>
                    <span className="text-gray-700">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Status:</span>
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No users found for this category.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
