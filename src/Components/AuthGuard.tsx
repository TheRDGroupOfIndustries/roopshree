"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import LoadingSpinner from "./LoadingSpinner";

interface AuthGuardProps {
  children: ReactNode;
  publicPaths?: string[]; 
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, publicPaths = ["/", "/auth/signin", "/auth/signup"] }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push("/auth/signin");
    }
  }, [loading, user, pathname, router, publicPaths]);

  if (loading) return <LoadingSpinner/>
  if (!user && !publicPaths.includes(pathname)) return null;

  return (
    <>
      {user && <Navbar />}
      {children}
    </>
  );
};

export default AuthGuard;
