// "use client";

// import React, { ReactNode, useEffect } from "react";
// import { useAuth } from "@/context/AuthProvider";
// import { usePathname, useRouter } from "next/navigation";
// import Navbar from "./Navbar";
// import LoadingSpinner from "./LoadingSpinner";

// interface AuthGuardProps {
//   children: ReactNode;
//   publicPaths?: string[]; 
  
// }

// const AuthGuard: React.FC<AuthGuardProps> = ({ children, publicPaths = ["/", "/auth/signin", "/auth/signup"]  }) => {
//   const { user, loading } = useAuth();
//   const pathname = usePathname();
//   const router = useRouter();

//   const isAdminPath = pathname.startsWith("/manage");
//   const isUserPath = pathname.startsWith("/home") || pathname.startsWith("/profile") || pathname.startsWith("/my-cart") || pathname.startsWith("/product") || pathname.startsWith("/search" )|| pathname.startsWith("/wallet");


  
//    useEffect(() => {
//     if (loading) return;

//     // If not logged in and not public route → redirect to signin
//     if (!user && !publicPaths.includes(pathname)) {
//       router.replace("/auth/signin");
//       return;
//     }

//     // If logged in but trying to access restricted area
//     if (user) {
//       if (user.role === "USER" && isAdminPath) {
//         router.replace("/home");
//       } else if (user.role === "ADMIN" && isUserPath) {
//         router.replace("/manage");
//       }
//     }
//   }, [loading, user, pathname, router, publicPaths, isAdminPath, isUserPath]);


//   if (loading) return <LoadingSpinner/>
//   if (!user && !publicPaths.includes(pathname)) return null;

//   return (
//     <>
//       {user && <Navbar />}
//       {children}
//     </>
//   );
// };

// export default AuthGuard;


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

  const isAdminRoute = pathname.startsWith("/manage");

  useEffect(() => {
    if (loading) return;

    // Not logged in → redirect to signin
    if (!user && !publicPaths.includes(pathname)) {
      router.replace("/auth/signin");
      return;
    }

    // Admin restriction
    if (user && user.role === "ADMIN" && !isAdminRoute) {
      // Admin trying to access user route → redirect to /manage
      router.replace("/manage");
      return;
    }

    // User restriction
    if (user && user.role === "USER" && isAdminRoute) {
      // User trying to access admin route → redirect to /home
      router.replace("/home");
      return;
    }

  }, [loading, user, pathname, router, publicPaths, isAdminRoute]);

  if (loading) return <LoadingSpinner />;
  if (!user && !publicPaths.includes(pathname)) return null;

  return (
    <>
      {user && <Navbar />}
      {children}
    </>
  );
};

export default AuthGuard;
