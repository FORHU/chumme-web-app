"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthCard } from "@/modules/auth/components/AuthCard";

const OTP_LENGTH = 6;

export const VerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your email";

  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState<number>(147);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    if (timer > 0) {
      const timeout = window.setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => window.clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanResend(true);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput instanceof HTMLInputElement) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput instanceof HTMLInputElement) prevInput.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.join("").length === OTP_LENGTH) {
      router.push(`/onboarding/details?email=${encodeURIComponent(email)}`);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(147);
    setCanResend(false);
    setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...otp];
    paste.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    const idx = Math.min(paste.length, OTP_LENGTH - 1);
    inputRefs.current[idx]?.focus();
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <AuthLayout
      headline={["Check your", "inbox"]}
      tagline="Enter the 6-digit code we sent to verify your email address."
    >
      <motion.div
        key="verify"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <AuthCard>
          <button
            type="button"
            onClick={() =>
              router.push(`/register?email=${encodeURIComponent(email)}`)
            }
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
              Verify your email
            </h2>
            <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
              We sent a verification code to{" "}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={`otp-${index}`}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleOtpChange(index, e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleOtpKeyDown(index, e)
                  }
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 transition-all outline-none font-['Poppins',sans-serif]"
                  maxLength={1}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={otp.join("").length !== 6}
              className="w-full h-12 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              Verify Email
            </button>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 font-['Poppins',sans-serif]">
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className="text-[#A53860] hover:text-[#670D2F] font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none font-['Poppins',sans-serif]"
              >
                {canResend
                  ? "Resend OTP"
                  : `Resend in ${minutes}:${seconds.toString().padStart(2, "0")}`}
              </button>
            </div>
          </form>
        </AuthCard>
      </motion.div>
    </AuthLayout>
  );
};
