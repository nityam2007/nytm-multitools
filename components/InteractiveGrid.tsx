"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        id: i,
        x: Math.random() * 300,
        y: Math.random() * 300,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    particlesRef.current = particles;
    setIsInitialized(true);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Use violet/purple accent colors - matches site theme
    const particleColor = "139, 92, 246"; // violet-500
    const lineColor = "139, 92, 246";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Update and draw particles
    particles.forEach((p, i) => {
      // Mouse interaction
      if (mouse.isHovering) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.vx += dx * force * 0.01;
          p.vy += dy * force * 0.01;
        }
      }

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Boundary bounce
      if (p.x < 0 || p.x > 300) p.vx *= -1;
      if (p.y < 0 || p.y > 300) p.vy *= -1;

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
      ctx.fill();

      // Draw connections
      particles.slice(i + 1).forEach((p2) => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${0.15 * (1 - dist / 80)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    // Draw central geometric shape
    const centerX = 150;
    const centerY = 150;
    const time = Date.now() / 2000;
    const shapeRotation = time % (Math.PI * 2);

    // Outer rotating squares
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Draw multiple rotating squares
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate(shapeRotation + (i * Math.PI) / 3);
      const size = 40 + i * 15;
      ctx.strokeStyle = `rgba(${lineColor}, ${0.3 - i * 0.08})`;
      ctx.lineWidth = 1.5 - i * 0.3;
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    }

    // Inner hexagon
    ctx.save();
    ctx.rotate(-shapeRotation * 0.5);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * 25;
      const y = Math.sin(angle) * 25;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(${particleColor}, 0.1)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${lineColor}, 0.4)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Central dot
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particleColor}, 0.8)`;
    ctx.fill();

    ctx.restore();

    // Corner decorations - Swiss grid style
    const corners = [
      { x: 20, y: 20 },
      { x: 280, y: 20 },
      { x: 20, y: 280 },
      { x: 280, y: 280 },
    ];

    corners.forEach((corner, i) => {
      ctx.save();
      ctx.translate(corner.x, corner.y);
      ctx.rotate((time * 0.5 + i * Math.PI / 2) % (Math.PI * 2));
      
      // Small cross
      ctx.strokeStyle = `rgba(${lineColor}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.moveTo(0, -8);
      ctx.lineTo(0, 8);
      ctx.stroke();
      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y, isHovering: true };
    
    // Update 3D rotation
    const rotX = ((y / rect.height) - 0.5) * 10;
    const rotY = ((x / rect.width) - 0.5) * -10;
    setRotation({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovering = false;
    setRotation({ x: 0, y: 0 });
  };

  if (!isInitialized) {
    return (
      <div className="relative w-[300px] h-[300px] cursor-crosshair bg-[var(--muted)]/20 rounded-lg" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-[300px] h-[300px] cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "800px" }}
    >
      <div
        className="w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Canvas for particles and shapes */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full h-full"
        />

        {/* Border frame - Swiss style with violet accent */}
        <div className="absolute inset-0 border border-violet-500/20 pointer-events-none rounded-lg" />
        
        {/* Corner brackets with violet */}
        <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-violet-500/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-violet-500/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-violet-500/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-violet-500/50 rounded-br-lg" />

        {/* Grid lines overlay - subtle violet */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-violet-500" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-violet-500" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-violet-500" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-violet-500" />
        </div>
      </div>

      {/* Label - Swiss typography */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-between items-center text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-widest">
        <span>Interactive</span>
        <span className="text-violet-500">001</span>
      </div>
    </div>
  );
}
