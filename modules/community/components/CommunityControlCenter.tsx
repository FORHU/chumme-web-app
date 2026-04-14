"use client";

import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Grid3x3,
  Activity,
  TrendingUp,
  AlertTriangle,
  Search,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import {
  useGetCommunitiesCategories,
  useGetSubcategoriesByCategoryId,
  useCreateCommunitiesCategory,
  useUpdateCommunitiesCategory,
  useDeleteCommunitiesCategory,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
  communitiesKeys,
} from "@/modules/communities/hooks/useCommunities";
import { ColorPicker } from "@/modules/community/components/ColorPicker";
import InteractiveBubbleCanvas from "@/modules/community/components/InteractiveBubbleCanvas";
import { Snackbar } from "@/modules/shared/components/Snackbar";
import { useSnackbar } from "@/modules/shared/hooks/useSnackbar";

// ─── Constants & Types ─────────────────────────────────────────────────────────

const PRESET_COLORS = [
  "#A53860",
  "#EF88AD",
  "#670D2F",
  "#F4C2A0",
  "#8B3A52",
  "#D14D8C",
  "#B03D6B",
  "#EF5EAD",
  "#FF8F50",
  "#FFAD7A",
  "#FFCBA4",
  "#FFBC8F",
];

const getColorForId = (id: string, index: number) => {
  return PRESET_COLORS[index % PRESET_COLORS.length];
};

type TabId = "categories" | "subcategories" | "analytics" | "moderation";
type ModalType = "country" | "category" | "community";

interface CommunityControlCenterProps {
  isDark?: boolean;
}

const inputClass = (isDark: boolean) =>
  `w-full h-12 px-4 rounded-xl text-sm border outline-none transition-all ${
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-[#A53860]"
      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A53860]"
  } focus:ring-2 focus:ring-[#A53860]/10`;

// ─── Main Component ───────────────────────────────────────────────────────────

