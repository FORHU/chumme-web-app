"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect, useState, useMemo } from "react";

import { ChummeVisualDesign } from "@/modules/community/api/communities-api";

import {
  updatePhysics,
  drawConnection,
  distributeBubbles,
  type BubbleInstance,
} from "../utils/bubble-physics";

interface BubbleData {
  id: string;
  name: string;
  count?: number;
  color?: string;
  size: number;
  label?: string;
  chummeVisualDesign?: ChummeVisualDesign | null;
  onClick: () => void;
}

interface InteractiveBubbleCanvasProps {
  bubbles: BubbleData[];
  isDark: boolean;
  className?: string;
}

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  stroke?: boolean,
) => {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  for (const word of words) {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => {
    const ly = startY + i * lineHeight;
    if (stroke) ctx.strokeText(l, x, ly);
    ctx.fillText(l, x, ly);
  });
};

const InteractiveBubbleCanvas: React.FC<InteractiveBubbleCanvasProps> = ({
  bubbles,
  isDark,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Transform data into physics instances
  const bubbleInstances = useMemo(() => {
    return bubbles.map((b) => {
      const primaryColor =
        b.color || b.chummeVisualDesign?.colorSet?.primary || "#A53860";
      return {
        ...b,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: b.size / 2,
        primaryColor,
        isHovered: false,
      } as BubbleInstance;
    });
  }, [bubbles]);

  // Handle resizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
        distributeBubbles(bubbleInstances, clientWidth, clientHeight);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [bubbleInstances]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Update physics
      updatePhysics(bubbleInstances, dimensions.width, dimensions.height);

      // Draw connections
      for (let i = 0; i < bubbleInstances.length; i++) {
        for (let j = i + 1; j < bubbleInstances.length; j++) {
          const dx = bubbleInstances[i].x - bubbleInstances[j].x;
          const dy = bubbleInstances[i].y - bubbleInstances[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) {
            drawConnection(
              ctx,
              bubbleInstances[i],
              bubbleInstances[j],
              distance,
              isDark,
            );
          }
        }
      }

      // Draw bubbles (shadows/glows)
      bubbleInstances.forEach((bubble) => {
        ctx.save();

        // Draw bubble shadow/glow
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.shadowBlur = bubble.isHovered ? 40 : 20;
        ctx.shadowColor = bubble.primaryColor;

        // Background Gradient
        const gradient = ctx.createLinearGradient(
          bubble.x - bubble.radius,
          bubble.y - bubble.radius,
          bubble.x + bubble.radius,
          bubble.y + bubble.radius,
        );
        gradient.addColorStop(0, bubble.primaryColor);
        gradient.addColorStop(1, bubble.primaryColor + "bb");

        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.9;
        ctx.fill();

        // Inner Highlight
        const highlight = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.2,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x,
          bubble.y,
          bubble.radius,
        );
        highlight.addColorStop(0, "rgba(255, 255, 255, 0.18)");
        highlight.addColorStop(0.65, "rgba(255, 255, 255, 0)");

        ctx.shadowBlur = 0; // Don't shadow the inner gradients
        ctx.fillStyle = highlight;
        ctx.fill();

        // Border
        ctx.strokeStyle = bubble.isHovered
          ? "rgba(255, 255, 255, 0.6)"
          : "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        const size = bubble.radius * 2;
        const fontSize = size > 160 ? 22 : size > 120 ? 19 : 16;

        ctx.fillStyle = "white";
        ctx.font = `800 ${fontSize}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = 1;

        wrapText(
          ctx,
          bubble.name,
          bubble.x,
          bubble.y - 8,
          bubble.radius * 1.36,
          fontSize * 1.15,
          false,
        );

        if (bubble.count !== undefined) {
          const countSize = size > 160 ? 11 : size > 120 ? 10 : 9;
          ctx.font = `bold ${countSize}px Inter, sans-serif`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          const displayCount =
            bubble.count >= 1000
              ? `${(bubble.count / 1000).toFixed(1)}K`
              : `${bubble.count} users`;
          ctx.fillText(
            displayCount,
            bubble.x,
            bubble.y + bubble.radius / 2.2,
          );
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, bubbleInstances, isDark]);

  const getPointerPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const findBubbleAt = (x: number, y: number) => {
    for (const bubble of bubbleInstances) {
      const dx = x - bubble.x;
      const dy = y - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bubble.radius) {
        return bubble;
      }
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getPointerPos(e, canvas);
    const bubble = findBubbleAt(x, y);

    bubbleInstances.forEach((b) => (b.isHovered = false));

    if (bubble) {
      bubble.isHovered = true;
      canvas.style.cursor = "pointer";
      setHoveredId(bubble.id);
    } else {
      canvas.style.cursor = "default";
      setHoveredId(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getPointerPos(e, canvas);
    const bubble = findBubbleAt(x, y);

    if (bubble) {
      setHoveredId(bubble.id);
      // We don't call onClick here because a touchstart might be the start of a scroll
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getPointerPos(e, canvas);
    const bubble = findBubbleAt(x, y);

    if (bubble) {
      const originalBubble = bubbles.find((b) => b.id === bubble.id);
      originalBubble?.onClick();
    }
  };

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        className="block"
      />

      {/* Overlay UI hints */}
      <AnimatePresence>
        {hoveredId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border text-xs font-semibold backdrop-blur-md z-10 pointer-events-none ${
              isDark
                ? "bg-gray-900/80 border-gray-700 text-white"
                : "bg-white/80 border-gray-200 text-gray-900"
            }`}
          >
            Click to manage {bubbles.find((b) => b.id === hoveredId)?.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveBubbleCanvas;
