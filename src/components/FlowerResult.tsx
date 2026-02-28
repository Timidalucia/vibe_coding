import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FlowerResultProps {
  flower: ArtFlower;
  userMood: string;
  onReset: () => void;
}

const FlowerResult = ({ flower, onReset }: FlowerResultProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto px-6"
    >
      {/* Decorative flower accent */}
      <motion.div
        className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-8 flex items-center justify-center"
        style={{ backgroundColor: `hsl(${flower.color} / 0.15)` }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full"
          style={{ backgroundColor: `hsl(${flower.color} / 0.35)` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      </motion.div>

      {/* Flower name */}
      <motion.h2
        className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground text-center mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {flower.name}
      </motion.h2>

      {/* Artwork attribution */}
      <motion.p
        className="text-muted-foreground text-center text-sm md:text-base mb-8 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        from <span className="font-serif italic">"{flower.artwork}"</span> by {flower.artist}, {flower.year}
      </motion.p>

      {/* Divider */}
      <motion.div
        className="w-16 h-px bg-border mb-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      />

      {/* Artwork description */}
      <motion.p
        className="text-foreground/80 text-center text-base md:text-lg leading-relaxed mb-6 font-sans"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {flower.description}
      </motion.p>

      {/* Healing message card */}
      <motion.div
        className="w-full rounded-2xl p-6 md:p-8 mb-10"
        style={{ backgroundColor: `hsl(${flower.color} / 0.08)` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <p className="font-serif italic text-sm text-muted-foreground mb-3">Why this flower is for you</p>
        <p className="text-foreground text-base md:text-lg leading-relaxed font-sans">
          {flower.healingMessage}
        </p>
      </motion.div>

      {/* Reset button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-full px-6 py-5 text-sm font-sans gap-2 border-border/60 hover:bg-card transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" />
          Share another feeling
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default FlowerResult;
