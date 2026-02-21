
import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

const FIREWORK_COLORS = [
  '#E11D48', // Vibrant Rose/Red
  '#D97706', // Amber/Gold
  '#2563EB', // Blue
  '#7C3AED', // Violet
  '#059669', // Emerald
  '#DB2777', // Pink
  '#EA580C', // Orange
];

const FireworkEffect: React.FC<{ trigger: { x: number; y: number } | null }> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  const createFirework = useCallback((x: number, y: number) => {
    const particleCount = 60; 
    const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      // Reduced speed range for slower animation
      const speed = Math.random() * 4 + 2;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color
      });
    }
  }, []);

  useEffect(() => {
    if (trigger) {
      createFirework(trigger.x, trigger.y);
    }
  }, [trigger, createFirework]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const update = () => {
      // Reset globalAlpha to ensure clearing works correctly
      ctx.globalAlpha = 1;

      // Use a slight fade effect to leave trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Reduced from 0.2 for longer trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      
      particles.current = particles.current.filter(p => p.alpha > 0.01);
      
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Reduced gravity (was 0.15)
        p.alpha -= 0.01; // Reduced fade speed (was 0.03)
        
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a slight glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      });

      animationFrame = requestAnimationFrame(update);
    };

    window.addEventListener('resize', resize);
    resize();
    update();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-container" />;
};

export default FireworkEffect;
