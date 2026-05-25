import { useEffect, useRef } from "react";

export function ParallaxStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -0.5 to 0.5 relative to screen center
      targetMouseX = (e.clientX / width) - 0.5;
      targetMouseY = (e.clientY / height) - 0.5;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Star definition
    interface Star {
      x: number;
      y: number;
      size: number;
      depth: number; // 0.1 to 1 (smaller value means further away, slower movement)
      color: string;
      alpha: number;
      fadeSpeed: number;
    }

    const starCount = 180;
    const stars: Star[] = [];

    const colors = [
      "rgba(255, 255, 255,",   // White
      "rgba(59, 130, 246,",   // Brand blue
      "rgba(147, 51, 234,",   // Purple
      "rgba(99, 102, 241,"    // Indigo
    ];

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        depth: Math.random() * 0.9 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        fadeSpeed: (Math.random() * 0.01 + 0.002) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    // Animation loop
    const animate = () => {
      // Clear with very light alpha to create a slight star trail effect
      ctx.fillStyle = "rgba(5, 5, 5, 0.4)";
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse coordinates interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      stars.forEach((star) => {
        // Move star based on its depth and the mouse movement (parallax)
        // Also add a slow constant drift downwards
        const driftX = -mouseX * star.depth * 45;
        const driftY = -mouseY * star.depth * 45 + (star.depth * 0.15);

        let drawX = star.x + driftX;
        let drawY = star.y + driftY;

        // Wrap around screen boundaries
        if (drawX < 0) drawX = width + (drawX % width);
        if (drawX > width) drawX = drawX % width;
        if (drawY < 0) drawY = height + (drawY % height);
        if (drawY > height) drawY = drawY % height;

        // Animate star twinkle (alpha variation)
        star.alpha += star.fadeSpeed;
        if (star.alpha > 0.8 || star.alpha < 0.2) {
          star.fadeSpeed = -star.fadeSpeed;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${star.alpha})`;
        ctx.shadowBlur = star.size * 2;
        ctx.shadowColor = "rgba(59, 130, 246, 0.3)";
        ctx.fill();
      });

      // Clear shadows for performance in next loop
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 bg-[#050505] pointer-events-none"
    />
  );
}
