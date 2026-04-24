"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

import { ChummeVisualDesign } from "@/modules/community/api/communities-api";

interface FloatingBubbleProps {
  id: string;
  name: string;
  count?: number;
  color?: string;
  size: number;
  label?: string;
  badge?: string;
  statusActive?: boolean;
  onClick: () => void;
  isDark?: boolean;
  containerWidth?: number;
  containerHeight?: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  position: { x: number; y: number };
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string) => void;
  chummeVisualDesign?: ChummeVisualDesign | null;
}

export const FloatingBubble = ({
  id,
  name,
  count,
  color = "#A53860",
  size,
  label,
  badge,
  statusActive,
  onClick,
  isDark,
  position,
  onPositionChange,
  onDragStart,
  onDragEnd,
  containerRef,
  chummeVisualDesign,
}: FloatingBubbleProps) => {
  const isDragging = useRef(false);

  const colorSet = chummeVisualDesign?.colorSet as
    | {
        primary?: string;
        glow?: string;
      }
    | undefined;

  const primaryColor = color;
  const glowColor = colorSet?.glow ?? primaryColor + "50";

  const handleDragStart = () => {
    isDragging.current = true;
    onDragStart?.(id);
  };

  const handleDrag = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } },
  ) => {
    if (isDragging.current) {
      onPositionChange(id, { x: info.point.x, y: info.point.y });
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    onDragEnd?.(id);
  };

  const countSize = size > 160 ? "24px" : size > 120 ? "20px" : "16px";

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: position.x - size / 2,
        y: position.y - size / 2,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        scale: { type: "spring", stiffness: 400, damping: 20 },
        x: { type: "tween", duration: 0 },
        y: { type: "tween", duration: 0 },
        opacity: { duration: 0.3 },
      }}
      className="absolute cursor-move group"
      style={{ width: size, height: size }}
      onClick={() => {
        if (!isDragging.current) onClick();
      }}
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
        style={{ backgroundColor: primaryColor }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Circle */}
      <div
        className="relative w-full h-full rounded-full flex flex-col items-center justify-center border-2 border-white/30 shadow-2xl group-hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
        style={{
          backgroundColor: primaryColor,
          boxShadow: `0 0 24px ${glowColor}`,
        }}
      >
        {/* Name */}
        <div
          className="text-white font-extrabold text-center leading-tight"
          style={{
            fontSize: size > 160 ? "22px" : size > 120 ? "19px" : "16px",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            width: `${size * 0.68}px`,
            maxWidth: `${size * 0.68}px`,
            lineHeight: 1.3,
            whiteSpace: "normal",
            letterSpacing: "0.02em",
            color: "#ffffff",
            fontWeight: 800,
          } as React.CSSProperties}
        >
          {name}
        </div>

        {count !== undefined && (
          <div
            className="text-white/95 font-semibold mt-1"
            style={{ fontSize: countSize }}
          >
            {count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}
          </div>
        )}

        {label && <div className="text-white/75 text-xs mt-0.5">{label}</div>}

        {badge && (
          <div className="mt-2 px-3 py-1 rounded-full bg-white/25 backdrop-blur-sm">
            <span className="text-white text-xs font-medium">{badge}</span>
          </div>
        )}

        {statusActive !== undefined && (
          <div className="absolute top-3 right-3">
            <motion.div
              className={`w-3 h-3 rounded-full shadow-lg ${
                statusActive ? "bg-green-400" : "bg-gray-400"
              }`}
              animate={{
                boxShadow: statusActive
                  ? [
                      "0 0 0 0 rgba(74,222,128,0.7)",
                      "0 0 0 8px rgba(74,222,128,0)",
                    ]
                  : "0 0 0 0 rgba(156,163,175,0)",
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg border ${
            isDark
              ? "bg-gray-900 text-white border-gray-700"
              : "bg-white text-gray-900 border-gray-200"
          }`}
        >
          Drag to move • Click to edit
        </div>
      </div>
    </motion.div>
  );
};
