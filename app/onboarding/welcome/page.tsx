"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthCard } from "@/modules/auth/components/AuthCard";

export default function OnboardingWelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <AuthLayout headline={["You're all set!", ""]} tagline="Your Chumme account is ready. Time to connect with fans worldwide.">
      <motion.div
        key="welcome"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <AuthCard tone="light">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 16 }}
              className="flex justify-center mb-2"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-[#EF88AD] to-[#A53860] blur-xl opacity-40"
                />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center shadow-lg">
                  <Check className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome to Chumme!
              </h2>
              <p className="text-gray-600 font-['Poppins',sans-serif] leading-relaxed">
                Your account is ready. Start exploring communities and sharing
                moments with fans worldwide.
              </p>
              {email ? (
                <p className="text-sm text-gray-500 mt-3 font-['Poppins',sans-serif]">
                  Signed up as <span className="font-semibold">{email}</span>
                </p>
              ) : null}
            </div>

            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mb-2 space-y-3"
            >
              {["Discover fan communities", "Share & react to moments", "Collaborate with creators"].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-[#A53860]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#A53860]" />
                  </div>
                  {feat}
                </div>
              ))}
            </motion.div>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Get Started
            </button>
          </div>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  );
}
