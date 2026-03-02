import { useState } from "react";
import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkSourceImages } from "@/data/artworkImages";
import paperTexture from "@/assets/paper-texture.jpg";
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
      <div className="relative w-full h-[380px] md:h-[440px] mb-2">
        {/* Flowers */}
        {flowers.map((flower, i) => (
          <BouquetFlower
            key={flower.id}
            flower={flower}
            index={i}
            onClick={() => setSelectedFlower(flower)}
          />
        ))}

        {/* Paper wrap */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "240px",
            height: "150px",
            zIndex: 4,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <svg
            viewBox="0 0 240 150"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.07))" }}
          >
            <defs>
              <clipPath id="wrapClip">
                <path d="M 25,0 L 215,0 L 155,145 Q 120,155 85,145 Z" />
              </clipPath>
            </defs>
            {/* Paper texture fill */}
            <image
              href={paperTexture}
              x="0" y="0"
              width="240" height="150"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#wrapClip)"
              opacity="0.85"
            />
            {/* Overlay tint */}
            <path
              d="M 25,0 L 215,0 L 155,145 Q 120,155 85,145 Z"
              fill="hsl(35, 25%, 90%)"
              opacity="0.35"
            />
            {/* Outline */}
            <path
              d="M 25,0 L 215,0 L 155,145 Q 120,155 85,145 Z"
              fill="none"
              stroke="hsl(35, 18%, 78%)"
              strokeWidth="0.7"
            />
            {/* Fold crease */}
            <path
              d="M 50,0 Q 120,35 190,0"
              fill="none"
              stroke="hsl(35, 15%, 80%)"
              strokeWidth="0.5"
              strokeDasharray="4,3"
            />
          </svg>
        </motion.div>
      </div>

      {/* Attribution line */}
      <motion.p
        className="text-muted-foreground text-center text-sm font-sans mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        A bouquet from the masters, chosen for your heart
      </motion.p>

      <motion.div
        className="w-12 h-px bg-border mb-3"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      />

      {/* Combined healing message */}
      <motion.div
        className="w-full max-w-lg rounded-2xl p-4 md:p-5 mb-5 bg-card/50"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
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
        transition={{ delay: 1, duration: 0.4 }}
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
