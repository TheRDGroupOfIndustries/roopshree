// "use client";

// import React, { useEffect, useState } from "react";
// import { getOrders, cancelOrder } from "@/services/orderService";
// import { useAuth } from "@/context/AuthProvider";
// import LoadingSpinner from "@/Components/LoadingSpinner";
// import { IoArrowBackOutline } from "react-icons/io5";
// import { useRouter } from "next/navigation";
// import { Status } from "@/generated/prisma/client";
// import toast from "react-hot-toast";
// import Image from "next/image";
// import {
//   Package,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   ShoppingBag,
// } from "lucide-react";
// import SmallLoadingSpinner from "@/Components/SmallLoadingSpinner";

// interface Order {
//   id: string;
//   totalAmount: number;
//   status: Status;
//   quantity: number;
//   createdAt: string;
//   product: {
//     id: string;
//     title: string;
//     price: number;
//     images: string[];
//   };
//   address?: {
//     name: string;
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//   };
// }

// // Status options for filter
// const STATUS_OPTIONS = [
//   { value: "ALL", label: "All Orders" },
//   { value: Status.CONFIRMED, label: "Confirmed" },
//   { value: Status.DISPATCH, label: "Dispatched" },
//   { value: Status.OUTOFDELIVERY, label: "Out for Delivery" },
//   { value: Status.DELIVERED, label: "Delivered" },
//   { value: Status.CANCELLED, label: "Cancelled" },
// ];

// // Map status to UI configs
// const getStatusConfig = (status: Status) => {
//   switch (status) {
//     case Status.CONFIRMED:
//       return {
//         bg: "bg-blue-50",
//         badge: "bg-blue-100 text-blue-700",
//         icon: <Clock className="w-4 h-4" />,
//       };
//     case Status.DISPATCH:
//       return {
//         bg: "bg-purple-50",
//         badge: "bg-purple-100 text-purple-700",
//         icon: <Package className="w-4 h-4" />,
//       };
//     case Status.OUTOFDELIVERY:
//       return {
//         bg: "bg-amber-50",
//         badge: "bg-amber-100 text-amber-700",
//         icon: <Clock className="w-4 h-4" />,
//       };
//     case Status.DELIVERED:
//       return {
//         bg: "bg-green-50",
//         badge: "bg-green-100 text-green-700",
//         icon: <CheckCircle2 className="w-4 h-4" />,
//       };
//     case Status.CANCELLED:
//       return {
//         bg: "bg-red-50",
//         badge: "bg-red-100 text-red-700",
//         icon: <XCircle className="w-4 h-4" />,
//       };
//     default:
//       return {
//         bg: "bg-gray-50",
//         badge: "bg-gray-100 text-gray-700",
//         icon: <Package className="w-4 h-4" />,
//       };
//   }
// };

// const OrdersPage: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [cancellingId, setCancellingId] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState<string>("ALL");

//   const router = useRouter();
//   const { user } = useAuth();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       try {
//         const res = await getOrders();
//         setOrders(res.orders || []);
//         setFilteredOrders(res.orders || []);
//       } catch (err) {
//         toast.error("Failed to fetch orders");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     if (statusFilter === "ALL") setFilteredOrders(orders);
//     else setFilteredOrders(orders.filter((o) => o.status === statusFilter));
//   }, [statusFilter, orders]);

//   const handleCancelOrder = async (orderId: string) => {
//     if (!window.confirm("Cancel this order?")) return;
//     try {
//       setCancellingId(orderId);
//       await cancelOrder(orderId);
//       toast.success("Order cancelled");
//       setOrders((prev) =>
//         prev.map((o) =>
//           o.id === orderId ? { ...o, status: Status.CANCELLED } : o
//         )
//       );
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to cancel order");
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return `${date.getDate().toString().padStart(2, "0")}/${(
//       date.getMonth() + 1
//     )
//       .toString()
//       .padStart(2, "0")}/${date.getFullYear()}`;
//   };

//   if (!user)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
//         <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
//         <p className="text-gray-700 mb-4 text-center font-medium">
//           Please login to view your orders.
//         </p>
//         <button
//           onClick={() => router.push("/login")}
//           className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow transition"
//         >
//           Login Now
//         </button>
//       </div>
//     );

