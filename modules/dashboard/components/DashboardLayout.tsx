"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/modules/shared/store/useAuthStore";
import { useTheme } from "next-themes";

import {
  Bell, Search, Sun, Moon, LogOut,
} from "lucide-react";
import { NAV_ITEMS } from "@/modules/dashboard/constants/nav-items";


interface DashboardLayoutProps {
children: React.ReactNode;
}
export function DashboardLayout({ children }: DashboardLayoutProps) {
const pathname = usePathname();
const router = useRouter();
const logout = useAuthStore((s) => s.logout);
const { resolvedTheme, setTheme } = useTheme();
const isDark = resolvedTheme === "dark";

const [search, setSearch] = useState("");
const handleSignOut = async () => {
  await logout();
  router.replace("/auth");
};
return (
<div className={`min-h-screen flex ${isDark ? "bg-gradient-to-br from-[#0a0a0a] via-[#1a0510] to-[#0a0a0a]" : "bg-gradient-to-br from-[#fce7f3] via-[#fce1ed] to-[#f3e8ff]"}`}>
{/* ── Sidebar ── */}
<motion.aside
initial={{ x: -260 }}
animate={{ x: 0 }}
transition={{ duration: 0.45, ease: "easeOut" }}
className={`w-64 flex-shrink-0 flex flex-col border-r h-screen sticky top-0 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
>
{/* Logo */}
<div className={`p-6 border-b flex items-center gap-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
<Image src="/logo.png" alt="Chumme" width={40} height={40} className="object-contain" />
<span className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Chumme</span>
</div>
    {/* Nav */}
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              active
                ? "bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white shadow-md"
                : isDark
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>

    {/* Theme toggle + sign out */}
    <div className={`p-4 border-t space-y-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
      <div className={`rounded-xl p-1 flex gap-1 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
        <button
          onClick={() => setTheme("light")}

          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            !isDark
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Sun className="w-4 h-4" /> Light
        </button>
        <button
          onClick={() => setTheme("dark")}

          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            isDark
              ? "bg-gray-700 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Moon className="w-4 h-4" /> Dark
        </button>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full ${
          isDark
            ? "text-gray-400 hover:bg-gray-800 hover:text-red-400"
            : "text-gray-500 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  </motion.aside>

  {/* ── Main column ── */}
  <div className="flex-1 flex flex-col min-w-0">
    {/* Header */}
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className={`sticky top-0 z-20 border-b px-8 py-4 flex items-center gap-4 ${
        isDark
          ? "bg-gray-900/95 border-gray-700 backdrop-blur-sm"
          : "bg-white/95 border-gray-200 backdrop-blur-sm"
      }`}
    >
      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? "text-gray-500" : "text-gray-400"}`} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search communities, collaborations…"
          className={`w-full h-11 pl-12 pr-4 rounded-xl border text-sm outline-none transition-all ${
            isDark
              ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A53860]"
              : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#A53860]"
          } focus:ring-2 focus:ring-[#A53860]/10`}
        />
      </div>

      {/* Bell */}
      <button
        className={`relative p-2 rounded-xl transition-colors ${
          isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
        }`}
      >
        <Bell className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-600"}`} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A53860]" />
      </button>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full border-2 border-[#A53860] bg-gradient-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        JD
      </div>
    </motion.header>

    {/* Page content */}
    <main className="flex-1 p-8 overflow-auto">
      {children}
    </main>
  </div>
</div>
);
}
