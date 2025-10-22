"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Clipboard,
} from "lucide-react";
import {
  getDeliveryBoys,
  getOrders,
  updateOrderStatus,
} from "@/lib/actions/orderActions";
import OrderDetailsModal from "./OrderDetails";

// --- MOCK DATA ---
const initialOrders = Array.from({ length: 125 }).map((_, index) => {
  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled",
  ];
  const randomStatus =
    statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const randomTotal = (Math.random() * 500 + 50).toFixed(2);

  return {
    id: `ORD-${1000 + index}`,
    customerName: `Customer ${index + 1}`,
    date: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    ).toLocaleDateString("en-US"),
    totalAmount: parseFloat(randomTotal),
    status: randomStatus,
  };
});

const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = "";
  let icon = null;

  switch (status) {
    case "DELIVERED":
      colorClass = "bg-green-100 text-green-700";
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      break;
    case "CONFIRMED":
      colorClass = "bg-green-100 text-green-700";
      icon = <CheckCircle className="w-4 h-4 mr-1" />;
      break;
    case "DISPATCH":
      colorClass = "bg-blue-100 text-blue-700";
      icon = <Truck className="w-4 h-4 mr-1" />;
      break;
    case "OUTOFDELIVERY":
      colorClass = "bg-orange-100 text-orange-700";
      icon = <Truck className="w-4 h-4 mr-1" />;
      break;
    case "CANCELLED":
      colorClass = "bg-red-100 text-red-700";
      icon = <XCircle className="w-4 h-4 mr-1" />;
      break;
    default:
      colorClass = "bg-yellow-100 text-yellow-700";
      icon = <Clock className="w-4 h-4 mr-1" />;
      break;
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}
    >
      {icon}
      {status}
    </span>
  );
};

