"use client";

import { toast } from "react-hot-toast";

interface UserSelectModalProps {
  show: boolean;
  onClose: () => void;
  users: any[];
  selectedRole: "user" | "admin" | "delivery_boy" | "EXCLUSIVE_USER";
  refetchUsers: () => void; // Function to refresh the users list
}

const UserSelectModal: React.FC<UserSelectModalProps> = ({
  show,
  onClose,
  users,
  selectedRole,
  refetchUsers,
}) => {
  if (!show) return null;

  const handleRoleChange = async (
    userId: string,
    role: "user" | "admin" | "delivery_boy" | "EXCLUSIVE_USER"
  ) => {
    try {
      const roleToSend = role.toUpperCase(); // Convert to uppercase for backend

      const res = await fetch(`/api/auth/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: roleToSend }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error updating role:", errorData);
        toast.error("Failed to update role. Please try again.");
      } else {
        toast.success("Role updated successfully!");
        await refetchUsers(); // REFRESH THE USER LIST
        onClose(); // Close the modal after success
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-amber-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold pr-2">
            Select User to Add as{" "}
            {selectedRole === "admin"
              ? "Admin"
              : selectedRole === "delivery_boy"
              ? "Delivery Boy"
              : "Exclusive User"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl sm:text-3xl font-bold flex-shrink-0 w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-60px)] sm:max-h-[calc(80vh-80px)]">
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 gap-3"
                >
                  <div className="flex-1 w-full sm:w-auto">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{user.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-all">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Current Role:{" "}
                      <span className="font-medium">{user.role}</span>
                    </p>
                  </div>
                  
                  {/* Buttons Container */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* Add Role Button */}
                    <button
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          selectedRole === "EXCLUSIVE_USER"
                            ? "EXCLUSIVE_USER"
                            : selectedRole
                        )
                      }
                      className="flex-1 sm:flex-initial bg-amber-600 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-amber-700 transition-all duration-150 flex items-center justify-center gap-1 sm:gap-2 font-medium"
                    >
                      <span className="text-lg sm:text-xl">+</span>
                      <span>Add</span>
                    </button>

                    {/* Reset to USER Button */}
                    <button
                      onClick={() => handleRoleChange(user.id, "user")}
                      className="flex-1 sm:flex-initial bg-[#ee3832] text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-[#d82b2b] transition-all duration-150 flex items-center justify-center gap-1 sm:gap-2 font-medium"
                    >
                      <span className="text-lg sm:text-xl">-</span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
              No users available
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserSelectModal;
