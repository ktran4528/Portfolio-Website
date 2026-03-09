import { motion } from "motion/react";
import { Link } from "react-router-dom";
import FallingPetals from "../components/FallingPetals";

export default function Home() {
  return (
    <div className="h-[calc(100vh-80px)] bg-comic-bg text-comic-text relative overflow-hidden flex flex-col items-center justify-center">
      <FallingPetals />
      
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-script text-8xl md:text-9xl mb-2"
        >
          Falling
        </motion.h1>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-script text-8xl md:text-9xl mb-8"
        >
          Rain Droplet
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link 
            to="/series"
            className="inline-block bg-comic-nav/50 px-12 py-3 rounded-full hover:bg-comic-nav hover:text-white transition-all duration-300 cursor-pointer"
          >
            <span className="text-white text-2xl font-serif tracking-widest uppercase">Webcomic</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
