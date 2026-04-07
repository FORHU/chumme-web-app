"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { NAV_ITEMS } from "@/modules/dashboard/constants/nav-items";
import { useDashboardStore } from "@/modules/dashboard/store/useDashboardStore";
import { useAuthStore } from "@/modules/shared/store/useAuthStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { activeNav, setActiveNav, settingsExpanded, setSettingsExpanded } =
    useDashboardStore();

  useEffect(() => {
    const currentNavItem = NAV_ITEMS.find((item) => item.href === pathname);
    if (currentNavItem) {
      setActiveNav(currentNavItem.label);
    } else if (pathname === "/dashboard") {
      setActiveNav("Dashboard");
    } else if (pathname.includes("profile")) {
      setActiveNav("Profile");
    } else if (pathname.includes("/dashboard/settings")) {
      if (pathname.endsWith("/roles")) {
        setActiveNav("Roles & Permissions");
        setSettingsExpanded(true);
      } else if (pathname.endsWith("/apk")) {
        setActiveNav("APK Download");
        setSettingsExpanded(true);
      } else {
        setActiveNav("Settings");
        setSettingsExpanded(true);
      }
    }
  }, [pathname, setActiveNav, setSettingsExpanded]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace("/auth");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-linear-to-br from-[#0a0a0a] via-[#1a0510] to-[#0a0a0a]" : "bg-linear-to-br from-[#fce7f3] via-[#fce1ed] to-[#f3e8ff]"}`}
    >
      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`w-64 shrink-0 flex flex-col border-r h-screen sticky top-0 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {/* Logo */}
        <div
          className={`p-6 border-b flex items-center gap-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <Image
            src="/logo.png"
            alt="Chumme"
            width={40}
            height={40}
            className="object-contain"
          />
          <span
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Chumme
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = activeNav === item.label;

            return (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setActiveNav(item.label)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    active
                      ? "bg-linear-to-r from-[#A53860] to-[#670D2F] text-white shadow-md font-semibold"
                      : isDark
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>

                {item.children && active && (
                  <div className="pl-7 mt-1 space-y-1">
                    {item.children.map((child) => {
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                            pathname === child.href
                              ? "text-[#A53860] bg-[#A53860]/10"
                              : isDark
                                ? "text-gray-400 hover:text-gray-200"
                                : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <child.icon className="w-3.5 h-3.5 shrink-0" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Settings Dropdown */}
          <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => {
                setSettingsExpanded((prev) => !prev);
                router.push("/dashboard/settings");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeNav === "Settings" ||
                activeNav === "Roles & Permissions" ||
                activeNav === "APK Download"
                  ? "bg-linear-to-r from-[#A53860] to-[#670D2F] text-white shadow-md font-semibold"
                  : isDark
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span className="font-medium flex-1 text-left text-sm">
                Settings
              </span>
              <motion.div
                animate={{ rotate: settingsExpanded ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            {/* Submenu */}
            <AnimatePresence>
              {settingsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 ml-9 space-y-1">
                    <button
                      onClick={() => router.push("/dashboard/settings/roles")}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all ${
                        activeNav === "Roles & Permissions"
                          ? "text-[#A53860] bg-[#A53860]/10 font-bold"
                          : isDark
                            ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      Roles & Permissions
                    </button>
                    <button
                      onClick={() => router.push("/dashboard/settings/apk")}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all ${
                        activeNav === "APK Download"
                          ? "text-[#A53860] bg-[#A53860]/10 font-bold"
                          : isDark
                            ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      APK Download
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Theme toggle + sign out */}
        <div
          className={`p-4 border-t space-y-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div
            className={`rounded-xl p-1 flex gap-1 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
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
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? "text-gray-500" : "text-gray-400"}`}
            />
            <input
              type="text"
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
            <Bell
              className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A53860]" />
          </button>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full border-2 border-[#A53860] bg-linear-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center text-white text-sm font-bold shrink-0">
            JD
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
