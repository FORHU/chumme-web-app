"use client";

import { useState, useEffect, useRef } from "react";
import { FloatingBubble } from "@/modules/community/components/FloatingBubble";

interface BubblePosition {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  isDragging?: boolean;
  isManuallyPlaced?: boolean;
}

export interface BubbleData {
  id: string;
  name: string;
  count?: number;
  color?: string;
  size: number;
  label?: string;
  badge?: string;
  statusActive?: boolean;
  onClick: () => void;
}

interface BubbleCanvasProps {
  bubbles: BubbleData[];
  isDark?: boolean;
  containerWidth?: number;
  containerHeight?: number;
}

export const BubbleCanvas = ({
  bubbles,
  isDark,
  containerWidth: propWidth,
  containerHeight: propHeight,
}: BubbleCanvasProps) => {
  const [positions, setPositions] = useState<Record<string, BubblePosition>>({});
  const [containerSize, setContainerSize] = useState({
    width: propWidth || 800,
    height: propHeight || 500,
  });
  const animationRef = useRef<number>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const { width: containerWidth, height: containerHeight } = containerSize;

  useEffect(() => {
    const initial: Record<string, BubblePosition> = {};
    const PADDING = 24;
    bubbles.forEach((bubble, index) => {
      const angle = (index / bubbles.length) * Math.PI * 2;
      const radius = Math.min(containerWidth, containerHeight) * 0.25;
      const x = containerWidth / 2 + Math.cos(angle) * radius;
      const y = containerHeight / 2 + Math.sin(angle) * radius;
      const r = bubble.size / 2;
      initial[bubble.id] = {
        id: bubble.id,
        x: Math.max(r + PADDING, Math.min(containerWidth - r - PADDING, x)),
        y: Math.max(r + PADDING, Math.min(containerHeight - r - PADDING, y)),
        vx: 0,
        vy: 0,
        size: bubble.size,
        isDragging: false,
        isManuallyPlaced: false,
      };
    });
    setPositions(initial);
  }, [bubbles, containerWidth, containerHeight]);

  useEffect(() => {
    const animate = () => {
      setPositions((prev) => {
        const next = { ...prev };
        const arr = Object.values(next);
        arr.forEach((b) => {
          if (b.isDragging || b.isManuallyPlaced) return;
          b.x += b.vx;
          b.y += b.vy;
          const pad = b.size / 2 + 20;
          if (b.x <= pad) { b.x = pad; b.vx = Math.abs(b.vx) * 0.8; }
          else if (b.x >= containerWidth - pad) { b.x = containerWidth - pad; b.vx = -Math.abs(b.vx) * 0.8; }
          if (b.y <= pad) { b.y = pad; b.vy = Math.abs(b.vy) * 0.8; }
          else if (b.y >= containerHeight - pad) { b.y = containerHeight - pad; b.vy = -Math.abs(b.vy) * 0.8; }
          arr.forEach((other) => {
            if (b.id === other.id || other.isDragging || other.isManuallyPlaced) return;
            const dx = other.x - b.x;
            const dy = other.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const min = (b.size + other.size) / 2 + 10;
            if (dist < min && dist > 0) {
              const angle = Math.atan2(dy, dx);
              const ax = (b.x + Math.cos(angle) * min - other.x) * 0.05;
              const ay = (b.y + Math.sin(angle) * min - other.y) * 0.05;
              b.vx -= ax; b.vy -= ay;
              other.vx += ax; other.vy += ay;
              const overlap = min - dist;
              const sx = (dx / dist) * overlap * 0.5;
              const sy = (dy / dist) * overlap * 0.5;
              b.x -= sx; b.y -= sy;
              other.x += sx; other.y += sy;
            }
          });
          b.vx *= 0.98;
          b.vy *= 0.98;
        });
        return next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [containerWidth, containerHeight]);

  const handleDragStart = (id: string) => {
    setPositions((prev) => ({
      ...prev,
      [id]: { ...prev[id], isDragging: true, vx: 0, vy: 0 },
    }));
  };

  const handlePositionChange = (id: string, pos: { x: number; y: number }) => {
    setPositions((prev) => {
      const b = prev[id];
      if (!b) return prev;
      const r = b.size / 2;
      let cx = Math.max(r, Math.min(containerWidth - r, pos.x));
      let cy = Math.max(r, Math.min(containerHeight - r, pos.y));
      const arr = Object.values(prev);
      let hasCollision = true;
      let iters = 0;
      while (hasCollision && iters < 10) {
        hasCollision = false;
        iters++;
        for (const other of arr) {
          if (other.id === id) continue;
          const dx = cx - other.x;
          const dy = cy - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const min = (b.size + other.size) / 2 + 15;
          if (dist < min) {
            hasCollision = true;
            const angle = dist > 0 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
            cx = other.x + Math.cos(angle) * min;
            cy = other.y + Math.sin(angle) * min;
            cx = Math.max(r, Math.min(containerWidth - r, cx));
            cy = Math.max(r, Math.min(containerHeight - r, cy));
          }
        }
      }
      return {
        ...prev,
        [id]: { ...prev[id], x: cx, y: cy, vx: 0, vy: 0, isManuallyPlaced: true },
      };
    });
  };

  const handleDragEnd = (id: string) => {
    setPositions((prev) => ({
      ...prev,
      [id]: { ...prev[id], isDragging: false, vx: 0, vy: 0 },
    }));
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {bubbles.map((bubble) => {
        const position = positions[bubble.id];
        if (!position) return null;
        return (
          <FloatingBubble
            key={bubble.id}
            id={bubble.id}
            name={bubble.name}
            count={bubble.count}
            color={bubble.color}
            size={bubble.size}
            label={bubble.label}
            badge={bubble.badge}
            statusActive={bubble.statusActive}
            isDark={isDark}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            containerRef={containerRef}
            position={position}
            onPositionChange={handlePositionChange}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={bubble.onClick}
          />
        );
      })}
    </div>
  );
};
