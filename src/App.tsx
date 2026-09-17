/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import LandingPage from "@/pages/LandingPage";
import UploadPage from "@/pages/UploadPage";
import ResultsPage from "@/pages/ResultsPage";
import UserDashboard from "@/pages/UserDashboard";
import AuthPage from "@/components/auth/auth-page";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        // If user already has an active session and visits auth pages, redirect to dashboard
        if (pathname === "/login" || pathname === "/register") {
          router.replace("/dashboard");
        }
      }
    } catch (err) {
      console.warn("Could not access localStorage for auth check:", err);
    }
  }, [pathname, router]);

  const renderRoute = () => {
    switch (pathname) {
      case "/dashboard":
      case "/library":
        return <UserDashboard />;
      case "/upload":
        return <UploadPage />;
      case "/results":
        return <ResultsPage />;
      case "/login":
      case "/register":
        return <AuthPage initialMode={pathname === "/register" ? "register" : "login"} />;
      case "/":
      default:
        return <LandingPage />;
    }
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-gray-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <div className="flex-grow flex flex-col">{renderRoute()}</div>
      {!isAuthPage && <Footer />}
      <Toaster position="top-right" richColors />
    </div>
  );
}

