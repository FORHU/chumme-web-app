"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthCard } from "@/modules/auth/components/AuthCard";

export default function OnboardingDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [username, setUsername] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/onboarding/welcome?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthLayout headline={["Tell us about", "yourself"]} tagline="Help us personalize your Chumme experience.">
      <motion.div
        key="details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <AuthCard tone="light">
          <button
            type="button"
            onClick={() => router.push(`/verify-email?email=${encodeURIComponent(email)}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#A53860] transition-colors mb-6 font-['Poppins',sans-serif]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Tell us about you
            </h2>
            <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
              Complete your profile to personalize your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-900">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#A53860] transition-colors z-10" />
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl font-['Poppins',sans-serif] text-sm placeholder:text-gray-400 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none border border-gray-200 bg-white text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-900">
                Date of Birth
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#A53860] transition-colors z-10" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl font-['Poppins',sans-serif] text-sm placeholder:text-gray-400 focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none border border-gray-200 bg-white text-gray-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all"
            >
              Complete Setup
            </button>
            <div className="flex gap-2 items-center pt-2">
              <div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-[#A53860] to-[#670D2F]" />
              <div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-[#A53860] to-[#670D2F]" />
              <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 ml-1">Step 2 of 3</span>
            </div>
          </form>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  );
}
