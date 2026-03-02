import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkSourceImages, artworkCutoutImages, artworkStickerImages } from "@/data/artworkImages";
import { removeStickerBackground } from "@/lib/removeStickerBackground";
import { extractCutout } from "@/lib/extractCutout";
import { flowerCutoutRegions } from "@/data/flowerCutoutRegions";

interface BouquetFlowerProps {
  flower: ArtFlower;
  index: number;
  onClick: () => void;
}

/* Tightly clustered — overlapping, emerging from wrap opening */
const positions = [
  { rotate: -18, x: -55, y: -10, z: 2 },   // left, tilted out
  { rotate: 4,   x: 0,   y: -30, z: 3 },   // center, tallest
  { rotate: 15,  x: 45,  y: -5,  z: 1 },   // right, tilted out
];

const BouquetFlower = ({ flower, index, onClick }: BouquetFlowerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cutoutSrc, setCutoutSrc] = useState<string>("");
  const [cutoutReady, setCutoutReady] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sourceSrc = artworkSourceImages[flower.id];
  const region = flowerCutoutRegions[flower.id];
  const premadeCutout = artworkCutoutImages[flower.id] || artworkStickerImages[flower.id];

  useEffect(() => {
    setCutoutSrc("");
    setCutoutReady(false);

    if (premadeCutout) {
      removeStickerBackground(premadeCutout).then((url) => {
        setCutoutSrc(url || premadeCutout);
        setCutoutReady(true);
      });
      return;
    }

    const stickerSrc = artworkStickerImages[flower.id];
    if (stickerSrc) {
      removeStickerBackground(stickerSrc).then((url) => {
        if (url) { setCutoutSrc(url); setCutoutReady(true); }
      });
      return;
    }

    if (sourceSrc && region) {
      extractCutout(sourceSrc, region, 400).then((url) => {
        if (url) { setCutoutSrc(url); setCutoutReady(true); }
      });
    }
  }, [sourceSrc, region, premadeCutout, flower.id]);

  const handleEnter = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsHovered(true), 60);
  }, []);

  const handleLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsHovered(false), 60);
  }, []);

  useEffect(() => {
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  }, []);

  const pos = positions[index] || positions[1];

  return (
    <motion.div
      className="absolute cursor-pointer flex flex-col items-center"
      style={{
        left: "50%",
        top: "28%",
        zIndex: isHovered ? 10 : pos.z,
        transformOrigin: "bottom center",
      }}
      initial={{
        x: pos.x,
        y: pos.y,
        rotate: pos.rotate,
        opacity: 0,
        scale: 0.85,
      }}
      animate={{
        x: pos.x,
        y: isHovered ? pos.y - 14 : pos.y,
        rotate: pos.rotate,
        opacity: 1,
        scale: isHovered ? 1.08 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        opacity: { duration: 0.5, delay: 0.2 + index * 0.12 },
        scale: { duration: 0.25 },
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${flower.name} from ${flower.artwork}`}
    >
      {/* Flower image */}
      <div className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] flex items-center justify-center">
        {cutoutReady ? (
          <img
            src={cutoutSrc}
            alt={`${flower.name} — from ${flower.artwork}`}
            className="w-full h-full object-contain"
            style={{
              filter: "drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 2px 0 white) drop-shadow(0 -2px 0 white) drop-shadow(0 4px 10px rgba(0,0,0,0.13))",
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-muted animate-pulse" />
        )}
      </div>

      {/* Name label below */}
      <motion.span
        className="font-serif italic text-muted-foreground text-[11px] md:text-xs mt-1 whitespace-nowrap"
        style={{ transform: `rotate(${-pos.rotate}deg)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 + index * 0.15, duration: 0.4 }}
      >
        {flower.name}
      </motion.span>
    </motion.div>
  );
};

export default BouquetFlower;
