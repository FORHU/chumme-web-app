"use client";

import { motion } from "framer-motion";
import { Smartphone, Download, CheckCircle2, AlertCircle, RefreshCw, SmartphoneIcon } from "lucide-react";

export const APKDownload = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">APK Download</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Download the latest version of the Chumme Android application</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" /> Auto-update enabled
          </span>
        </div>
      </motion.div>

      <div className="mx-auto max-w-4xl max-h-[calc(100vh-200px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Download Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-1 p-8 bg-linear-to-br from-[#A53860] to-[#670D2F] rounded-3xl overflow-hidden relative group text-white shadow-xl shadow-[#A53860]/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Smartphone className="size-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Latest Release</h3>
              <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium">Get the current stable version of Chumme for Android devices.</p>
              
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-white/60 tracking-widest uppercase mb-1">Version</p>
                  <p className="text-xl font-bold">1.02.4-Beta</p>
                </div>
                <button
                  onClick={() => window.open('/chumme.apk')}
                  className="px-6 py-3 bg-white text-[#A53860] font-bold rounded-2xl flex items-center gap-2 hover:bg-[#F3D9E2] transition-colors shadow-lg active:scale-95"
                >
                  <Download className="w-5 h-5" /> Download Now
                </button>
              </div>
            </div>
          </motion.div>

          {/* Details & Specs */}
          <div className="md:col-span-1 space-y-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="p-6 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-sm"
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 italic">
                <SmartphoneIcon className="w-4 h-4 text-[#A53860]" /> Release Details
              </h4>
              <div className="space-y-4">
                {[
                  { label: "Release Date", value: "March 24, 2026", icon: CheckCircle2, color: "text-green-500" },
                  { label: "File Size",   value: "42.8 MB",       icon: CheckCircle2, color: "text-green-500" },
                  { label: "Requirements", value: "Android 9.0+",  icon: AlertCircle,  color: "text-[#A53860]" },
                ].map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between text-sm py-1">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{spec.label}</span>
                    <div className="flex items-center gap-2">
                       <spec.icon className={`w-3.5 h-3.5 ${spec.color}`} />
                       <span className="text-gray-900 dark:text-white font-bold">{spec.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.35 }}
              className="p-6 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-sm"
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 italic">Change Log 1.02.4</h4>
              <ul className="space-y-3 text-xs text-gray-500 dark:text-gray-400 font-medium list-none">
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-[#A53860]" /> Improved push notification reliability</li>
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-[#A53860]" /> Fixed UI layout on small screens</li>
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-[#A53860]" /> Optimized image loading engine</li>
                <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-[#A53860]" /> New onboarding animations added</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