//   if (loading) return <LoadingSpinner message="Fetching your orders..." />;

//   if (orders.length === 0)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
//         <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
//         <p className="text-gray-700 text-center font-medium mb-2">
//           No orders yet
//         </p>
//         <p className="text-gray-500 text-sm text-center mb-6">
//           Start shopping to place your first order
//         </p>
//         <button
//           onClick={() => router.push("/home")}
//           className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow transition"
//         >
//           Shop Now
//         </button>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 ">
//       {/* Header */}
//       <header className="sticky top-0 bg-white px-4 py-3 flex items-center shadow-sm z-30 border-b border-gray-200">
//         <button
//           onClick={() => router.back()}
//           className="p-2 hover:bg-gray-100 rounded-lg transition"
//         >
//           <IoArrowBackOutline className="text-xl text-gray-700" />
//         </button>
//         <h2 className="font-semibold text-lg text-gray-900 flex-1 text-center">
//           My Orders
//         </h2>
//         <div className="w-8" />
//       </header>

//       <div className="px-3">
//         {/* Status Filter */}
//         <div className="my-4 flex overflow-x-auto gap-2 scrollbar-hide ">
//           {STATUS_OPTIONS.map((opt) => (
//             <button
//               key={opt.value}
//               className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition ${
//                 statusFilter === opt.value
//                   ? "bg-[var(--color-brand)] text-white"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//               onClick={() => setStatusFilter(opt.value)}
//             >
//               {opt.label}
//             </button>
//           ))}
//         </div>

//         {/* Orders */}
//         <div className="space-y-3">
//           {filteredOrders.map((order) => {
//             const cfg = getStatusConfig(order.status);
//             return (
//               <div
//                 key={order.id}
//                 className={`p-3 rounded-lg ${cfg.bg} shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition`}
//               >
//                 {/* Image on left */}
//                 <div className="w-18 h-18 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 ">
//                   <Image
//                     src={
//                       order.product.images[0] || "/images/placeholder_image.png"
//                     }
//                     alt={order.product.title || "Product Image"}
//                     width={56}
//                     height={56}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* Title, price, quantity in single column */}
//                 <div className="min-w-0 flex-1">
//                   <h3
//                     className="text-sm font-semibold text-gray-900 line-clamp-2"
//                     title={order.product.title}
//                   >
//                     {order.product.title}
//                   </h3>
//                   <div className="flex items-center gap-2 mt-1">
//                     <p className="text-base font-medium text-gray-900">
//                       ₹{order.totalAmount.toLocaleString()}
//                     </p>
//                     <span className="text-xs text-gray-400">•</span>
//                     <span className="text-xs text-gray-600">
//                       Qty: {order.quantity}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {formatDate(order.createdAt)}
//                   </p>
//                 </div>

//                 {/* Status badge and button on right */}
//                 <div className="flex flex-col items-end gap-4 shrink-0">
//                   <span
//                     className={`text-xs px-2.5 py-1 rounded-full ${cfg.badge} flex items-center gap-1 whitespace-nowrap`}
//                   >
//                     {cfg.icon} {order.status}
//                   </span>

//                   {order.status !== Status.CANCELLED &&
//                     order.status !== Status.DELIVERED && (
//                       <button
//                         onClick={() => handleCancelOrder(order.id)}
//                         disabled={cancellingId === order.id}
//                         className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded text-xs font-medium transition whitespace-nowrap"
//                       >
//                         {cancellingId === order.id ? <span className="flex items-center gap-2"><SmallLoadingSpinner /> Cancel</span>

//  : "Cancel"}
//                       </button>
//                     )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;


"use client";

import React, { useEffect, useState } from "react";
import { getOrders, cancelOrder } from "@/services/orderService";
import { useAuth } from "@/context/AuthProvider";
import LoadingSpinner from "@/Components/LoadingSpinner";
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Status } from "@/generated/prisma/client";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import SmallLoadingSpinner from "@/Components/SmallLoadingSpinner";

