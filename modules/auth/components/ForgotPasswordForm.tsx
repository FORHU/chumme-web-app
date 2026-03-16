"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthCard } from "@/modules/auth/components/AuthCard";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthLayout headline={["Forgot your", "password?"]} tagline="No worries — we'll send a reset link to your inbox.">
      <motion.div
        key="forgot"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <AuthCard tone="light">
          <button
            type="button"
            onClick={() => router.push("/auth")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#A53860] transition-colors mb-6 font-['Poppins',sans-serif]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#EF88AD] to-[#A53860] rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700 font-['Poppins',sans-serif]">
                If an account exists for{" "}
                <span className="font-semibold text-gray-900">{email}</span>,
                you&apos;ll receive an email with reset instructions shortly.
              </div>
              <button
                type="button"
                onClick={() => router.push("/auth")}
                className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full h-12 pl-12 pr-4 rounded-xl font-['Poppins',sans-serif] text-sm placeholder:text-gray-400 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none border border-gray-200 bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </AuthCard>
      </motion.div>
    </AuthLayout>
  );
}
