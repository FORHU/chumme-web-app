"use client";

import { motion } from "framer-motion";
import { Shield, Users } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

interface RoleSelectionProps {
  onSelectRole: (role: "admin" | "user") => void;
  onSignIn: () => void;
}

export const RoleSelection = ({
  onSelectRole,
  onSignIn,
}: RoleSelectionProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div
      key="role-selection"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl shadow-lg p-10 w-full lg:w-[680px] border ${
        isDark
          ? "bg-gray-900/50 backdrop-blur-md border-gray-800"
          : "bg-white/80 backdrop-blur-md border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="mb-10 text-center">
        <h2
          className={`text-3xl font-bold mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Which one are you?
        </h2>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Select your role to continue
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl p-8 border-2 transition-all ${
            isDark
              ? "bg-gray-800/50 border-gray-700 hover:border-[#A53860]"
              : "bg-gray-50 border-gray-200 hover:border-[#A53860]"
          }`}
        >
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3
            className={`text-xl font-bold text-center mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Admin
          </h3>

          <p
            className={`text-sm text-center mb-6 leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage platform, users, communities, and analytics
          </p>

          <button
            type="button"
            onClick={() => onSelectRole("admin")}
            className="w-full h-12 bg-linear-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all"
          >
            Continue as Admin
          </button>
        </motion.div>

        {/* User Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl p-8 border-2 transition-all ${
            isDark
              ? "bg-gray-800/50 border-gray-700 hover:border-[#EF88AD]"
              : "bg-gray-50 border-gray-200 hover:border-[#EF88AD]"
          }`}
        >
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#EF88AD] to-[#A53860] flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3
            className={`text-xl font-bold text-center mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            User
          </h3>

          <p
            className={`text-sm text-center mb-6 leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Discover communities, chat, and explore content
          </p>

          <button
            type="button"
            onClick={() => onSelectRole("user")}
            className="w-full h-12 bg-linear-to-r from-[#EF88AD] to-[#A53860] hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all"
          >
            Continue as User
          </button>
        </motion.div>
      </div>

      {/* Sign In Link */}
      <div
        className={`text-center pt-8 mt-6 border-t ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignIn}
            className="text-[#A53860] hover:text-[#670D2F] font-semibold transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </motion.div>
  );
};
