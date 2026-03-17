"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Plus, Edit, Trash2, X, ChevronRight } from "lucide-react";

type ModalType =
  | "create-category"
  | "edit-category"
  | "create-subcategory"
  | "edit-subcategory"
  | "add-topic"
  | "edit-topic"
  | "delete-confirm"
  | null;

interface ModalData {
  type: ModalType;
  item?: { id: number; name: string; [key: string]: any };
}

const categories = [
  { id: 1, name: "Music", description: "All music related content", subcategories: 12, status: "Active" },
  { id: 2, name: "Sports", description: "Sports teams and events", subcategories: 8, status: "Active" },
  { id: 3, name: "Movies", description: "Films and cinema", subcategories: 6, status: "Active" },
  { id: 4, name: "TV Shows", description: "Television series", subcategories: 10, status: "Active" },
  { id: 5, name: "Gaming", description: "Video games and esports", subcategories: 9, status: "Active" },
];

const subcategories = [
  { id: 1, name: "K-Pop", category: "Music", topics: 45, status: "Active" },
  { id: 2, name: "Hip-Hop", category: "Music", topics: 32, status: "Active" },
  { id: 3, name: "Basketball", category: "Sports", topics: 28, status: "Active" },
  { id: 4, name: "Football", category: "Sports", topics: 34, status: "Active" },
  { id: 5, name: "Marvel", category: "Movies", topics: 18, status: "Active" },
];

const topics = [
  { id: 1, name: "BTS", category: "Music", subcategory: "K-Pop", type: "Group", followers: "2.3M" },
  { id: 2, name: "BLACKPINK", category: "Music", subcategory: "K-Pop", type: "Group", followers: "1.9M" },
  { id: 3, name: "EXO", category: "Music", subcategory: "K-Pop", type: "Group", followers: "1.2M" },
  { id: 4, name: "Lakers", category: "Sports", subcategory: "Basketball", type: "Team", followers: "890K" },
  { id: 5, name: "Barcelona", category: "Sports", subcategory: "Football", type: "Team", followers: "1.5M" },
];

const tabs = [
  { id: "overview", name: "Overview" },
  { id: "categories", name: "Categories" },
  { id: "subcategories", name: "Subcategories" },
  { id: "topics", name: "Topics" },
];

export function EntertainmentPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [activeTab, setActiveTab] = useState("overview");
  const [modalData, setModalData] = useState<ModalData>({ type: null });

  const closeModal = () => setModalData({ type: null });

  return (
    <div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Entertainment Manager
        </h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Manage entertainment structure: Categories, Subcategories, and Topics
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#A53860] text-[#A53860]"
                    : isDark
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === "overview" && <OverviewTab isDark={isDark} />}
        {activeTab === "categories" && <CategoriesTab isDark={isDark} setModalData={setModalData} />}
        {activeTab === "subcategories" && <SubcategoriesTab isDark={isDark} setModalData={setModalData} />}
        {activeTab === "topics" && <TopicsTab isDark={isDark} setModalData={setModalData} />}
      </motion.div>

      {modalData.type && (
        <Modal isDark={isDark} modalData={modalData} closeModal={closeModal} />
      )}
    </div>
  );
}

