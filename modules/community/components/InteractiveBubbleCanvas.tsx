"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  updatePhysics, 
  drawConnection, 
  distributeBubbles,
  type BubbleInstance 
} from "../utils/bubble-physics";

interface BubbleData {
  id: string;
  name: string;
  count?: number;
  color?: string;
  size: number;
  label?: string;
  chummeVisualDesign?: any | null;
  onClick: () => void;
}

interface InteractiveBubbleCanvasProps {
  bubbles: BubbleData[];
  isDark: boolean;
  className?: string;
}

const InteractiveBubbleCanvas: React.FC<InteractiveBubbleCanvasProps> = ({
  bubbles,
  isDark,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Transform data into physics instances
  const bubbleInstances = useMemo(() => {
    return bubbles.map(b => {
      const primaryColor = b.color || (b.chummeVisualDesign?.colorSet?.primary) || "#A53860";
      return {
        ...b,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: b.size / 2,
        primaryColor,
        isHovered: false
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
            drawConnection(ctx, bubbleInstances[i], bubbleInstances[j], distance, isDark);
          }
        }
      }

      // Draw bubbles (shadows/glows)
      bubbleInstances.forEach(bubble => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        
        // Glow effect
        ctx.shadowBlur = bubble.isHovered ? 40 : 20;
        ctx.shadowColor = bubble.primaryColor;
        ctx.fillStyle = bubble.primaryColor;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        
        // Text
        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.max(10, bubble.radius / 3)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = 1;
        
        // Truncate name if too long
        let displayName = bubble.name;
        if (displayName.length > 12) displayName = displayName.substring(0, 10) + "..";
        
        ctx.fillText(displayName, bubble.x, bubble.y);
        
        if (bubble.count !== undefined) {
          ctx.font = `${Math.max(8, bubble.radius / 5)}px Inter, system-ui, sans-serif`;
          ctx.fillText(`${bubble.count} users`, bubble.x, bubble.y + (bubble.radius / 2.5));
        }
        
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, bubbleInstances, isDark]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let foundId: string | null = null;
    bubbleInstances.forEach(bubble => {
      const dx = mouseX - bubble.x;
      const dy = mouseY - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < bubble.radius) {
        bubble.isHovered = true;
        foundId = bubble.id;
        canvas.style.cursor = "pointer";
      } else {
        bubble.isHovered = false;
      }
    });

    if (!foundId) canvas.style.cursor = "default";
    setHoveredId(foundId);
  };

  const handleClick = () => {
    if (hoveredId) {
      const bubble = bubbles.find(b => b.id === hoveredId);
      bubble?.onClick();
    }
  };

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
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
              isDark ? "bg-gray-900/80 border-gray-700 text-white" : "bg-white/80 border-gray-200 text-gray-900"
            }`}
          >
            Click to manage {bubbles.find(b => b.id === hoveredId)?.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveBubbleCanvas;
