export interface BubbleInstance {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  primaryColor: string;
  isHovered: boolean;
  count?: number;
  onClick: () => void;
}

export const distributeBubbles = (
  bubbles: BubbleInstance[],
  width: number,
  height: number,
) => {
  bubbles.forEach((b, i) => {
    const angle = (i / bubbles.length) * Math.PI * 2;
    const radius = Math.min(width, height) * (width < 640 ? 0.2 : 0.3);
    b.x = width / 2 + Math.cos(angle) * (radius * (Math.random() * 0.5 + 0.75));
    b.y = height / 2 + Math.sin(angle) * (radius * (Math.random() * 0.5 + 0.75));
    b.vx = (Math.random() - 0.5) * 2;
    b.vy = (Math.random() - 0.5) * 2;
  });
};

export const updatePhysics = (
  bubbles: BubbleInstance[],
  width: number,
  height: number,
) => {
  bubbles.forEach((b) => {
    b.x += b.vx;
    b.y += b.vy;

    // Boundary collisions
    const pad = b.radius + 10;
    if (b.x < pad) {
      b.x = pad;
      b.vx = Math.abs(b.vx) * 0.5;
    } else if (b.x > width - pad) {
      b.x = width - pad;
      b.vx = -Math.abs(b.vx) * 0.5;
    }

    if (b.y < pad) {
      b.y = pad;
      b.vy = Math.abs(b.vy) * 0.5;
    } else if (b.y > height - pad) {
      b.y = height - pad;
      b.vy = -Math.abs(b.vy) * 0.5;
    }

    // Inter-bubble collisions
    bubbles.forEach((other) => {
      if (b.id === other.id) return;
      const dx = other.x - b.x;
      const dy = other.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = b.radius + other.radius + 15;

      if (distance < minDistance && distance > 0) {
        const force = (minDistance - distance) / distance;
        const speedMultiplier = width < 640 ? 0.08 : 0.04;
        const pushX = dx * force * speedMultiplier;
        const pushY = dy * force * speedMultiplier;

        b.vx -= pushX;
        b.vy -= pushY;
        other.vx += pushX;
        other.vy += pushY;
      }
    });

    // Towards center attraction (very weak)
    const dxCenter = width / 2 - b.x;
    const dyCenter = height / 2 - b.y;
    const centerAttraction = width < 640 ? 0.00005 : 0.0001;
    b.vx += dxCenter * centerAttraction;
    b.vy += dyCenter * centerAttraction;

    // Stability
    b.vx *= 0.98;
    b.vy *= 0.98;
  });
};

export const drawConnection = (
  ctx: CanvasRenderingContext2D,
  b1: BubbleInstance,
  b2: BubbleInstance,
  distance: number,
  isDark: boolean,
) => {
  const opacity = Math.max(0, 1 - distance / 250);
  ctx.beginPath();
  ctx.moveTo(b1.x, b1.y);
  ctx.lineTo(b2.x, b2.y);
  ctx.strokeStyle = isDark
    ? `rgba(255, 255, 255, ${opacity * 0.1})`
    : `rgba(0, 0, 0, ${opacity * 0.05})`;
  ctx.lineWidth = 1;
  ctx.stroke();
};
