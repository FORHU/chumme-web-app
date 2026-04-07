"use client";

import { motion } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import React from "react";

import { cn } from "@/modules/shared/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  headline?: string[];
  tagline?: string;
  className?: string;
}

export const AuthLayout = ({
  children,
  headline = ["Where fan moments", "become shared experiences"],
  tagline = "Connect with fans around the world and share your passion in a vibrant community",
  className,
}: AuthLayoutProps) => {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <div
      className={cn("min-h-screen w-full relative overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute inset-0 transition-all duration-300 bg-linear-to-br",
          isDark
            ? "from-[#1a0510] via-[#0a0a0a] to-[#1a0510]"
            : "from-[#fce7f3] via-[#fce1ed] to-[#e9d5fd]",
        )}
      />

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(239, 136, 173, 0.2) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(165, 56, 96, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(239, 136, 173, 0.2) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 136, 173, 0.4) 0%, transparent 70%)",
          }}
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(165, 56, 96, 0.3) 0%, transparent 70%)",
          }}
          animate={{ y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-between px-8 lg:px-16 xl:px-24 py-12">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col max-w-xl"
        >
          <div className="mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative inline-block"
            >
              <motion.div
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 -m-8 blur-2xl rounded-full bg-linear-to-br from-[#EF88AD] to-[#A53860] opacity-30"
              />
              <Link
                href="/"
                aria-label="Go to landing page"
                className="block cursor-pointer"
              >
                <Image
                  src="/logo.png"
                  alt="Chumme"
                  width={96}
                  height={96}
                  className="relative w-24 h-24 object-contain drop-shadow-xl"
                  priority
                />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1
              className={cn(
                "font-['Poppins',sans-serif] text-5xl xl:text-6xl font-bold mb-5 leading-tight",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              {headline.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < headline.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p
              className={cn(
                "font-['Poppins',sans-serif] text-lg leading-relaxed max-w-md",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              {tagline}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 flex items-center gap-8"
          >
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 transition-colors",
                isDark
                  ? "text-gray-400 hover:text-[#EF88AD]"
                  : "text-gray-700 hover:text-[#A53860]",
              )}
            >
              <Globe className="w-5 h-5" />
              <span className="font-['Poppins',sans-serif] font-medium">
                English
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-6 text-sm font-['Poppins',sans-serif]">
              <a
                href="#"
                className="text-[#A53860] hover:text-[#670D2F] font-medium transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-[#A53860] hover:text-[#670D2F] font-medium transition-colors"
              >
                Plans
              </a>
              <a
                href="#"
                className="text-[#A53860] hover:text-[#670D2F] font-medium transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-auto"
        >
          {children}
        </motion.div>

        <Link
          href="/"
          aria-label="Go to landing page"
          className="lg:hidden absolute top-8 left-8 block cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt="Chumme"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            priority
          />
        </Link>
      </div>
    </div>
  );
};
