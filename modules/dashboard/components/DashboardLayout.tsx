"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Settings,
  User,
  Menu,
  X,
  Radio,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import { NAV_ITEMS } from "@/modules/dashboard/constants/nav-items";
import { useDashboardStore } from "@/modules/dashboard/store/useDashboardStore";
import { useAuthStore } from "@/modules/shared/store/useAuthStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const {
    activeNav,
    setActiveNav,
    expandedItems,
    toggleExpanded,
    setExpanded,
    isSidebarOpen,
    setSidebarOpen,
  } = useDashboardStore();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile, setSidebarOpen]);

  // Permission check
  const canManage = () => {
    // Current logic: users are automatically admin
    return true;
  };

  useEffect(() => {
    // Find active nav item based on current pathname
    let found = false;
    for (const item of NAV_ITEMS) {
      if (item.href === pathname) {
        setActiveNav(item.label);
        found = true;
        break;
      }
      if (item.children) {
        const child = item.children.find((c) => c.href === pathname);
        if (child) {
          setActiveNav(child.label);
          setExpanded(item.label, true);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      if (pathname === "/dashboard") {
        setActiveNav("Dashboard");
      } else if (pathname.includes("/dashboard/profile")) {
        setActiveNav("User Settings");
        setExpanded("Settings", true);
      }
    }
  }, [pathname, setActiveNav, setExpanded]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.displayName
    ? user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : user?.username?.substring(0, 2).toUpperCase() || "??";

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
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : (isMobile ? -264 : 0),
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`w-64 shrink-0 flex flex-col border-r h-screen fixed lg:sticky top-0 z-50 lg:z-30 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
      >
        {/* Logo & Close Button */}
        <div
          className={`p-6 border-b flex items-center justify-between gap-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="Chumme"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-xl tracking-wide text-white">CHUMME</span>
            </div>
          </Link>

          {/* Close Sidebar (Mobile Only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            // Check permissions
            if (item.can_manage && !canManage()) return null;

            const isExpanded = expandedItems[item.label];
            const hasChildren = item.children && item.children.length > 0;
            const isParentActive =
              activeNav === item.label ||
              item.children?.some((child) => activeNav === child.label);

            if (hasChildren) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      toggleExpanded(item.label);
                      if (item.href !== "#") {
                        router.push(item.href);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isParentActive
                      ? "bg-linear-to-r from-[#A53860] to-[#670D2F] text-white shadow-md font-semibold"
                      : isDark
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium flex-1 text-left text-sm">
                      {item.label}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && item.children && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 ml-9 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.label}
                              onClick={() => {
                                setActiveNav(child.label);
                                router.push(child.href);
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all ${activeNav === child.label
                                ? "text-[#A53860] bg-[#A53860]/10 font-bold"
                                : isDark
                                  ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <child.icon className="w-3.5 h-3.5 shrink-0" />
                                {child.label}
                              </div>
                            </button>
                          ))}
                          {/* Ensure Live Video API is present if not already in children */}
                          {item.label === "Categories" && !item.children.some(c => c.label === "Live Video API") && (
                            <button
                              onClick={() => {
                                setActiveNav("Live Video API");
                                router.push("/dashboard/categories/live-video");
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all ${activeNav === "Live Video API"
                                ? "text-[#A53860] bg-[#A53860]/10 font-bold"
                                : isDark
                                  ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <Radio className="w-3.5 h-3.5 shrink-0" />
                                Live Video API
                              </div>
                            </button>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setActiveNav(item.label)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeNav === item.label
                    ? "bg-linear-to-r from-[#A53860] to-[#670D2F] text-white shadow-md font-semibold"
                    : isDark
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              </div>
            );
          })}
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
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${!isDark
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-200"
                }`}
            >
              <Sun className="w-4 h-4" /> Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${isDark
                ? "bg-gray-700 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
          </div>
          {/* Profile Display Section */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full text-left"
            >
              <div className="w-10 h-10 rounded-full border-2 border-[#A53860] bg-linear-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                  {user?.displayName || user?.username || "Chumme User"}
                </p>
                <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {user?.email || "user@chumme.com"}
                </p>
              </div>
            </button>

            {/* Dropdown (Adjusted for Sidebar Position) */}
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`absolute bottom-full left-0 mb-2 w-64 rounded-2xl shadow-2xl z-50 overflow-hidden border ${isDark
                    ? "bg-gray-900 border-gray-700/50"
                    : "bg-white border-gray-200"
                    }`}
                >
                  {/* Profile Info (In Dropdown too, for consistency) */}
                  <div className={`px-4 py-4 border-b ${isDark ? "border-gray-700/50" : "border-gray-200"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center text-white font-bold text-lg">
                        {initials}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                          {user?.displayName || user?.username || "Chumme User"}
                        </p>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {user?.email || "user@chumme.com"}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#A53860]/20 text-[#EF88AD]">
                          {user?.role === "ADMIN" ? "Admin" : "Creator"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {[
                      { icon: User, label: "View Profile", action: () => router.push("/dashboard/profile") },
                      { icon: Settings, label: "Settings", action: () => router.push("/dashboard/settings") },
                      { icon: Bell, label: "Notifications", action: () => { } },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={() => { action(); setProfileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                      >
                        <Icon className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Divider + Logout */}
                  <div className={`border-t py-2 ${isDark ? "border-gray-700/50" : "border-gray-200"}`}>
                    <button
                      onClick={() => { setProfileMenuOpen(false); handleSignOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className={`sticky top-0 z-20 border-b px-4 lg:hidden py-4 flex items-center gap-4 ${isDark
            ? "bg-gray-900/95 border-gray-700 backdrop-blur-sm"
            : "bg-white/95 border-gray-200 backdrop-blur-sm"
            }`}
        >
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-xl border transition-colors ${isDark
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
          >
            <Menu className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-600"}`} />
          </button>




        </motion.header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
