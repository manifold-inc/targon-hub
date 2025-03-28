"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface Path {
  points: Point[];
  progress: number;
  alpha: number;
  targetLetter: number | null;
  isAssigned: boolean;
}

// Constants
const GRID_SIZE = 24;

const snapToGrid = (value: number) =>
  Math.round(value / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

export const DataFlowAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastUpdateTime = performance.now() / 1000;

    // Add this function back
    function getCanvasDimensions() {
      return {
        width: canvas!.width,
        height: canvas!.height,
      };
    }

    // Create 5 continuous flowing paths
    const paths: Path[] = Array(5)
      .fill(null)
      .map(() => ({
        points: generatePathAcrossGrid(),
        progress: Math.random(), // Random starting positions
        alpha: 0.3 + Math.random() * 0.2,
        targetLetter: null,
        isAssigned: false,
      }));

    function generatePathAcrossGrid(): Point[] {
      const { width, height } = getCanvasDimensions();
      const points: Point[] = [];

      // Start from left side
      const startY = snapToGrid(Math.random() * height);
      points.push({ x: GRID_SIZE / 2, y: startY });

      let currentPoint = { x: GRID_SIZE / 2, y: startY };

      // Generate path to right side with right angles
      while (currentPoint.x < width - GRID_SIZE) {
        // Randomly decide whether to move horizontally or vertically
        if (Math.random() > 0.3 || currentPoint.x < GRID_SIZE * 2) {
          // Move horizontally
          currentPoint = {
            x: currentPoint.x + GRID_SIZE,
            y: currentPoint.y,
          };
        } else {
          // Move vertically
          const step = Math.random() > 0.5 ? GRID_SIZE : -GRID_SIZE;
          currentPoint = {
            x: currentPoint.x,
            y: Math.max(
              GRID_SIZE,
              Math.min(height - GRID_SIZE, currentPoint.y + step),
            ),
          };
        }
        points.push({ ...currentPoint });
      }

      return points;
    }

    function drawFlowingPath(ctx: CanvasRenderingContext2D, path: Path) {
      const { points, progress, alpha } = path;
      if (points.length < 2) return;

      let totalLength = 0;
      const segments = points.slice(0, -1).map((start, i) => {
        const end = points[i + 1]!;
        const length = Math.hypot(end.x - start.x, end.y - start.y);
        totalLength += length;
        return { start, end, length };
      });

      const flowLength = GRID_SIZE * 3;
      const flowStart = (progress * totalLength) % totalLength;
      const flowEnd = Math.min(totalLength, flowStart + flowLength);

      segments.forEach(({ start, end, length }, i) => {
        const segmentStart = segments
          .slice(0, i)
          .reduce((sum, s) => sum + s.length, 0);
        const segmentEnd = segmentStart + length;

        if (flowEnd >= segmentStart && flowStart <= segmentEnd) {
          const gradient = ctx.createLinearGradient(
            start.x,
            start.y,
            end.x,
            end.y,
          );
          gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
          gradient.addColorStop(0.3, `rgba(255, 255, 255, ${alpha})`);
          gradient.addColorStop(0.7, `rgba(255, 255, 255, ${alpha})`);
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      });
    }

    const animate = () => {
      const currentTime = performance.now() / 1000;
      const deltaTime = currentTime - lastUpdateTime;
      lastUpdateTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw paths
      paths.forEach((path) => {
        path.progress += deltaTime * 0.2; // Adjust speed here
        drawFlowingPath(ctx, path);

        // Reset path when it reaches the end
        if (path.progress >= 1) {
          path.points = generatePathAcrossGrid();
          path.progress = 0;
        }
      });

      requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-[500px] w-full" />
  );
};
