import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkSourceImages, artworkCutoutImages } from "@/data/artworkImages";
import { extractCutout } from "@/lib/extractCutout";
import { flowerCutoutRegions } from "@/data/flowerCutoutRegions";

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
}

const FlowerResult = ({ flower, onReset }: FlowerResultProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cutoutSrc, setCutoutSrc] = useState<string>("");
  const [cutoutReady, setCutoutReady] = useState(false);
  const [modalWidth, setModalWidth] = useState<number | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sourceSrc = artworkSourceImages[flower.id];
  const region = flowerCutoutRegions[flower.id];
  const premadeCutout = artworkCutoutImages[flower.id];

  useEffect(() => {
    setCutoutSrc("");
    setCutoutReady(false);

    // Prefer pre-made cutout if available
    if (premadeCutout) {
      setCutoutSrc(premadeCutout);
      setCutoutReady(true);
      return;
    }

    // Fall back to runtime segmentation
    if (sourceSrc && region) {
      extractCutout(sourceSrc, region, 600).then((url) => {
        if (url) {
          setCutoutSrc(url);
          setCutoutReady(true);
        }
      });
    }
  }, [sourceSrc, region, premadeCutout]);

  const handleEnter = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsHovered(true), 80);
  }, []);

  const handleLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsHovered(false), 80);
  }, []);

  useEffect(() => {
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full max-w-[760px] mx-auto px-4"
    >
      {/* FlowerStage — fixed height, two layers always in DOM */}
      <div
        className="relative w-full overflow-hidden rounded-2xl cursor-pointer h-[260px] md:h-[340px]"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={() => setIsModalOpen(true)}
        tabIndex={0}
        role="button"
        aria-label={`View ${flower.artwork} by ${flower.artist}`}
      >
        {/* Layer 1 (back): Full painting — always in DOM, pointer-events:none */}
        <img
          src={sourceSrc}
          alt={`${flower.artwork} by ${flower.artist}`}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-[400ms] ease-in-out motion-reduce:transition-none"
          style={{ opacity: isHovered ? 1 : 0, pointerEvents: "none" }}
        />

        {/* Layer 2 (front): Flower cutout — always in DOM */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-[400ms] ease-in-out motion-reduce:transition-none"
          style={{ opacity: isHovered ? 0.1 : 1 }}
        >
          {cutoutReady ? (
            <img
              src={cutoutSrc}
              alt={`${flower.name} — from ${flower.artwork}`}
              className="object-contain"
              style={{
                maxHeight: "85%",
                maxWidth: "90%",
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18)) drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
              }}
            />
          ) : (
            /* Loading: show blurred painting crop as placeholder */
            <img
              src={sourceSrc}
              alt={`${flower.name} loading`}
              className="w-full h-full object-cover blur-sm opacity-50"
            />
          )}
        </div>
      </div>

      {/* Attribution */}
      <motion.p
        className="text-muted-foreground text-center text-sm mt-3 mb-2 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        from <span className="font-serif italic">"{flower.artwork}"</span> by{" "}
        {flower.artist}, {flower.year}
      </motion.p>

      <motion.div
        className="w-12 h-px bg-border mb-3"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />

      {/* Description */}
      <motion.p
        className="text-foreground/80 text-center text-sm md:text-base leading-relaxed mb-4 font-sans max-w-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {flower.description}
      </motion.p>

      {/* Healing message */}
      <motion.div
        className="w-full max-w-lg rounded-2xl p-4 md:p-5 mb-5"
        style={{ backgroundColor: `hsl(${flower.color} / 0.08)` }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="font-serif italic text-xs text-muted-foreground mb-2">
          Why this flower is for you
        </p>
        <p className="text-foreground text-sm md:text-base leading-relaxed font-sans">
          {flower.healingMessage}
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

      {/* Detail modal — aspect-ratio-aware width */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
              src={sourceSrc}
              alt={`${flower.artwork} by ${flower.artist} — full painting`}
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
                {flower.artist} —{" "}
                <span className="italic">{flower.artwork}</span> ({flower.year})
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed mt-2 line-clamp-3">
                {flower.description}
              </DialogDescription>
            </DialogHeader>
            {flower.sourceUrl && (
              <a
                href={flower.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-muted-foreground/60 hover:text-muted-foreground mt-2 underline underline-offset-2"
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