interface Order {
  id: string;
  totalAmount: number;
  status: Status;
  quantity: number;
  createdAt: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
  address?: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Orders" },
  { value: Status.CONFIRMED, label: "Confirmed" },
  { value: Status.DISPATCH, label: "Dispatched" },
  { value: Status.OUTOFDELIVERY, label: "Out for Delivery" },
  { value: Status.DELIVERED, label: "Delivered" },
  { value: Status.CANCELLED, label: "Cancelled" },
];

const getStatusConfig = (status: Status) => {
  switch (status) {
    case Status.CONFIRMED:
      return { bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", icon: <Clock className="w-4 h-4" /> };
    case Status.DISPATCH:
      return { bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700", icon: <Package className="w-4 h-4" /> };
    case Status.OUTOFDELIVERY:
      return { bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700", icon: <Clock className="w-4 h-4" /> };
    case Status.DELIVERED:
      return { bg: "bg-green-50", badge: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-4 h-4" /> };
    case Status.CANCELLED:
      return { bg: "bg-red-50", badge: "bg-red-100 text-red-700", icon: <XCircle className="w-4 h-4" /> };
    default:
      return { bg: "bg-gray-50", badge: "bg-gray-100 text-gray-700", icon: <Package className="w-4 h-4" /> };
  }
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // 👇 For custom confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getOrders();
        setOrders(res.orders || []);
        setFilteredOrders(res.orders || []);
      } catch (err) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "ALL") setFilteredOrders(orders);
    else setFilteredOrders(orders.filter((o) => o.status === statusFilter));
  }, [statusFilter, orders]);

  const confirmCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowConfirm(true);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      setCancellingId(selectedOrderId);
      setShowConfirm(false);
      await cancelOrder(selectedOrderId);
      toast.success("Order cancelled");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrderId ? { ...o, status: Status.CANCELLED } : o
        )
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
      setSelectedOrderId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    ).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-700 mb-4 text-center font-medium">
          Please login to view your orders.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow transition"
        >
          Login Now
        </button>
      </div>
    );

  if (loading) return <LoadingSpinner message="Fetching your orders..." />;

  if (orders.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-700 text-center font-medium mb-2">
          No orders yet
        </p>
        <p className="text-gray-500 text-sm text-center mb-6">
          Start shopping to place your first order
        </p>
        <button
          onClick={() => router.push("/home")}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow transition"
        >
          Shop Now
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white px-4 py-3 flex items-center shadow-sm z-30 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <IoArrowBackOutline className="text-xl text-gray-700" />
        </button>
        <h2 className="font-semibold text-lg text-gray-900 flex-1 text-center">
          My Orders
        </h2>
        <div className="w-8" />
      </header>

      <div className="px-3">
        {/* Status Filter */}
        <div className="my-4 flex overflow-x-auto gap-2 scrollbar-hide">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium transition ${
                statusFilter === opt.value
                  ? "bg-[var(--color-brand)] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const cfg = getStatusConfig(order.status);
            return (
              <div
                key={order.id}
                className={`p-3 rounded-lg ${cfg.bg} shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition`}
              >
                {/* Image */}
                <div className="w-18 h-18 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      order.product.images[0] || "/images/placeholder_image.png"
                    }
                    alt={order.product.title || "Product Image"}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2" title={order.product.title}>
                    {order.product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-base font-medium text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">
                      Qty: {order.quantity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Status and Cancel */}
                <div className="flex flex-col items-end gap-4 shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${cfg.badge} flex items-center gap-1 whitespace-nowrap`}
                  >
                    {cfg.icon} {order.status}
                  </span>

                  {order.status !== Status.CANCELLED &&
                    order.status !== Status.DELIVERED && (
                      <button
                        onClick={() => confirmCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded text-xs font-medium transition whitespace-nowrap"
                      >
                        {cancellingId === order.id ? (
                          <span className="flex items-center gap-2">
                            <SmallLoadingSpinner /> Cancel
                          </span>
                        ) : (
                          "Cancel"
                        )}
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Custom Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-4 shadow-lg w-[80%] max-w-[300px] border border-gray-100">
            <h4 className="text-md font-semibold mb-2 text-gray-900 text-center">
              Cancel Order
            </h4>
            <p className="text-gray-600 mb-4 text-sm text-center">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                onClick={handleCancelOrder}
              >
                Yes
              </button>
              <button
                className="flex-1 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium transition-colors"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
