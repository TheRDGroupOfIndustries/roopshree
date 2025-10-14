"use client";
import Navbar from "@/Components/admin/Navbar";
import Sidebar from "@/Components/admin/Sidebar";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth/signin");
      } else if (user.role !== "ADMIN") {
        router.replace("/home");
      }
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  if (user.role !== "ADMIN") return null;

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Navbar at top */}
      <Navbar />

      {/* Sidebar + Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
