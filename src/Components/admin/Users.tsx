"use client";

import React, { useEffect, useState } from "react";
import UserSelectModal from "@/Components/UserSelectModal";

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | "delivery_boy">("user");

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Move fetchUsers OUTSIDE useEffect so it can be reused
  const fetchUsers = async () => {
    try {
      setLoading(true); // Optional: show loading when refetching
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

  // Call it on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) => u.role?.toLowerCase() === selectedRole
  );

  const handlePromoteUser = (user: any) => {
    console.log(`Promoting ${user.name} to ${selectedRole}`);
    // Your promote logic here
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>

        {(selectedRole === "admin" || selectedRole === "delivery_boy") && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-[#7e57c2] text-white rounded-lg font-medium hover:bg-[#6d48b0] transition-all duration-150 shadow-md hover:shadow-lg"
          >
            + Add {selectedRole === "admin" ? "Admin" : "Delivery Boy"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["user", "admin", "delivery_boy"].map((role) => (
          <button
            key={role}
            onClick={() =>
              setSelectedRole(role as "user" | "admin" | "delivery_boy")
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

      {/* Content */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          Loading users...
        </div>
      ) : filteredUsers.length > 0 ? (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
        refetchUsers={fetchUsers} // ← Now this will work!
      />
    </div>
  );
};

export default Users;