const StatusEditModal = ({ order, onClose, onSave }: any) => {
  const [newStatus, setNewStatus] = useState(order?.status || "CONFIRMED");
  const [deliveryBoyId, setDeliveryBoyId] = useState("");

  const [deliveryBoys, setDeliveryBoys] = useState<any[] | null>(null);
  const [error, setError] = useState<any>();

  const [updating, setUpdating] = useState(false);

  const fetchDeliveryBoys = async () => {
    try {
      const res = await getDeliveryBoys();
      console.log("delivery boys:", res);
      setDeliveryBoys(res);
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
    }
  };

  useEffect(() => {
    if (order) {
      fetchDeliveryBoys();
    }
  }, [order]);

  const handleSaveStatus = async () => {
    if (!newStatus) {
      setError({ kay: "status", message: "Please select a new status." });
      return;
    }
    if (newStatus === "OUTOFDELIVERY" && !deliveryBoyId) {
      setError({
        kay: "deliveryBoy",
        message: "Please select a delivery boy.",
      });
      return;
    }
    try {
      setUpdating(true);
      console.log(order.id, newStatus, deliveryBoyId);
      await updateOrderStatus(order.id, newStatus, deliveryBoyId);
      onSave(order.id, newStatus, deliveryBoyId);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-400/50 overflow-y-auto h-full w-full z-50 flex justify-center items-center  backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xl">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Edit Status for {order.id}
        </h3>
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select New Status
          </label>
          <select
            id="status"
            name="status"
            value={newStatus}
            onChange={(e) => {
              setNewStatus(e.target.value);
              setDeliveryBoyId("");
              setError(null);
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg border"
          >
            {[
              "CONFIRMED",
              "DISPATCH",
              "OUTOFDELIVERY",
              "CANCELLED",
              "DELIVERED",
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {error && error.kay === "status" && (
            <p className="text-sm text-red-600">{error.message}</p>
          )}
        </div>
        {newStatus === "OUTOFDELIVERY" && (
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Delivery Boy
            </label>
            <select
              id="status"
              name="status"
              value={deliveryBoyId}
              onChange={(e) => {
                setDeliveryBoyId(e.target.value);
                setError(null);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-lg border"
            >
              <option value="">Select Delivery Boy</option>
              {deliveryBoys?.map((boy) => (
                <option key={boy.id} value={boy.id}>
                  {boy.name} ({boy.email})
                </option>
              ))}
            </select>
            {error && error.kay === "deliveryBoy" && (
              <p className="text-sm text-red-600">{error.message}</p>
            )}
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveStatus}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition duration-150 shadow-md"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderManagement = ({ totalOrders }: { totalOrders: number }) => {
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState<any>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  // --- HANDLERS ---
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const orders = await getOrders({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      console.log("orders action: ", orders);
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  //   const handleViewDetails = (order) => {
  //     console.log("Viewing details for:", order);
  //     alert(
  //       `Order ID: ${order.id}\nCustomer: ${order.customerName}\nTotal: $${order.totalAmount}\nStatus: ${order.status}`
  //     );
  //   };

  const handleEditStatusClick = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSaveStatus = (
    orderId: string,
    newStatus: string,
    deliveryBoyId: string
  ) => {
    console.log("handlesaveStatus", orderId, newStatus, deliveryBoyId);
    setOrders((prevOrders: any[]) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = (orderId: string) => {
    // In a real app, this would involve a confirmation modal/dialog instead of a direct alert/confirm
    if (
      window.confirm(
        `Are you sure you want to cancel order ${orderId}? This cannot be undone.`
      )
    ) {
      setOrders((prevOrders: any[]) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Canceled" } : order
        )
      );
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 1500);
    });
  };

  return (
    <div className="">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        {/* <button className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg shadow-md hover:bg-amber-700 transition duration-150 text-sm font-medium">
          <Package className="w-5 h-5 mr-2" />
          Create New Order (Mock)
        </button> */}
      </header>

      {/* ✅ Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID or Status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {loadingOrders ? (
        <div className="h-64 text-gray-500 bg-white rounded-lg border border-dashed border-gray-200 text-center flex items-center justify-center">
          <p>Loading Orders...</p>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.filter((order: any) => {
                    const query = searchQuery.toLowerCase(); // ✅ ADDED
                    return (
                      order.id.toLowerCase().includes(query) ||
                      order.status.toLowerCase().includes(query)
                    );
                  }).map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600 flex items-center space-x-2">
                      {/* #{order.id.slice(0, 6)}... */}

                      <span title={order.id}>#{order.id.slice(0, 6)}...</span>
                      <button
                        onClick={() => handleCopyOrderId(order.id)}
                        className="text-gray-500 hover:text-amber-600 transition"
                      >
                        <Clipboard className="w-4 h-4" />
                      </button>
                      {copiedOrderId === order.id && (
                        <span className="text-xs text-green-600 ml-1">
                          Copied!
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {order.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {order.createdAt.toDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold hidden md:table-cell">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          title="View Details"
                          onClick={() => {
                            setIsDetailsModalOpen(true);
                            setSelectedOrder(order.id);
                          }}
                          className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition duration-150 cursor-pointer"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          title="Edit Status"
                          onClick={() => handleEditStatusClick(order)}
                          className="text-gray-500 hover:text-amber-600 p-1 rounded-full hover:bg-amber-50 transition duration-150 cursor-pointer"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        {/* <button
                          title="Cancel/Delete Order"
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition duration-150"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalOrders)}
                  </span>{" "}
                  of <span className="font-medium">{totalOrders}</span> results
                  (50 per page)
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {/* Simplified page indicators */}
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-amber-600 text-sm font-medium text-white">
                    {currentPage}
                  </span>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        </div>
      ) : (
        <div className="h-64 text-gray-500 bg-white rounded-lg border border-dashed border-gray-200 text-center flex items-center justify-center">
          <p>No orders found.</p>
        </div>
      )}

      {isModalOpen && (
        <StatusEditModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStatus}
        />
      )}

      {isDetailsModalOpen && (
        <OrderDetailsModal
          orderId={selectedOrder}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;
