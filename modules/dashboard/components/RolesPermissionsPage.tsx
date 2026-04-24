"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  BadgeCheck,
  Edit,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";

export const RolesPermissionsPage = () => {
  const [roles, setRoles] = useState([
    { id: "1", name: "Super Admin", description: "Full system access, manage all settings", tag: "SUPER ADMIN", tagColor: "#EF4444", members: 2 },
    { id: "2", name: "Community Mgr", description: "Manage members, content, and reports", tag: "COMMUNITY MGR", tagColor: "#A53860", members: 12 },
    { id: "3", name: "Support Team", description: "View tickets, user profiles, few edits", tag: "SUPPORT TEAM", tagColor: "#3B82F6", members: 8 },
    { id: "4", name: "Moderator", description: "Basic content moderation and flagging", tag: "MODERATOR", tagColor: "#10B981", members: 24 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<typeof roles[0] | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTag, setFormTag] = useState("");
  const [formColor, setFormColor] = useState("#A53860");

  const openModal = (role: typeof roles[0] | null = null) => {
    if (role) {
      setEditingRole(role);
      setFormName(role.name);
      setFormDescription(role.description);
      setFormTag(role.tag);
      setFormColor(role.tagColor);
    } else {
      setEditingRole(null);
      setFormName("");
      setFormDescription("");
      setFormTag("");
      setFormColor("#A53860");
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-white text-gray-900">Roles</h1>
          <p className="text-sm mt-1 text-gray-400 dark:text-gray-400 text-gray-500">Manage your administrative team roles</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Role
        </button>
      </motion.div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white px-2">
          Available Roles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl transition-all shadow-sm hover:shadow-md flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${role.tagColor}20`, color: role.tagColor }}
                >
                  {role.tag}
                </span>
                <Shield className="w-5 h-5 text-gray-300 group-hover:text-[#A53860] transition-colors" />
              </div>
              <p className="text-gray-900 dark:text-white font-bold text-base mb-2">
                {role.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed flex-1">
                {role.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium py-4 border-t border-gray-50 dark:border-gray-700/50 mb-4">
                <BadgeCheck className="w-4 h-4 text-[#EF88AD]" /> {role.members} members assigned
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(role)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setRoles((prev) => prev.filter((r) => r.id !== role.id))}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-900/10 dark:bg-red-900/30 hover:bg-red-900/20 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsModalOpen(false); setEditingRole(null); }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{editingRole ? "Edit Role" : "Add New Role"}</h2>
                  <button onClick={() => { setIsModalOpen(false); setEditingRole(null); }} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">Role Name <span className="text-[#A53860]">*</span></label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Content Editor" className="w-full h-12 px-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A53860] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">Description</label>
                    <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Describe this role's access level" rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A53860] outline-none transition-all resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">Tag Label</label>
                    <input type="text" value={formTag} onChange={(e) => setFormTag(e.target.value)} placeholder="e.g. EDITOR" className="w-full h-12 px-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A53860] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">Tag Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={formColor} onChange={(e) => setFormColor(e.target.value)} className="w-12 h-12 rounded-xl border border-gray-700 bg-gray-800 cursor-pointer" />
                      <input type="text" value={formColor} onChange={(e) => setFormColor(e.target.value)} className="flex-1 h-12 px-4 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-[#A53860] outline-none transition-all" />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-700 flex gap-3">
                  <button onClick={() => { setIsModalOpen(false); setEditingRole(null); }} className="flex-1 h-11 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-medium transition-all">Cancel</button>
                  <button
                    onClick={() => {
                      if (!formName.trim()) return;
                      if (editingRole) {
                        setRoles((prev) => prev.map((r) => r.id === editingRole.id ? { ...r, name: formName, description: formDescription, tag: formTag.toUpperCase(), tagColor: formColor } : r));
                      } else {
                        setRoles((prev) => [...prev, { id: Date.now().toString(), name: formName, description: formDescription, tag: formTag.toUpperCase(), tagColor: formColor, members: 0 }]);
                      }
                      setIsModalOpen(false);
                      setEditingRole(null);
                    }}
                    disabled={!formName.trim()}
                    className="flex-1 h-11 bg-gradient-to-r from-[#A53860] to-[#670D2F] hover:opacity-90 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                  >
                    {editingRole ? "Update Role" : "Add Role"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
