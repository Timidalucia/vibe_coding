import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkSourceImages } from "@/data/artworkImages";
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

  const sourceSrc = artworkSourceImages[flower.id];
  const region = flowerCutoutRegions[flower.id];

  useEffect(() => {
    if (sourceSrc && region) {
      extractCutout(sourceSrc, region, 480).then((url) => {
        if (url) setCutoutSrc(url);
      });
    }
  }, [sourceSrc, region]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 md:px-6"
    >
      {/* PreviewReveal — collapsible painting container */}
      <div
        className="relative w-full max-w-xs md:max-w-sm mx-auto overflow-hidden rounded-2xl transition-[height] duration-[400ms] ease-in-out motion-reduce:transition-none"
        style={{
          height: isHovered
            ? "clamp(320px, 45vw, 480px)"
            : "clamp(100px, 15vw, 160px)",
        }}
      >
        <img
          src={sourceSrc}
          alt={`${flower.artwork} by ${flower.artist}`}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-[350ms] ease-in-out motion-reduce:transition-none"
          style={{ opacity: isHovered ? 1 : 0, pointerEvents: "none" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Flower cutout — derived from the same painting at runtime */}
      <div
        className="relative z-10 -mt-16 md:-mt-20 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        {cutoutSrc ? (
          <motion.img
            src={cutoutSrc}
            alt={`${flower.name} — extracted from ${flower.artwork}`}
            className="w-24 h-28 md:w-32 md:h-40 object-contain transition-opacity duration-[350ms] ease-in-out motion-reduce:transition-none"
            style={{ opacity: isHovered ? 0.15 : 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isHovered ? 0.15 : 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="w-24 h-28 md:w-32 md:h-40 bg-muted/30 rounded-full" />
        )}
      </div>

      {/* Attribution */}
      <motion.p
        className="text-muted-foreground text-center text-sm mt-3 mb-2 font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        from <span className="font-serif italic">"{flower.artwork}"</span> by{" "}
        {flower.artist}, {flower.year}
      </motion.p>

      <motion.div
        className="w-12 h-px bg-border mb-3"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      />

      {/* Description */}
      <motion.p
        className="text-foreground/80 text-center text-sm md:text-base leading-relaxed mb-4 font-sans max-w-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {flower.description}
      </motion.p>

      {/* Healing message */}
      <motion.div
        className="w-full max-w-lg rounded-2xl p-4 md:p-6 mb-6"
        style={{ backgroundColor: `hsl(${flower.color} / 0.08)` }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
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
        transition={{ delay: 1.2, duration: 0.4 }}
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
                {flower.artist} —{" "}
                <span className="italic">{flower.artwork}</span> ({flower.year})
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
