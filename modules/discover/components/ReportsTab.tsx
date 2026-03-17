"use client";

import { reportedPosts } from "@/modules/discover/constants/mock-data";

interface ReportsTabProps {
  isDarkMode: boolean;
}

export const ReportsTab = ({ isDarkMode }: ReportsTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Reported Posts
        </h2>
      </div>

      <div
        className={`rounded-lg border overflow-hidden ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? "bg-gray-900" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Post Preview
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  User
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Reason
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Reports Count
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}
            >
              {reportedPosts.map((post) => (
                <tr
                  key={post.id}
                  className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                >
                  <td className={`px-6 py-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {post.post}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    @{post.user}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {post.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      {post.reportsCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-3 py-1 text-sm rounded ${
                          isDarkMode
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        View
                      </button>
                      <button
                        className={`px-3 py-1 text-sm rounded ${
                          isDarkMode
                            ? "bg-red-900 text-red-200 hover:bg-red-800"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
