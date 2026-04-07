"use client";

import { motion } from "framer-motion";
import { Ban, XCircle, AlertTriangle, Shield } from "lucide-react";
import { actionLog } from "@/modules/community/constants/mock-data";
import { ActionLogItem as ActionLogItemType } from "@/modules/community/types";

interface ActionsLogProps {
  isDarkMode: boolean;
}

const ActionLogCard = ({
  log,
  index,
  isDarkMode,
}: {
  log: ActionLogItemType;
  index: number;
  isDarkMode: boolean;
}) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.05 * index }}
      className={`p-4 rounded-lg border ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              log.type === "ban"
                ? "bg-red-500"
                : log.type === "remove"
                  ? "bg-orange-500"
                  : log.type === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
            }`}
          >
            {log.type === "ban" ? (
              <Ban className="w-5 h-5 text-white" />
            ) : log.type === "remove" ? (
              <XCircle className="w-5 h-5 text-white" />
            ) : log.type === "warning" ? (
              <AlertTriangle className="w-5 h-5 text-white" />
            ) : (
              <Shield className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3
              className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-1`}
            >
              {log.action}
            </h3>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
            >
              Target: {log.target}
            </p>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Reason: {log.reason}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {log.timestamp}
          </p>
          <p
            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            by {log.moderator}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const ActionsLog = ({ isDarkMode }: ActionsLogProps) => {
  return (
    <div className="space-y-4">
      {actionLog.map((log, index) => (
        <ActionLogCard
          key={log.id}
          log={log}
          index={index}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
};
