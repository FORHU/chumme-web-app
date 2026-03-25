"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Bell, Users, Plus, Edit, Trash2, X, Check } from "lucide-react";

interface SettingsPageProps {
  isDark: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const ALL_PERMISSIONS = [
  "Manage Users",
  "Manage Content",
  "View Reports",
  "Manage Communities",
  "Moderate Content",
  "Create Content",
  "Edit Content",
  "Delete Content",
  "View Analytics",
  "Manage Settings",
  "Manage Roles",
  "Ban Users",
];

const INITIAL_ROLES: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access and control",
    userCount: 2,
    permissions: ["All Permissions"],
  },
  {
    id: "2",
    name: "Admin",
    description: "Manage users, content, and settings",
    userCount: 5,
    permissions: ["Manage Users", "Manage Content", "View Reports", "Manage Communities"],
  },
  {
    id: "3",
    name: "Moderator",
    description: "Moderate content and manage reports",
    userCount: 12,
    permissions: ["Moderate Content", "View Reports", "Manage Comments"],
  },
  {
    id: "4",
    name: "Content Manager",
    description: "Create and manage platform content",
    userCount: 8,
    permissions: ["Create Content", "Edit Content", "Delete Content"],
  },
  {
    id: "5",
    name: "Community Manager",
    description: "Manage communities and user engagement",
    userCount: 15,
    permissions: ["Manage Communities", "View Analytics", "Moderate Content"],
  },
];

const ToggleRow = ({
  label,
  description,
  checked,
  onChange,
  isDark,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  isDark: boolean;
}) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex-1 pr-4">
      <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
        {label}
      </p>
      <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {description}
      </p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
        checked ? "bg-[#A53860]" : isDark ? "bg-gray-700" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

const AddRoleModal = ({
  isDark,
  onClose,
  onAdd,
}: {
  isDark: boolean;
  onClose: () => void;
  onAdd: (role: Omit<Role, "id" | "userCount">) => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (p: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), description: description.trim(), permissions: selectedPermissions });
    onClose();
  };

  const inputClass = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-[#A53860]"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A53860]"
  } focus:ring-2 focus:ring-[#A53860]/10`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Add New Role
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Role Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Content Editor"
                className={inputClass}
                required
                autoFocus
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role's responsibilities"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map((permission) => {
                  const active = selectedPermissions.includes(permission);
                  return (
                    <label
                      key={permission}
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        active
                          ? isDark
                            ? "bg-[#A53860]/20 border-[#A53860] text-[#EF88AD]"
                            : "bg-[#A53860]/10 border-[#A53860] text-[#A53860]"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                          active
                            ? "bg-[#A53860] border-[#A53860]"
                            : isDark
                            ? "border-gray-600"
                            : "border-gray-300"
                        }`}
                      >
                        {active && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xs font-medium">{permission}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-colors ${
                  isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 h-11 rounded-xl font-semibold text-sm bg-linear-to-r from-[#A53860] to-[#670D2F] text-white hover:opacity-90 transition-all disabled:opacity-50"
              >
                Add Role
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const SettingsPage = ({ isDark }: SettingsPageProps) => {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [showAddModal, setShowAddModal] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [momentUpdates, setMomentUpdates] = useState(true);
  const [communityInvites, setCommunityInvites] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [allowTagging, setAllowTagging] = useState(true);

  const cardClass = `rounded-2xl border p-6 mb-6 ${
    isDark
      ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-xl"
      : "bg-white/80 border-gray-200/50 backdrop-blur-xl"
  }`;

  const sectionIconClass = `w-5 h-5 ${isDark ? "text-[#EF88AD]" : "text-[#A53860]"}`;

  const addRole = (role: Omit<Role, "id" | "userCount">) => {
    setRoles((prev) => [
      ...prev,
      { ...role, id: crypto.randomUUID(), userCount: 0 },
    ]);
  };

  const deleteRole = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Settings
        </h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Manage roles, permissions, and system preferences
        </p>
      </div>

      {/* Roles & Permissions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={cardClass}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className={sectionIconClass} />
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Roles & Permissions
            </h2>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#A53860] to-[#670D2F] text-white font-medium text-sm hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>

        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`p-5 rounded-xl border ${
                isDark ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {role.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                    }`}>
                      {role.userCount} users
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          isDark
                            ? "bg-[#A53860]/20 text-[#EF88AD]"
                            : "bg-[#A53860]/10 text-[#A53860]"
                        }`}
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                    title="Edit Role"
                  >
                    <Edit className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                  </button>
                  <button
                    onClick={() => deleteRole(role.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? "hover:bg-red-900/20" : "hover:bg-red-50"
                    }`}
                    title="Delete Role"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cardClass}
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className={sectionIconClass} />
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Notifications
          </h2>
        </div>
        <div className={`divide-y ${isDark ? "divide-gray-700/50" : "divide-gray-100"}`}>
          <ToggleRow label="Email Notifications" description="Receive notifications via email" checked={emailNotifications} onChange={setEmailNotifications} isDark={isDark} />
          <ToggleRow label="Push Notifications" description="Receive push notifications on your device" checked={pushNotifications} onChange={setPushNotifications} isDark={isDark} />
          <ToggleRow label="Moment Updates" description="Get notified when someone shares a new moment" checked={momentUpdates} onChange={setMomentUpdates} isDark={isDark} />
          <ToggleRow label="Community Invites" description="Get notified when you're invited to a community" checked={communityInvites} onChange={setCommunityInvites} isDark={isDark} />
          <ToggleRow label="Weekly Digest" description="Receive a weekly summary of activity" checked={weeklyDigest} onChange={setWeeklyDigest} isDark={isDark} />
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cardClass}
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className={sectionIconClass} />
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Privacy & Security
          </h2>
        </div>
        <div className={`divide-y ${isDark ? "divide-gray-700/50" : "divide-gray-100"}`}>
          <ToggleRow label="Public Profile" description="Make your profile visible to everyone" checked={profileVisibility} onChange={setProfileVisibility} isDark={isDark} />
          <ToggleRow label="Show Activity Status" description="Let others see when you're active" checked={showActivity} onChange={setShowActivity} isDark={isDark} />
          <ToggleRow label="Allow Tagging" description="Allow others to tag you in moments" checked={allowTagging} onChange={setAllowTagging} isDark={isDark} />
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl border p-6 ${
          isDark
            ? "bg-red-900/20 border-red-800/50"
            : "bg-red-50/80 border-red-200/50"
        }`}
      >
        <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-red-400" : "text-red-700"}`}>
          Danger Zone
        </h2>
        <p className={`text-sm mb-4 ${isDark ? "text-red-300" : "text-red-600"}`}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          className={`px-5 py-2.5 rounded-xl border font-semibold text-sm transition-colors ${
            isDark
              ? "border-red-700 bg-red-900/30 hover:bg-red-900/50 text-red-400"
              : "border-red-300 bg-red-100 hover:bg-red-200 text-red-700"
          }`}
        >
          Delete Account
        </button>
      </motion.div>

      {showAddModal && (
        <AddRoleModal isDark={isDark} onClose={() => setShowAddModal(false)} onAdd={addRole} />
      )}
    </motion.div>
  );
};
