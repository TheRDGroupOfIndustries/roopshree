import React, { useEffect, useState } from "react";
import { X, ShoppingBag, MapPin, Truck } from "lucide-react";
import { getOrder } from "@/lib/actions/orderActions";

/**
 * Utility function to format the date and time.
 */
const formatDateTime = (isoString: string) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString; // return raw string if parsing fails
  }
};

/**
 * Component to display a single detail field.
 */
const DetailField = ({
  label,
  value,
  className = "",
  children,
}: {
  label: string;
  value: any;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className={`flex flex-col ${className}`}>
    <span className="text-sm font-medium uppercase text-gray-500">{label}</span>
    <span
      className={`${
        label.includes("Email") || label.includes("ID") ? "" : "capitalize"
      } font-semibold text-gray-800`}
    >
      {value || "N/A"}
    </span>
  </div>
);

const OrderDetailsModal = ({
  onClose,
  orderId,
}: {
  onClose: () => void;
  orderId: string;
}) => {
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [order, setOrder] = useState<any>(null);

  const fetchOrder = async () => {
    try {
      const res = await getOrder(orderId);
      console.log("order: ", res);
      setOrder(res[0]);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Format the total amount to INR/currency style (assuming INR based on phone number)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fullAddress = order?.address
    ? `${order?.address.address}, ${order?.address.city}, ${order?.address.state} - ${order?.address.zipCode}, ${order?.address.country}`
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-400/50 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 transform transition-all scale-100 duration-300">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2 text-indigo-600" />
            Order Details:{" "}
            <span className="ml-2 text-indigo-600">{orderId}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Grid Layout for Details */}
        {loadingOrder ? (
          <div className="h-[500px] text-gray-500 bg-white rounded-lg border border-dashed border-gray-200 text-center flex items-center justify-center">
            <p>Loading Orders...</p>
          </div>
        ) : order ? (
          <div className="p-6 space-y-6">
            {/* --- Section 1: Order Status & Timestamps --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-gray-50">
              <DetailField
                label="Current Status"
                value={order?.status}
                className="col-span-1"
              >
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${
                    order?.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : order?.status === "SHIPPED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order?.status}
                </span>
              </DetailField>
              <DetailField
                label="Total Amount"
                value={formatCurrency(order?.totalAmount)}
                className="col-span-1"
              />
              <DetailField
                label="Ordered On"
                value={formatDateTime(order?.createdAt)}
                className="col-span-1"
              />
            </div>

            {/* --- Section 2: Customer & Address --- */}
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
              Customer & Delivery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 space-y-2">
                <DetailField label="Customer Name" value={order?.user?.name} />
                <DetailField
                  label="Customer Email"
                  value={order?.user?.email}
                />
                <DetailField label="Payment Mode" value={order?.paymentMode} />
              </div>
              <div className="col-span-2 space-y-2">
                <DetailField label="Shipping To" value={order?.address?.name} />
                <DetailField
                  label="Contact Phone"
                  value={order?.address?.phone}
                />
                <DetailField label="Full Address" value={fullAddress} />
              </div>
            </div>

            {/* --- Section 3: Product Details --- */}
            <h3 className="text-xl font-semibold text-gray-800 flex items-center pt-4 border-t mt-4">
              <ShoppingBag className="w-5 h-5 mr-2 text-indigo-500" />
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <DetailField label="Product Name" value={order?.product?.title} />
              <DetailField label="Quantity" value={order?.quantity} />
              <DetailField label="Color" value={order?.color} />
              <DetailField label="Size" value={order?.size} />
              <DetailField
                label="Item Price (per unit)"
                value={
                  order?.product?.price
                    ? formatCurrency(order?.product.price)
                    : "N/A"
                }
              />
              <DetailField
                label="Exclusive Discount"
                value={
                  order?.product?.exclusive
                    ? `${order?.product.exclusive}%`
                    : "None"
                }
              />
            </div>

            {/* --- Section 4: Logistics --- */}
            <h3 className="text-xl font-semibold text-gray-800 flex items-center pt-4 border-t mt-4">
              <Truck className="w-5 h-5 mr-2 text-indigo-500" />
              Logistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailField
                label="Delivery Boy"
                value={order?.deliveryBoy?.name || "Unassigned"}
              />
              <DetailField
                label="Delivery Boy Email"
                value={order?.deliveryBoy?.email || "N/A"}
              />
              <DetailField label="Order ID (DB)" value={order?.id} />
              <DetailField label="Product ID (DB)" value={order?.productId} />
            </div>
          </div>
        ) : (
          <div className="h-64 text-gray-500 bg-white rounded-lg border border-dashed border-gray-200 text-center flex items-center justify-center">
            <p>Order Details not found.</p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
