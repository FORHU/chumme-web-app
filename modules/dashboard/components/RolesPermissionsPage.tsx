"use client";

import { motion } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  BadgeCheck,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

const roles = [
  {
    name: "Super Admin",
    desc: "Full system access, manage all settings",
    members: 2,
    color: "bg-red-500/10 text-red-500",
  },
  {
    name: "Community Mgr",
    desc: "Manage members, content, and reports",
    members: 12,
    color: "bg-[#A53860]/10 text-[#A53860]",
  },
  {
    name: "Support Team",
    desc: "View tickets, user profiles, few edits",
    members: 8,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Moderator",
    desc: "Basic content moderation and flagging",
    members: 24,
    color: "bg-green-500/10 text-green-500",
  },
];

const permissions = [
  { module: "User Management", read: true, write: true, delete: true },
  { module: "Community Settings", read: true, write: true, delete: false },
  { module: "Content Moderation", read: true, write: true, delete: true },
  { module: "Reports & Logs", read: true, write: false, delete: false },
  { module: "API Integrations", read: true, write: true, delete: false },
];

export const RolesPermissionsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Roles & Permissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Define access levels for your administrative team
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md">
          <Plus className="w-4 h-4" /> Add New Role
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white px-2">
            Available Roles
          </h3>
          {roles.map((role, i) => (
            <motion.div
              key={role.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl hover:border-[#A53860]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${role.color}`}
                >
                  {role.name}
                </span>
                <Shield className="w-4 h-4 text-gray-300 group-hover:text-[#A53860] transition-colors" />
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
                {role.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 leading-relaxed">
                {role.desc}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                <BadgeCheck className="w-3 h-3" /> {role.members} members
                assigned
              </div>
            </motion.div>
          ))}
        </div>

        {/* Permissions Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Active Permissions Matrix
            </h3>
            <span className="text-xs text-[#A53860] font-semibold bg-[#A53860]/10 px-3 py-1 rounded-full">
              Super Admin Selected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Module Name
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    View
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Create/Edit
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Delete
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {permissions.map((p) => (
                  <tr
                    key={p.module}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {p.module}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div
                        className={`mx-auto size-5 rounded-md flex items-center justify-center ${p.read ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        <ShieldAlert className="size-3" />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div
                        className={`mx-auto size-5 rounded-md flex items-center justify-center ${p.write ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        <ShieldAlert className="size-3" />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div
                        className={`mx-auto size-5 rounded-md flex items-center justify-center ${p.delete ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        <ShieldAlert className="size-3" />
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 capitalize">
                        <button className="p-2 text-gray-400 hover:text-[#A53860] transition-colors">
                          <Pencil className="size-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
