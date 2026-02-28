import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkImages } from "@/data/artworkImages";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FlowerResultProps {
  flower: ArtFlower;
  userMood: string;
  onReset: () => void;
}

const FlowerResult = ({ flower, onReset }: FlowerResultProps) => {
  const artworkSrc = artworkImages[flower.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 md:px-6"
    >
      {/* Artwork showcase */}
      <motion.div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl mb-10"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* The artwork image */}
        <img
          src={artworkSrc}
          alt={`${flower.artwork} by ${flower.artist}`}
          className="w-full h-auto block"
        />

        {/* Vignette overlay to dim edges and emphasize center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 30%, rgba(0,0,0,0.35) 100%)",
          }}
        />

        {/* Emphasis border line — animated SVG frame highlighting the flower */}
        <motion.div
          className="absolute inset-[12%] rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.rect
              x="1"
              y="1"
              width="98"
              height="98"
              rx="4"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="0.6"
              strokeDasharray="300"
              initial={{ strokeDashoffset: 300 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Corner accents */}
        {[
          "top-[10%] left-[10%]",
          "top-[10%] right-[10%] rotate-90",
          "bottom-[10%] right-[10%] rotate-180",
          "bottom-[10%] left-[10%] -rotate-90",
        ].map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute ${pos} w-4 h-4 pointer-events-none`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M0 12V0h12" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
            </svg>
          </motion.div>
        ))}

        {/* Flower name overlay at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="px-6 py-2.5 backdrop-blur-md rounded-full" style={{ background: "rgba(0,0,0,0.45)" }}>
            <h2 className="font-serif text-xl md:text-2xl tracking-wide" style={{ color: "rgba(255,255,255,0.95)" }}>
              {flower.name}
            </h2>
          </div>
        </motion.div>
      </motion.div>

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
        className="text-foreground/80 text-center text-base md:text-lg leading-relaxed mb-6 font-sans max-w-xl"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {flower.description}
      </motion.p>

      {/* Healing message card */}
      <motion.div
        className="w-full max-w-xl rounded-2xl p-6 md:p-8 mb-10"
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