function OverviewTab({ isDark }: { isDark: boolean }) {
  const stats = [
    { label: "Total Categories", value: "10" },
    { label: "Total Subcategories", value: "45" },
    { label: "Total Topics", value: "320" },
    { label: "Active Topics", value: "210" },
  ];

  const tree: Record<string, Record<string, string[]>> = {
    Music: { "K-Pop": ["BTS", "BLACKPINK", "EXO"], "Hip-Hop": ["Travis Scott"] },
    Sports: { Basketball: ["Lakers", "Warriors"] },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className={`p-6 rounded-lg border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className={`p-6 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          Entertainment Structure
        </h3>
        <div className={`font-mono text-sm space-y-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {Object.entries(tree).map(([cat, subs]) => (
            <div key={cat}>
              <p className="font-semibold">{cat}</p>
              {Object.entries(subs).map(([sub, topicList], si, sarr) => (
                <div key={sub}>
                  <p className="ml-4">{si < sarr.length - 1 ? "├" : "└"} {sub}</p>
                  {topicList.map((t, ti) => (
                    <p key={t} className="ml-10">
                      │ {ti < topicList.length - 1 ? "├" : "└"} {t}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoriesTab({
  isDark,
  setModalData,
}: {
  isDark: boolean;
  setModalData: (d: ModalData) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Categories
        </h2>
        <button
          onClick={() => setModalData({ type: "create-category" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
      <div className={`rounded-lg border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <table className="w-full">
          <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
            <tr>
              {["Name", "Description", "Subcategories", "Status", "Actions"].map((h) => (
                <th key={h} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
            {categories.map((cat) => (
              <tr key={cat.id} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{cat.name}</td>
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{cat.description}</td>
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{cat.subcategories}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{cat.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setModalData({ type: "edit-category", item: cat })} className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                      <Edit className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </button>
                    <button onClick={() => setModalData({ type: "delete-confirm", item: cat })} className={`p-2 rounded-lg ${isDark ? "hover:bg-red-900/30" : "hover:bg-red-50"}`}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubcategoriesTab({
  isDark,
  setModalData,
}: {
  isDark: boolean;
  setModalData: (d: ModalData) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Subcategories
        </h2>
        <button
          onClick={() => setModalData({ type: "create-subcategory" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Subcategory
        </button>
      </div>
      <div className={`rounded-lg border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <table className="w-full">
          <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
            <tr>
              {["Name", "Category", "Topics", "Status", "Actions"].map((h) => (
                <th key={h} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
            {subcategories.map((sub) => (
              <tr key={sub.id} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{sub.name}</td>
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{sub.category}</td>
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{sub.topics}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{sub.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setModalData({ type: "edit-subcategory", item: sub })} className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                      <Edit className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </button>
                    <button onClick={() => setModalData({ type: "delete-confirm", item: sub })} className={`p-2 rounded-lg ${isDark ? "hover:bg-red-900/30" : "hover:bg-red-50"}`}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopicsTab({
  isDark,
  setModalData,
}: {
  isDark: boolean;
  setModalData: (d: ModalData) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Topics
        </h2>
        <button
          onClick={() => setModalData({ type: "add-topic" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Topic
        </button>
      </div>
      <div className={`rounded-lg border overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <table className="w-full">
          <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
            <tr>
              {["Name", "Category", "Subcategory", "Type", "Followers", "Actions"].map((h) => (
                <th key={h} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
            {topics.map((topic) => (
              <tr key={topic.id} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                <td className={`px-6 py-4 font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{topic.name}</td>
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{topic.category}</td>
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{topic.subcategory}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>{topic.type}</span>
                </td>
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{topic.followers}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setModalData({ type: "edit-topic", item: topic })} className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                      <Edit className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </button>
                    <button onClick={() => setModalData({ type: "delete-confirm", item: topic })} className={`p-2 rounded-lg ${isDark ? "hover:bg-red-900/30" : "hover:bg-red-50"}`}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Modal({
  isDark,
  modalData,
  closeModal,
}: {
  isDark: boolean;
  modalData: ModalData;
  closeModal: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
  };

  const selectClass = `w-full px-3 py-2 rounded-lg border ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-900"
  } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`;

  const labelClass = `block text-sm font-medium mb-2 ${
    isDark ? "text-gray-300" : "text-gray-700"
  }`;

  if (modalData.type === "delete-confirm") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`rounded-lg shadow-xl p-6 w-full max-w-md ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Delete Confirmation
          </h3>
          <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Are you sure you want to delete "{modalData.item?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-lg shadow-xl p-6 w-full max-w-md ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {modalData.type === "create-category" && "Create Category"}
            {modalData.type === "edit-category" && "Edit Category"}
            {modalData.type === "create-subcategory" && "Create Subcategory"}
            {modalData.type === "edit-subcategory" && "Edit Subcategory"}
            {modalData.type === "add-topic" && "Add Topic"}
            {modalData.type === "edit-topic" && "Edit Topic"}
          </h3>
          <button
            onClick={closeModal}
            className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Category Form ── */}
          {(modalData.type === "create-category" ||
            modalData.type === "edit-category") && (
            <>
              <div>
                <label className={labelClass}>Category Name</label>
                <select
                  defaultValue={modalData.item?.name || ""}
                  className={selectClass}
                >
                  <option value="">Select Category</option>
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Movies</option>
                  <option>TV Shows</option>
                  <option>Gaming</option>
                  <option>Anime</option>
                  <option>K-Drama</option>
                  <option>Books</option>
                  <option>Fashion</option>
                  <option>Technology</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  defaultValue={modalData.item?.description || ""}
                  rows={3}
                  placeholder="Enter category description"
                  className={`w-full px-3 py-2 rounded-lg border resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  defaultValue={modalData.item?.status || "Active"}
                  className={selectClass}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </div>
            </>
          )}

          {/* ── Subcategory Form ── */}
          {(modalData.type === "create-subcategory" ||
            modalData.type === "edit-subcategory") && (
            <>
              <div>
                <label className={labelClass}>Subcategory Name</label>
                <select
                  defaultValue={modalData.item?.name || ""}
                  className={selectClass}
                >
                  <option value="">Select Subcategory</option>
                  <option>K-Pop</option>
                  <option>Hip-Hop</option>
                  <option>Rock</option>
                  <option>Pop</option>
                  <option>Basketball</option>
                  <option>Football</option>
                  <option>Baseball</option>
                  <option>Action</option>
                  <option>Comedy</option>
                  <option>Drama</option>
                  <option>Horror</option>
                  <option>Romance</option>
                  <option>Sci-Fi</option>
                  <option>Anime</option>
                  <option>Reality TV</option>
                  <option>RPG</option>
                  <option>FPS</option>
                  <option>Strategy</option>
                  <option>Sports Games</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  defaultValue={modalData.item?.status || "Active"}
                  className={selectClass}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </div>
            </>
          )}

          {/* ── Topic Form ── */}
          {(modalData.type === "add-topic" ||
            modalData.type === "edit-topic") && (
            <>
              <div>
                <label className={labelClass}>Topic Name</label>
                <input
                  type="text"
                  defaultValue={modalData.item?.name || ""}
                  placeholder="e.g., BTS, Lakers"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  defaultValue={modalData.item?.category || ""}
                  className={selectClass}
                >
                  <option value="">Select Category</option>
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Movies</option>
                  <option>TV Shows</option>
                  <option>Gaming</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Subcategory</label>
                <select
                  defaultValue={modalData.item?.subcategory || ""}
                  className={selectClass}
                >
                  <option value="">Select Subcategory</option>
                  <option>K-Pop</option>
                  <option>Hip-Hop</option>
                  <option>Basketball</option>
                  <option>Football</option>
                  <option>Marvel</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <select
                  defaultValue={modalData.item?.type || ""}
                  className={selectClass}
                >
                  <option value="">Select Type</option>
                  <option>Group</option>
                  <option>Artist</option>
                  <option>Team</option>
                  <option>Show</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter topic description"
                  className={`w-full px-3 py-2 rounded-lg border resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-[#A53860]/50`}
                />
              </div>
            </>
          )}

          {/* ── Footer Buttons ── */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90"
            >
              {modalData.type?.includes("create") || modalData.type?.includes("add")
                ? "Create"
                : "Update"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
