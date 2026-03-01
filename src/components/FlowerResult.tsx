import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkSourceImages, artworkStickerImages } from "@/data/artworkImages";
import { removeBackground } from "@/lib/removeBackground";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FlowerResultProps {
  flower: ArtFlower;
  userMood: string;
  onReset: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

const FlowerResult = ({ flower, onReset, onHoverChange }: FlowerResultProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedSticker, setProcessedSticker] = useState<string | null>(null);

  const rawStickerSrc = artworkStickerImages[flower.id];
  const sourceSrc = artworkSourceImages[flower.id];

  useEffect(() => {
    if (rawStickerSrc) {
      removeBackground(rawStickerSrc).then(setProcessedSticker);
    }
  }, [rawStickerSrc]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 md:px-6"
    >
      {/* Interactive sticker area */}
      <motion.div
        className="relative w-full max-w-xs md:max-w-sm cursor-pointer"
        style={{ aspectRatio: "3 / 4" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onMouseEnter={() => { setIsHovered(true); onHoverChange?.(true); }}
        onMouseLeave={() => { setIsHovered(false); onHoverChange?.(false); }}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View ${flower.artwork} by ${flower.artist}`}
      >
        {/* Original painting (revealed on hover) */}
        <img
          src={sourceSrc}
          alt={`${flower.artwork} by ${flower.artist}`}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-[400ms] ease-in-out"
          style={{ opacity: isHovered ? 1 : 0 }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Flower cut-out — exact uploaded PNG, no effects */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img
            src={processedSticker || rawStickerSrc}
            alt={`${flower.name} — cut-out from ${flower.artwork}`}
            className="max-w-[90%] max-h-[90%] object-contain transition-opacity duration-[400ms] ease-in-out"
            style={{
              opacity: isHovered ? 0.12 : 1,
            }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
              const placeholder = document.createElement('div');
              placeholder.className = 'w-48 h-64 bg-muted rounded-lg';
              el.parentElement?.appendChild(placeholder);
            }}
          />
        </div>
      </motion.div>

      {/* Attribution */}
      <motion.p
        className="text-muted-foreground text-center text-sm md:text-base mt-3 mb-4 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        from <span className="font-serif italic">"{flower.artwork}"</span> by {flower.artist}, {flower.year}
      </motion.p>

      <motion.div className="w-16 h-px bg-border mb-4" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.5 }} />

      {/* Description */}
      <motion.p
        className="text-foreground/80 text-center text-base md:text-lg leading-relaxed mb-6 font-sans max-w-xl"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {flower.description}
      </motion.p>

      {/* Healing message */}
      <motion.div
        className="w-full max-w-xl rounded-2xl p-6 md:p-8 mb-10"
        style={{ backgroundColor: `hsl(${flower.color} / 0.08)` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <p className="font-serif italic text-sm text-muted-foreground mb-3">Why this flower is for you</p>
        <p className="text-foreground text-base md:text-lg leading-relaxed font-sans">{flower.healingMessage}</p>
      </motion.div>

      {/* Reset */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.5 }}>
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-full px-6 py-5 text-sm font-sans gap-2 border-border/60 hover:bg-card transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" />
          Share another feeling
        </Button>
      </motion.div>

      {/* Detail modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="w-full">
            <img
              src={sourceSrc}
              alt={`${flower.artwork} by ${flower.artist} — full painting`}
              className="w-full h-auto block rounded-t-lg"
            />
          </div>
          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl md:text-2xl">
                {flower.artist} — <span className="italic">{flower.artwork}</span> ({flower.year})
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed mt-4">
                {flower.description}
              </DialogDescription>
            </DialogHeader>
            {flower.sourceUrl && (
              <a
                href={flower.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-muted-foreground/60 hover:text-muted-foreground mt-4 underline underline-offset-2"
              >
                Source: Wikimedia Commons
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FlowerResult;
