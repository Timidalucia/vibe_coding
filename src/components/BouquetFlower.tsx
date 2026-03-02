import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkSourceImages, artworkCutoutImages, artworkStickerImages } from "@/data/artworkImages";
import { removeStickerBackground } from "@/lib/removeStickerBackground";
import { extractCutout } from "@/lib/extractCutout";
import { flowerCutoutRegions } from "@/data/flowerCutoutRegions";

interface BouquetFlowerProps {
  flower: ArtFlower;
  index: number; // 0=left, 1=center, 2=right
  onClick: () => void;
}

/* Vase arrangement: 3 flowers fanned above the vase rim */
const positions = [
  { rotate: -20, originX: -90, originY: 30 },   // left
  { rotate: 0,   originX: 0,   originY: -10 },  // center
  { rotate: 20,  originX: 90,  originY: 30 },   // right
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
        if (url) {
          setCutoutSrc(url);
          setCutoutReady(true);
        }
      });
      return;
    }

    if (sourceSrc && region) {
      extractCutout(sourceSrc, region, 400).then((url) => {
        if (url) {
          setCutoutSrc(url);
          setCutoutReady(true);
        }
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
        bottom: "38%",
        zIndex: index === 1 ? 3 : 2,
        transformOrigin: "bottom center",
      }}
      initial={{
        x: pos.originX,
        y: pos.originY,
        rotate: pos.rotate,
        opacity: 0,
        scale: 0.85,
      }}
      animate={{
        x: pos.originX,
        y: isHovered ? pos.originY - 24 : pos.originY,
        rotate: pos.rotate,
        opacity: 1,
        scale: isHovered ? 1.06 : 1,
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
      {/* Flower image — uniform size */}
      <div
        className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] flex items-center justify-center"
      >
        {cutoutReady ? (
          <img
            src={cutoutSrc}
            alt={`${flower.name} — from ${flower.artwork}`}
            className="drop-shadow-lg"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              /* Scale up small stickers to fill container */
              minWidth: "90%",
              minHeight: "90%",
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
        )}
      </div>

      {/* Name label — counter-rotate so text stays horizontal */}
      <motion.span
        className="font-serif italic text-muted-foreground text-xs md:text-sm mt-1 whitespace-nowrap"
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