export const CommunityControlCenter = ({
  isDark: propDark,
}: CommunityControlCenterProps) => {
  const { resolvedTheme } = useTheme();
  // Derived state for isDark to avoid set-state-in-effect warning
  const isDark = propDark ?? resolvedTheme === "dark";

  const queryClient = useQueryClient();
  const { messages, dismiss, showSuccess, showError } = useSnackbar();

  const [formData, setFormData] = useState({
    name: "",
    color: "#A53860", // default brand color
    description: "",
    targetParentName: "",
  });

  const [activeTab, setActiveTab] = useState<TabId>("categories");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("country");
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>(
    {},
  );

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      color: "#A53860",
      description: "",
      targetParentName: "",
    });
    setIsEdit(false);
    setEditingId(null);
  }, []);

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  const { data: categoriesData, isLoading: loadingCountries } =
    useGetCommunitiesCategories();
  const countries = useMemo(
    () => categoriesData?.categories ?? [],
    [categoriesData],
  );

  const { data: subData, isLoading: loadingSub } =
    useGetSubcategoriesByCategoryId(selectedCountryId, {
      enabled: !!selectedCountryId,
    });
  const subcategories = useMemo(() => subData?.subCategories ?? [], [subData]);

  // Adjust state when countries load to select the first one automatically
  const [prevCountries, setPrevCountries] = useState(countries);
  if (countries !== prevCountries) {
    setPrevCountries(countries);
    if (countries.length > 0 && !selectedCountryId) {
      setSelectedCountryId(countries[0].id);
    }
  }

  // ─── Mutation Hooks ─────────────────────────────────────────────────────────

  const onMutationSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: communitiesKeys.all });
    setColorOverrides({});
    setShowModal(false);
    resetForm();
  }, [queryClient, resetForm]);

  const { mutate: createCountry, isPending: creatingCountry } =
    useCreateCommunitiesCategory({ onSuccess: onMutationSuccess });
  const { mutate: updateCountry, isPending: updatingCountry } =
    useUpdateCommunitiesCategory({ onSuccess: onMutationSuccess });
  const { mutate: deleteCountry, isPending: deletingCountry } =
    useDeleteCommunitiesCategory({ onSuccess: onMutationSuccess });

  const { mutate: createSub, isPending: creatingSub } = useCreateSubCategory({
    onSuccess: onMutationSuccess,
  });
  const { mutate: updateSub, isPending: updatingSub } = useUpdateSubCategory({
    onSuccess: onMutationSuccess,
  });
  const { mutate: deleteSub, isPending: deletingSub } = useDeleteSubCategory({
    onSuccess: onMutationSuccess,
  });

  const isSubmitting =
    creatingCountry ||
    updatingCountry ||
    deletingCountry ||
    creatingSub ||
    updatingSub ||
    deletingSub;

  // ─── Form State ─────────────────────────────────────────────────────────────

  const openCreate = useCallback(
    (type: ModalType) => {
      resetForm();
      setModalType(type);
      setIsEdit(false);
      setShowModal(true);
    },
    [resetForm],
  );

  const openEdit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (type: ModalType, item: any) => {
      setModalType(type);
      setIsEdit(true);
      setEditingId(item.id);
      const color =
        item.color ??
        (item.chummeVisualDesign?.colorSet as any)?.primary ??
        "#D3427B";
      setFormData({
        name: item.name,
        color: color,
        description: item.description || item.note || "",
        targetParentName:
          countries.find((c) => c.id === item.chummeCategoryId)?.name || "",
      });
      setShowModal(true);
    },
    [countries],
  );

  const handleCreate = useCallback(() => {
    if (!formData.name.trim()) return;

    if (modalType === "country") {
      createCountry(
        {
          name: formData.name,
          isAd: false,
          chummeTrait: "COMMUNITIES",
        },
        {
          onSuccess: () => showSuccess("Category created successfully"),
          onError: (err: { message?: string }) =>
            showError(err?.message || "Failed to create category"),
        },
      );
    } else if (modalType === "category") {
      const parent = countries.find(
        (c) => c.name === formData.targetParentName,
      );
      if (!parent) return;
      createSub(
        {
          name: formData.name,
          chummeCategoryId: parent.id,
          isAd: false,
          note: formData.description,
        },
        {
          onSuccess: () => showSuccess("Category created successfully"),
          onError: (err: { message?: string }) =>
            showError(err?.message || "Failed to create category"),
        },
      );
    }
  }, [
    countries,
    createCountry,
    createSub,
    formData,
    modalType,
    showError,
    showSuccess,
  ]);

  const handleUpdate = useCallback(() => {
    if (!formData.name.trim() || !editingId) return;

    // Optimistic update — show color change instantly
    if (editingId && formData.color) {
      setColorOverrides((prev) => ({
        ...prev,
        [editingId]: formData.color,
      }));
    }

    const payload = {
      id: editingId,
      name: formData.name,
      color: formData.color,
    };

    if (modalType === "country") {
      updateCountry(payload, {
        onSuccess: () => showSuccess("Category updated successfully"),
        onError: (err: { message?: string }) =>
          showError(err?.message || "Update failed"),
      });
    } else {
      updateSub(payload, {
        onSuccess: () => showSuccess("Category updated successfully"),
        onError: (err: { message?: string }) =>
          showError(err?.message || "Update failed"),
      });
    }
  }, [
    editingId,
    formData.color,
    formData.name,
    modalType,
    showError,
    showSuccess,
    updateCountry,
    updateSub,
  ]);

  const handleDelete = useCallback(() => {
    if (!editingId) return;
    if (modalType === "country") {
      deleteCountry({ id: editingId });
    } else {
      deleteSub({ id: editingId });
    }
  }, [deleteCountry, deleteSub, editingId, modalType]);

  // ─── Bubble Mappings (Sync with API) ───────────────────────────────────────

  const countryBubbles = useMemo(() => {
    return countries
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((c, i) => ({
        id: c.id || `country-${i}`,
        name: c.name,
        count: c.populationCount || 0,
        color:
          colorOverrides[c.id] ||
          c.color ||
          c.chummeVisualDesign?.colorSet?.primary ||
          getColorForId(c.id, i),
        size: Math.min(140 + (c.populationCount || 0) / 10, 220),
        onClick: () => openEdit("country", c),
        chummeVisualDesign: c.chummeVisualDesign ?? null,
      }));
  }, [countries, searchQuery, openEdit, colorOverrides]);

  const categoryBubbles = useMemo(() => {
    return subcategories
      .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((s, i) => ({
        id: s.id,
        name: s.name,
        count: s.populationCount || 0,
        color:
          colorOverrides[s.id] ||
          s.color ||
          s.chummeVisualDesign?.colorSet?.primary ||
          getColorForId(s.id, i + 5),
        size: Math.min(120 + (s.populationCount || 0) / 5, 200),
        onClick: () => openEdit("category", s),
        chummeVisualDesign: s.chummeVisualDesign ?? null,
      }));
  }, [subcategories, searchQuery, openEdit, colorOverrides]);

  // ─── Styles ─────────────────────────────────────────────────────────────────

  const cardBase = `rounded-2xl border backdrop-blur-xl transition-all ${
    isDark
      ? "bg-gray-800/50 border-gray-700/50"
      : "bg-white/80 border-gray-200/50"
  }`;

  const tabs: {
    id: TabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "categories", label: "Categories", icon: Grid3x3 },
    { id: "subcategories", label: "Sub Categories", icon: Grid3x3 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "moderation", label: "Moderation", icon: AlertTriangle },
  ];

  return (
    <div className="h-full pb-10">
      {/* Header */}
      <div className="mb-6">
        <h2
          className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Communities
        </h2>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Manage countries, categories, and communities across the Chumme
          ecosystem
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            label: "Categories",
            value: countries.length,
            sub: "Live from backend",
            icon: Grid3x3,
            color: "#A53860",
          },
          {
            label: "Total Pop",
            value: countries.reduce(
              (acc, c) => acc + (c.populationCount || 0),
              0,
            ),
            sub: "Aggregate reach",
            icon: Activity,
            color: "#670D2F",
          },
          {
            label: "Engagement",
            value: "84%",
            sub: "+12% this week",
            icon: TrendingUp,
            color: "#EF88AD",
          },
          {
            label: "Open Reports",
            value: 3,
            sub: "Needs review",
            icon: AlertTriangle,
            color: "#F4C2A0",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`${cardBase} p-6 group hover:scale-[1.02] cursor-default`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <span
                className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {card.label}
              </span>
            </div>
            <p
              className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {card.value}
            </p>
            <p className="text-sm text-green-500 mt-1 font-medium">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery("");
            }}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-linear-to-r from-[#A53860] to-[#670D2F] text-white shadow-xl shadow-[#A53860]/20"
                : isDark
                  ? "bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:text-gray-900 hover:shadow-md"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* CATEGORIES TAB — shows top-level country/category bubbles */}
        {activeTab === "categories" && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <button
                onClick={() => openCreate("country")}
                className="h-12 px-8 bg-linear-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" /> Add Category
              </button>
              <div className="relative flex-1">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputClass(isDark)} pl-12 h-12`}
                />
              </div>
            </div>

            <div
              className={`${cardBase} p-6 min-h-[500px] h-[600px] relative overflow-hidden group/canvas shadow-2xl`}
            >
              {loadingCountries ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-xs z-10">
                  <div className="w-10 h-10 border-4 border-[#A53860]/20 border-t-[#A53860] rounded-full animate-spin" />
                </div>
              ) : (
                <InteractiveBubbleCanvas
                  bubbles={countryBubbles}
                  isDark={isDark}
                />
              )}
              {countries.length === 0 && !loadingCountries && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-7xl mb-4" role="img" aria-label="Globe">
                    🌍
                  </div>
                  <p
                    className={`text-xl font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    No categories yet
                  </p>
                  <p
                    className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Click &quot;Add Category&quot; to get started
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SUBCATEGORIES TAB */}
        {activeTab === "subcategories" && (
          <motion.div
            key="subcategories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Category selector pills */}
            <div className="flex gap-2 overflow-x-auto mb-6 pb-2 scrollbar-hide">
              {countries.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountryId(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border-2 ${
                    selectedCountryId === c.id
                      ? "border-[#A53860] bg-[#A53860]/10 text-[#A53860]"
                      : isDark
                        ? "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Add Subcategory + Search row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <button
                onClick={() => openCreate("category")}
                disabled={countries.length === 0}
                className="h-12 px-8 bg-linear-to-r from-[#A53860] to-[#670D2F] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" /> Add Subcategory
              </button>
              <div className="relative flex-1">
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                />
                <input
                  type="text"
                  placeholder="Search subcategories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputClass(isDark)} pl-12 h-12`}
                />
              </div>
            </div>

            {/* Bubble canvas for subcategories */}
            <div
              className={`${cardBase} p-6 min-h-[500px] h-[600px] relative overflow-hidden shadow-2xl`}
            >
              {loadingSub ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-xs z-10">
                  <div className="w-10 h-10 border-4 border-[#A53860]/20 border-t-[#A53860] rounded-full animate-spin" />
                </div>
              ) : (
                <InteractiveBubbleCanvas
                  bubbles={categoryBubbles}
                  isDark={isDark}
                />
              )}
              {!loadingSub && subcategories.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-7xl mb-4">🎯</div>
                  <p className={`text-xl font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    No subcategories yet
                  </p>
                  <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {countries.length === 0
                      ? "Add a category first before adding subcategories"
                      : "Click \"Add Subcategory\" to get started"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`${cardBase} p-8`}>
              <h3
                className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Communities by Country
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countries.map((c, i) => ({
                        id: c.id,
                        name: c.name,
                        value: c.populationCount || 1,
                        color: getColorForId(c.id, i),
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                    >
                      {countries.map((c, i) => (
                        <Cell
                          key={c.id || `cell-${i}`}
                          fill={getColorForId(c.id, i)}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${cardBase} p-8`}>
              <h3
                className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Fastest Growing Regions
              </h3>
              <div className="space-y-4">
                {countries.slice(0, 4).map((c, i) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl flex items-center justify-between ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-2 h-10 rounded-full"
                        style={{ backgroundColor: getColorForId(c.id, i) }}
                      />
                      <span
                        className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                      >
                        {c.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-500 font-bold block">
                        +14%
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase font-medium">
                        Growth Rate
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* MODERATION TAB */}
        {activeTab === "moderation" && (
          <motion.div
            key="moderation"
            className={`${cardBase} p-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3
              className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Active Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  title: "Spam in Tech Hub",
                  reason: "AI Generated Spam",
                  date: "2m ago",
                  priority: "High",
                },
                {
                  id: 2,
                  title: "Duplicate Content",
                  reason: "Repost from major site",
                  date: "1h ago",
                  priority: "Med",
                },
                {
                  id: 3,
                  title: "False Information",
                  reason: "Unverified news source",
                  date: "4h ago",
                  priority: "Low",
                },
              ].map((report) => (
                <div
                  key={report.id}
                  className={`p-6 rounded-3xl border-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${report.priority === "High" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}
                    >
                      {report.priority} Priority
                    </span>
                    <span className="text-xs text-gray-400">{report.date}</span>
                  </div>
                  <h4 className="font-bold mb-1">{report.title}</h4>
                  <p className="text-sm text-gray-400 mb-6">{report.reason}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 h-9 rounded-xl text-xs font-bold bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 active:scale-95 transition-all">
                      Suspend
                    </button>
                    <button className="flex-1 h-9 rounded-xl text-xs font-bold bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-[32px] p-8 shadow-3xl max-h-[90vh] overflow-y-auto ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3
                    className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {isEdit
                      ? modalType === "category"
                        ? "Edit Subcategory"
                        : "Edit Category"
                      : modalType === "category"
                        ? "Add Subcategory"
                        : "Add Category"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Chumme Administrative Panel
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-full ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {modalType === "country" && (
                  <>
                    <div>
                      <label
                        className={`block text-xs font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Category Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Philippines"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={inputClass(isDark)}
                      />
                    </div>
                    <ColorPicker
                      value={formData.color}
                      onChange={(c) =>
                        setFormData((prev) => ({ ...prev, color: c }))
                      }
                      isDark={isDark}
                    />
                  </>
                )}

                {modalType === "category" && (
                  <>
                    <div>
                      <label
                        className={`block text-xs font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Category Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., K-Pop Fans"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={inputClass(isDark)}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-xs font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Parent Category
                      </label>
                      <select
                        value={formData.targetParentName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            targetParentName: e.target.value,
                          }))
                        }
                        className={inputClass(isDark)}
                      >
                        <option value="">Select Parent Category</option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-xs font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Administrative Note
                      </label>
                      <textarea
                        placeholder="Category purpose or description..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={3}
                        className={`${inputClass(isDark)} h-auto py-4 resize-none`}
                      />
                    </div>
                    <ColorPicker
                      value={formData.color}
                      onChange={(c) =>
                        setFormData((prev) => ({ ...prev, color: c }))
                      }
                      isDark={isDark}
                    />
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-10">
                <button
                  onClick={isEdit ? handleUpdate : handleCreate}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-linear-to-r from-[#A53860] to-[#670D2F] text-white rounded-2xl font-black shadow-xl shadow-[#A53860]/30 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? "PROCESSING..."
                    : isEdit
                      ? "UPDATE CONTENT"
                      : "CONFIRM CREATION"}
                </button>
                {isEdit && (
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="w-full h-14 bg-red-500/10 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-5 h-5" /> REMOVE PERMANENTLY
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Snackbar messages={messages} onDismiss={dismiss} />
    </div>
  );
};
