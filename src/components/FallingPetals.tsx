import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  scale: number;
}

export default function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Create a set of petals
    const newPetals = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 120 - 20, // Start from -20vw to 100vw to cover left side as they drift right
      delay: Math.random() * 5, // Random delay
      duration: 5 + Math.random() * 5, // Random duration between 5-10s
      scale: 2.0 + Math.random() * 1.5, // Even bigger size (2.0x to 3.5x)
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: -50, x: `${petal.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: [`${petal.x}vw`, `${petal.x + 30 + Math.random() * 20}vw`], // Drift right by 30-50vw
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
          className="absolute top-0"
          style={{ scale: petal.scale }}
        >
          {/* Simple Petal Shape SVG */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#FFB7C5" // Cherry blossom pink
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.8 }}
          >
            <path d="M12 2C12 2 16 8 16 12C16 16 12 22 12 22C12 22 8 16 8 12C8 8 12 2 12 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
