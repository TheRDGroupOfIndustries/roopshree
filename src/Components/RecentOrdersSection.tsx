"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getOrders } from "@/services/orderService";
import { Status } from "@/generated/prisma/client";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, XCircle, Package } from "lucide-react";
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
}

const getStatusConfig = (status: Status) => {
  switch (status) {
    case Status.CONFIRMED:
      return { badge: "bg-blue-100 text-blue-700", icon: <Clock className="w-3 h-3" /> };
    case Status.DISPATCH:
      return { badge: "bg-purple-100 text-purple-700", icon: <Package className="w-3 h-3" /> };
    case Status.OUTOFDELIVERY:
      return { badge: "bg-amber-100 text-amber-700", icon: <Clock className="w-3 h-3" /> };
    case Status.DELIVERED:
      return { badge: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> };
    case Status.CANCELLED:
      return { badge: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> };
    default:
      return { badge: "bg-gray-100 text-gray-700", icon: <Package className="w-3 h-3" /> };
  }
};

// Skeleton Loader
const OrderSkeleton = () => (
  <div className="flex items-center justify-between p-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 bg-gray-200 rounded-md" />
      <div className="space-y-2">
        <div className="w-32 h-3 bg-gray-200 rounded" />
        <div className="w-24 h-3 bg-gray-200 rounded" />
        <div className="w-20 h-3 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="w-16 h-4 bg-gray-200 rounded-full" />
  </div>
);

const RecentOrdersSection: React.FC = () => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await getOrders();
        const orders = res.orders || [];
        const sorted = orders.sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentOrders(sorted.slice(0, 3));
      } catch (err) {
        toast.error("Failed to load recent orders");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };


  return (
    <>
      <h2 className="mx-4 mb-2 text-lg font-semibold">Recent Orders</h2>
      <section className="mx-4 rounded-lg pb-2 border-gray-200">
        {loading ? (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-gray-500 mb-3">No recent orders</p>
            <Link
              href="/home"
              className="bg-[var(--color-brand)] text-white px-4 py-2 rounded-lg text-sm"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            {recentOrders.map((order) => {
              const cfg = getStatusConfig(order.status);
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 last:border-none hover:bg-gray-50 transition"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-200">
                      <Image
                        src={
                          order.product.images?.[0] ||
                          "/images/placeholder_image.png"
                        }
                        alt={order.product.title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 line-clamp-1">
                        {order.product.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        ₹{order.totalAmount.toLocaleString()} • Qty:{" "}
                        {order.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${cfg.badge} flex items-center gap-1 whitespace-nowrap`}
                  >
                    {cfg.icon} {order.status}
                  </span>
                </div>
              );
            })}

            {/* View All Link */}
            <div className="mt-4 text-center">
              <Link
                href="/my-orders"
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                View All Orders &rarr;
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default RecentOrdersSection;
