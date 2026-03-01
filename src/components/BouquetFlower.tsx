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

const positions = [
  { rotate: -18, translateX: -110, translateY: 5 },   // left
  { rotate: 0, translateX: 0, translateY: -25 },       // center (tallest)
  { rotate: 18, translateX: 110, translateY: 5 },      // right
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
        bottom: "45%",
        zIndex: index === 1 ? 3 : 2,
      }}
      initial={{
        x: pos.translateX,
        y: pos.translateY,
        rotate: pos.rotate,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        x: pos.translateX,
        y: isHovered ? pos.translateY - 30 : pos.translateY,
        rotate: pos.rotate,
        opacity: 1,
        scale: isHovered ? 1.08 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        opacity: { duration: 0.5, delay: index * 0.15 },
        scale: { duration: 0.3 },
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${flower.name} from ${flower.artwork}`}
    >
      <div
        className="relative w-[130px] h-[170px] md:w-[160px] md:h-[210px] flex items-end justify-center"
        style={{ transformOrigin: "bottom center" }}
      >
        {cutoutReady ? (
          <img
            src={cutoutSrc}
            alt={`${flower.name} — from ${flower.artwork}`}
            className="object-contain max-w-full max-h-full drop-shadow-lg"
          />
        ) : (
          <div className="w-16 h-20 rounded-full bg-muted animate-pulse" />
        )}
      </div>
    </motion.div>
  );
};

export default BouquetFlower;
