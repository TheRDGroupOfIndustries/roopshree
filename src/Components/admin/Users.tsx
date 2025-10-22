"use client";

import React, { useEffect, useState } from "react";
import UserSelectModal from "@/Components/UserSelectModal";

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<
    "user" | "admin" | "delivery_boy" | "EXCLUSIVE_USER"
  >("user");

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/deleteuser");
      const data = await res.json();

      if (res.ok && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((u) =>
      selectedRole === "EXCLUSIVE_USER"
        ? u.role === "EXCLUSIVE_USER"
        : u.role?.toLowerCase() === selectedRole
    )
    .filter((u) =>
      u.email.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

  const handlePromoteUser = (user: any) => {
    console.log(`Promoting ${user.name} to ${selectedRole}`);
    // Your promote logic here
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          User Management
        </h2>

        {(selectedRole === "admin" ||
          selectedRole === "delivery_boy" ||
          selectedRole === "EXCLUSIVE_USER") && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm md:text-base bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-all duration-150 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            {selectedRole === "admin"
              ? "+ Add Admin"
              : selectedRole === "delivery_boy"
              ? "+ Add Delivery Boy"
              : "+ Add Exclusive User"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 md:gap-4 mb-4 overflow-x-auto pb-2">
        {["user", "admin", "delivery_boy", "EXCLUSIVE_USER"].map((role) => (
          <button
            key={role}
            onClick={() =>
              setSelectedRole(
                role as "user" | "admin" | "delivery_boy" | "EXCLUSIVE_USER"
              )
            }
            className={`px-4 md:px-5 py-2 rounded-lg font-medium transition-all duration-150 text-sm md:text-base whitespace-nowrap ${
              selectedRole === role
                ? "bg-amber-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {role === "EXCLUSIVE_USER"
              ? "Exclusive User"
              : role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          Loading users...
        </div>
      ) : filteredUsers.length > 0 ? (
        <>
          {/* Desktop Table View */}
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
                  {filteredUsers.map((user: any, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition duration-100"
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredUsers.map((user: any, index: number) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Name
                    </p>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="text-gray-700 break-all">{user.email}</p>
                  </div>

                  {/* Role & Status */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Role
                      </p>
                      <p className="text-gray-700 font-medium">{user.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Status
                      </p>
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
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No users found for this category.
        </div>
      )}

      {/* Modal */}
      <UserSelectModal
        show={showModal}
        onClose={() => setShowModal(false)}
        users={users}
        selectedRole={selectedRole}
        refetchUsers={fetchUsers}
      />
    </div>
  );
};

export default Users;
