import { useState } from "react";
import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkSourceImages } from "@/data/artworkImages";
import BouquetFlower from "@/components/BouquetFlower";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BouquetResultProps {
  flowers: ArtFlower[];
  userMood: string;
  onReset: () => void;
}

// Spiral arrow SVG paths for each position (left, center, right)
const arrowPaths = [
  "M 18,95 C 8,70 20,40 32,28",
  "M 50,100 C 48,78 52,55 50,32",
  "M 82,95 C 92,70 80,40 68,28",
];

const arrowAnchors = [
  { x: "12%", y: "52%", textAnchor: "start" as const },
  { x: "50%", y: "58%", textAnchor: "middle" as const },
  { x: "88%", y: "52%", textAnchor: "end" as const },
];

const BouquetResult = ({ flowers, userMood, onReset }: BouquetResultProps) => {
  const [selectedFlower, setSelectedFlower] = useState<ArtFlower | null>(null);
  const [modalWidth, setModalWidth] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full max-w-[800px] mx-auto px-4"
    >
      {/* Bouquet stage */}
      <div className="relative w-full h-[380px] md:h-[460px] mb-2">
        {/* Spiral name arrows */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 120"
          preserveAspectRatio="xMidYMid meet"
          style={{ zIndex: 10 }}
        >
          {flowers.map((flower, i) => {
            const anchor = arrowAnchors[i];
            return (
              <motion.g
                key={flower.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
              >
                {/* Arrow path */}
                <path
                  d={arrowPaths[i]}
                  fill="none"
                  stroke="hsl(var(--muted-foreground) / 0.35)"
                  strokeWidth="0.4"
                  strokeDasharray="2,1.5"
                  markerEnd={`url(#arrowhead-${i})`}
                />
                {/* Arrowhead marker */}
                <defs>
                  <marker
                    id={`arrowhead-${i}`}
                    markerWidth="4"
                    markerHeight="3"
                    refX="3"
                    refY="1.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 4 1.5, 0 3"
                      fill="hsl(var(--muted-foreground) / 0.35)"
                    />
                  </marker>
                </defs>
              </motion.g>
            );
          })}
        </svg>

        {/* Name labels */}
        {flowers.map((flower, i) => {
          const anchor = arrowAnchors[i];
          return (
            <motion.div
              key={`label-${flower.id}`}
              className="absolute font-serif italic text-muted-foreground text-xs md:text-sm"
              style={{
                left: anchor.x,
                top: anchor.y,
                transform: i === 0 ? "translateX(-100%)" : i === 2 ? "translateX(0%)" : "translateX(-50%)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.15, duration: 0.4 }}
            >
              {flower.name}
            </motion.div>
          );
        })}

        {/* Flowers */}
        {flowers.map((flower, i) => (
          <BouquetFlower
            key={flower.id}
            flower={flower}
            index={i}
            onClick={() => setSelectedFlower(flower)}
          />
        ))}

        {/* Paper wrap — cone shape */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "220px",
            height: "120px",
            zIndex: 4,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <svg
            viewBox="0 0 220 120"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }}
          >
            {/* Main paper cone */}
            <path
              d="M 20,0 L 200,0 L 140,115 Q 110,125 80,115 Z"
              fill="hsl(35, 25%, 88%)"
              stroke="hsl(35, 20%, 78%)"
              strokeWidth="0.8"
            />
            {/* Fold line */}
            <path
              d="M 40,0 Q 100,30 180,0"
              fill="none"
              stroke="hsl(35, 20%, 80%)"
              strokeWidth="0.5"
              strokeDasharray="3,2"
            />
            {/* Subtle texture lines */}
            <path d="M 60,10 L 100,100" stroke="hsl(35, 15%, 84%)" strokeWidth="0.3" opacity="0.5" />
            <path d="M 140,10 L 115,100" stroke="hsl(35, 15%, 84%)" strokeWidth="0.3" opacity="0.5" />
          </svg>
        </motion.div>
      </div>

      {/* Attribution line */}
      <motion.p
        className="text-muted-foreground text-center text-sm font-sans mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        A bouquet from the masters, chosen for your heart
      </motion.p>

      <motion.div
        className="w-12 h-px bg-border mb-3"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      />

      {/* Combined healing message */}
      <motion.div
        className="w-full max-w-lg rounded-2xl p-4 md:p-5 mb-5 bg-card/50"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <p className="font-serif italic text-xs text-muted-foreground mb-2">
          Why these flowers are for you
        </p>
        <p className="text-foreground text-sm md:text-base leading-relaxed font-sans">
          {flowers[0]?.healingMessage}
        </p>
        <p className="text-muted-foreground text-xs mt-3 font-sans">
          Hover over each flower to explore · Click to see the full painting
        </p>
      </motion.div>

      {/* Reset */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-full px-5 py-4 text-sm font-sans gap-2 border-border/60 hover:bg-card transition-all duration-300"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Share another feeling
        </Button>
      </motion.div>

      {/* Detail modal for clicked flower */}
      <Dialog open={!!selectedFlower} onOpenChange={(open) => !open && setSelectedFlower(null)}>
        {selectedFlower && (
          <DialogContent
            className="p-0 gap-0 overflow-hidden"
            style={{
              width: modalWidth ? `min(90vw, ${modalWidth}px)` : "min(90vw, 500px)",
              maxWidth: modalWidth ? `${modalWidth}px` : "500px",
              maxHeight: "88vh",
            }}
          >
            <div className="w-full overflow-hidden">
              <img
                src={artworkSourceImages[selectedFlower.id]}
                alt={`${selectedFlower.artwork} by ${selectedFlower.artist} — full painting`}
                className="w-full h-auto block"
                style={{ maxHeight: "min(70vh, 720px)", objectFit: "contain" }}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  const aspect = img.naturalWidth / img.naturalHeight;
                  const maxH = Math.min(window.innerHeight * 0.7, 720);
                  const renderedW = maxH * aspect;
                  setModalWidth(Math.round(renderedW + 48));
                }}
              />
            </div>
            <div className="px-5 py-4 md:px-6 md:py-5 overflow-hidden">
              <DialogHeader>
                <DialogTitle className="font-serif text-base md:text-lg leading-snug">
                  {selectedFlower.artist} —{" "}
                  <span className="italic">{selectedFlower.artwork}</span> ({selectedFlower.year})
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed mt-2">
                  {selectedFlower.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: `hsl(${selectedFlower.color} / 0.08)` }}>
                <p className="font-serif italic text-xs text-muted-foreground mb-1">
                  Why this flower is for you
                </p>
                <p className="text-foreground text-sm leading-relaxed font-sans">
                  {selectedFlower.healingMessage}
                </p>
              </div>
              {selectedFlower.sourceUrl && (
                <a
                  href={selectedFlower.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs text-muted-foreground/60 hover:text-muted-foreground mt-2 underline underline-offset-2"
                >
                  Source: Wikimedia Commons
                </a>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </motion.div>
  );
};

export default BouquetResult;
