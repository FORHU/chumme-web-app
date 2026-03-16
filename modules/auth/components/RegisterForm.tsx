"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RouteGuard } from "@/modules/shared/components/RouteGuard";
import { useAuthStore } from "@/modules/shared/store/useAuthStore";
import { ChummeLoader } from "@/modules/shared/components/ChummeLoader";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { motion } from "framer-motion";
import {
  Apple,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!agreeTerms) {
        setError("Please accept the terms to continue.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const derivedUsernameRaw = email.split("@")[0] ?? "";
      const derivedUsername =
        derivedUsernameRaw
          .replace(/[^a-zA-Z0-9_]/g, "")
          .toLowerCase()
          .slice(0, 24) || "chumme_user";

      await register({
        email,
        username: derivedUsername,
        displayName: fullName,
        password,
      });

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
    }
  };

  return (
    <RouteGuard requireAuth={false}>
      {isLoading && <ChummeLoader fullScreen />}
      <AuthLayout>
        <motion.div
          key="signup"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <AuthCard>
            <button
              type="button"
              onClick={() => router.push("/auth")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#A53860] transition-colors mb-6 font-['Poppins',sans-serif]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                Sign Up
              </h2>
              <p className="text-sm text-gray-600">
                Create your account to get started
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-900">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#A53860] transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl font-['Poppins',sans-serif] text-sm placeholder:text-gray-400 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-900">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#A53860] transition-colors z-10" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl font-['Poppins',sans-serif] text-sm placeholder:text-gray-400 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-900">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#A53860] transition-colors z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 rounded-xl font-['Poppins',sans-serif] text-sm placeholder:text-gray-400 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#A53860] transition-colors z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-900">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#A53860] transition-colors z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl font-['Poppins',sans-serif] text-sm placeholder:text-gray-400 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none border border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-2 border-gray-300 accent-[#A53860]"
                />
                <span className="text-sm text-gray-600 font-['Poppins',sans-serif]">
                  I agree to the{" "}
                  <span className="text-[#A53860] font-semibold hover:text-[#670D2F] transition-colors">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-[#A53860] font-semibold hover:text-[#670D2F] transition-colors">
                    Privacy Policy
                  </span>
                </span>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? "Creating account…" : "Continue"}
                </button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 font-['Poppins',sans-serif] text-xs font-medium bg-white text-gray-500">
                    or with
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  className="border-2 rounded-full size-12 flex items-center justify-center transition-all bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <Apple className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  type="button"
                  className="border-2 rounded-full size-12 flex items-center justify-center transition-all bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20">
                    <path
                      fill="#4285F4"
                      d="M18.8 10.2083C18.8 9.55833 18.7417 8.93333 18.6333 8.33333H10V11.8833H14.9333C14.7167 13.025 14.0667 13.9917 13.0917 14.6417V16.95H16.0667C17.8 15.35 18.8 13 18.8 10.2083Z"
                    />
                    <path
                      fill="#34A853"
                      d="M10 19.1667C12.475 19.1667 14.55 18.35 16.0667 16.95L13.0917 14.6417C12.275 15.1917 11.2333 15.525 10 15.525C7.61667 15.525 5.59167 13.9167 4.86667 11.75H1.81667V14.1167C3.325 17.1083 6.41667 19.1667 10 19.1667Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M4.86667 11.7417C4.68333 11.1917 4.575 10.6083 4.575 10C4.575 9.39167 4.68333 8.80833 4.86667 8.25833V5.89167H1.81667C1.19167 7.125 0.833334 8.51667 0.833334 10C0.833334 11.4833 1.19167 12.875 1.81667 14.1083L4.19167 12.2583L4.86667 11.7417Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M10 4.48333C11.35 4.48333 12.55 4.95 13.5083 5.85L16.1333 3.225C14.5417 1.74167 12.475 0.833334 10 0.833334C6.41667 0.833334 3.325 2.89167 1.81667 5.89167L4.86667 8.25833C5.59167 6.09167 7.61667 4.48333 10 4.48333Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="border-2 rounded-full size-12 flex items-center justify-center transition-all bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="#1877F2">
                    <path d="M20 10.0608C20 4.53833 15.5225 0.0608336 10 0.0608336C4.4775 0.0608336 2.38419e-07 4.53833 2.38419e-07 10.0608C2.38419e-07 15.0525 3.65667 19.1892 8.4375 19.9392V12.9517H5.89833V10.06H8.4375V7.85833C8.4375 5.3525 9.93083 3.9675 12.215 3.9675C13.3083 3.9675 14.4533 4.16333 14.4533 4.16333V6.62417H13.1917C11.9492 6.62417 11.5617 7.395 11.5617 8.18583V10.0608H14.335L13.8917 12.9525H11.5617V19.94C16.3433 19.1892 20 15.0517 20 10.0608Z" />
                  </svg>
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/auth")}
                    className="text-[#A53860] hover:text-[#670D2F] font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </AuthCard>
        </motion.div>
      </AuthLayout>
    </RouteGuard>
  );
}
