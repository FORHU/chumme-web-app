"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Clock, 
  Database, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  Download,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useMemo } from "react";

// --- Mock Data ---
interface AuditLog {
  id: string;
  user: {
    name: string;
    avatarInitials: string;
    role: string;
  };
  action: "ADDED" | "UPDATED" | "DELETED" | "TRIGGERED" | "RESOLVED";
  module: string;
  target: string;
  timestamp: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  detail: string;
}

const MOCK_LOGS: AuditLog[] = [
  {
    id: "log-1",
    user: { name: "Sarah Miller", avatarInitials: "SM", role: "Admin" },
    action: "ADDED",
    module: "Discover",
    target: "YouTube Link: BTS World Tour",
    timestamp: "2026-04-20T10:30:00Z",
    status: "SUCCESS",
    detail: "Newly added feature: International fan engagement tracking for BTS."
  },
  {
    id: "log-2",
    user: { name: "Mike Chen", avatarInitials: "MC", role: "Moderator" },
    action: "UPDATED",
    module: "Categories",
    target: "Fandom: BLACKPINK",
    timestamp: "2026-04-20T09:15:00Z",
    status: "SUCCESS",
    detail: "Updated filtering rules for concert clips."
  },
  {
    id: "log-3",
    user: { name: "Elena Rodriguez", avatarInitials: "ER", role: "Content Mgr" },
    action: "TRIGGERED",
    module: "Platform Ingestion",
    target: "Instagram Sync Loop",
    timestamp: "2026-04-20T08:45:00Z",
    status: "SUCCESS",
    detail: "Manual crawl triggered for high-priority hashtags."
  },
  {
    id: "log-4",
    user: { name: "System", avatarInitials: "SY", role: "Automated" },
    action: "DELETED",
    module: "Discover",
    target: "Link: Expired Teaser",
    timestamp: "2026-04-20T07:20:00Z",
    status: "SUCCESS",
    detail: "Automatic cleanup of expired promotional content."
  },
  {
    id: "log-5",
    user: { name: "Sarah Miller", avatarInitials: "SM", role: "Admin" },
    action: "ADDED",
    module: "Collaborations",
    target: "Collab: Global Fan Fest",
    timestamp: "2026-04-19T22:10:00Z",
    status: "SUCCESS",
    detail: "Created new collaboration event for multi-fandom participation."
  },
  {
    id: "log-6",
    user: { name: "Alex Thompson", avatarInitials: "AT", role: "Moderator" },
    action: "RESOLVED",
    module: "Reports",
    target: "Ticket #8841",
    timestamp: "2026-04-19T18:55:00Z",
    status: "FAILED",
    detail: "Failed to resolve due to insufficient permissions. Retrying."
  },
  {
    id: "log-7",
    user: { name: "Mike Chen", avatarInitials: "MC", role: "Moderator" },
    action: "UPDATED",
    module: "Settings",
    target: "Security Policy",
    timestamp: "2026-04-19T16:30:00Z",
    status: "SUCCESS",
    detail: "Enforced 2FA for all moderator-level actions."
  },
  {
    id: "log-8",
    user: { name: "Sarah Miller", avatarInitials: "SM", role: "Admin" },
    action: "ADDED",
    module: "Platform Ingestion",
    target: "Twitter API V2 Integration",
    timestamp: "2026-04-19T14:20:00Z",
    status: "SUCCESS",
    detail: "New feature: Direct Twitter ingestion for trending K-pop topics."
  }
];

export function AuditLogsPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [filterModule, setFilterModule] = useState<string>("ALL");

  const modules = ["Discover", "Platform Ingestion", "Categories", "Collaborations", "Settings", "Reports"];
  const actions = ["ADDED", "UPDATED", "DELETED", "TRIGGERED", "RESOLVED"];

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchSearch = 
        log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.detail.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchAction = filterAction === "ALL" || log.action === filterAction;
      const matchModule = filterModule === "ALL" || log.module === filterModule;
      
      return matchSearch && matchAction && matchModule;
    });
  }, [searchQuery, filterAction, filterModule]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Audit Logs
          </h1>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Track all transactions and system updates performed by users.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white border text-gray-700 hover:bg-gray-50"
          }`}>
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-linear-to-r from-[#A53860] to-[#670D2F] text-white hover:shadow-lg transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
            <input 
              type="text" 
              placeholder="Search by user, target, or details..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-all ${
                isDarkMode 
                  ? "bg-gray-800 border-gray-700 text-white focus:border-[#A53860]" 
                  : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#A53860]"
              }`}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
              <select 
                value={filterAction}
                onChange={(event) => setFilterAction(event.target.value)}
                className={`h-11 pl-10 pr-8 rounded-xl text-sm appearance-none outline-none cursor-pointer transition-all ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white focus:border-[#A53860]" 
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#A53860]"
                }`}
              >
                <option value="ALL">All Actions</option>
                {actions.map(action => <option key={action} value={action}>{action}</option>)}
              </select>
            </div>

            <div className="relative">
              <Database className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
              <select 
                value={filterModule}
                onChange={(event) => setFilterModule(event.target.value)}
                className={`h-11 pl-10 pr-8 rounded-xl text-sm appearance-none outline-none cursor-pointer transition-all ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white focus:border-[#A53860]" 
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#A53860]"
                }`}
              >
                <option value="ALL">All Modules</option>
                {modules.map(moduleName => <option key={moduleName} value={moduleName}>{moduleName}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50/50"}`}>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Action & Module</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Target</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Timestamp</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log, index) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`group border-b last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${
                      isDarkMode ? "border-gray-800" : "border-gray-100"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#A53860] to-[#670D2F] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {log.user.avatarInitials}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{log.user.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">{log.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.action === 'ADDED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          log.action === 'DELETED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          log.action === 'UPDATED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}>
                          {log.action}
                        </span>
                        <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{log.module}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{log.detail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{log.target}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {log.status === 'SUCCESS' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : log.status === 'FAILED' ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className={`text-xs font-bold ${
                          log.status === 'SUCCESS' ? 'text-green-500' : 
                          log.status === 'FAILED' ? 'text-red-500' : 'text-amber-500'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>No logs found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
