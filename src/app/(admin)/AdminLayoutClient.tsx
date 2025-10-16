"use client";

import SidebarNav from "@/components/SidebarNav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden w-64 bg-gray-800 p-4 shadow-md md:block">
        <div className="mb-8 text-center text-2xl font-bold text-white">
          My Blog
        </div>
        <SidebarNav />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-end bg-white p-4 shadow-md">
          <button
            onClick={handleLogout}
            className="flex items-center rounded-md bg-red-600 px-4 py-2 text-white"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
