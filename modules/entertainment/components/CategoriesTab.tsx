"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import type { ModalData } from "@/modules/entertainment/types";
import type { EntertainmentCategory } from "@/modules/entertainment/types/api.types";

export interface CategoriesTabProps {
  isDark: boolean;
  setModalData: (d: ModalData) => void;
  categories: EntertainmentCategory[];
}

export const CategoriesTab = ({ isDark, setModalData, categories }: CategoriesTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Categories
        </h2>
        <button
          onClick={() => setModalData({ type: "create-category" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-[#A53860] to-[#670D2F] text-white font-medium hover:opacity-90"
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
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{cat.note ?? "—"}</td>
                <td className={`px-6 py-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{cat.chummeSubCategories?.length ?? 0}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setModalData({ type: "edit-category", item: { id: cat.id, name: cat.name, description: cat.note ?? "" } })} className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                      <Edit className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </button>
                    <button onClick={() => setModalData({ type: "delete-confirm", item: { id: cat.id, name: cat.name, itemType: "category" } })} className={`p-2 rounded-lg ${isDark ? "hover:bg-red-900/30" : "hover:bg-red-50"}`}>
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
};
