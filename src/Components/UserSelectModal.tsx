"use client";

interface UserSelectModalProps {
  show: boolean;
  onClose: () => void;
  users: any[];
  selectedRole: "user" | "admin" | "delivery_boy";
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
    role: "admin" | "delivery_boy" | "user"
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
        alert("Failed to update role. Please try again.");
      } else {
        console.log("Role updated successfully");
        alert("Role updated successfully!");
        await refetchUsers(); // REFRESH THE USER LIST - ensure it completes
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-amber-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            Select User to Add as{" "}
            {selectedRole === "admin" ? "Admin" : "Delivery Boy"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Current Role:{" "}
                      <span className="font-medium">{user.role}</span>
                    </p>
                  </div>
                  
                  {/* Add Role Button */}
                  <button
                    onClick={() => handleRoleChange(user.id, selectedRole)}
                    className="ml-4 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all duration-150 flex items-center gap-2 font-medium"
                  >
                    <span className="text-xl">+</span>
                    <span>Add</span>
                  </button>

                  {/* Reset to USER Button */}
                  <button
                    onClick={() => handleRoleChange(user.id, "user")}
                    className="ml-4 bg-[#ee3832] text-white px-4 py-2 rounded-lg hover:bg-[#d82b2b] transition-all duration-150 flex items-center gap-2 font-medium"
                  >
                    <span className="text-xl">-</span>
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
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
