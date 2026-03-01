import { useState } from "react";
import { motion } from "framer-motion";
import { ArtFlower } from "@/data/artFlowers";
import { artworkImages, artworkSourceImages, artworkStickerImages } from "@/data/artworkImages";
import paperTexture from "@/assets/paper-texture.jpg";
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

  const stickerSrc = artworkStickerImages[flower.id];
  const sourceSrc = artworkSourceImages[flower.id];
  const artworkSrc = artworkImages[flower.id];

  // If this flower has a sticker, use the new interactive layout
  const hasSticker = !!stickerSrc && !!sourceSrc;

  if (!hasSticker) {
    // Fallback: original collage-based layout for flowers without stickers
    return <FallbackFlowerResult flower={flower} onReset={onReset} artworkSrc={artworkSrc} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 md:px-6"
    >
      {/* Interactive sticker area */}
      <motion.div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden cursor-pointer"
        style={{ aspectRatio: "1 / 1" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
        {/* Paper texture background */}
        <img
          src={paperTexture}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Original painting (revealed on hover) */}
        <img
          src={sourceSrc}
          alt={`${flower.artwork} by ${flower.artist}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          style={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Sticker cut-out */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img
            src={stickerSrc}
            alt={`${flower.name} — cut-out from ${flower.artwork}`}
            className="max-w-[80%] max-h-[80%] object-contain transition-opacity duration-300 ease-in-out drop-shadow-lg"
            style={{
              opacity: isHovered ? 0.15 : 1,
              filter: isHovered
                ? "drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
                : "drop-shadow(0 6px 20px rgba(0,0,0,0.18))",
              /* Cream contour via SVG filter trick — using outline via paint */
              WebkitFilter: isHovered
                ? "drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
                : "drop-shadow(0 0 3px rgba(255,253,245,1)) drop-shadow(0 0 3px rgba(255,253,245,1)) drop-shadow(0 0 3px rgba(255,253,245,1)) drop-shadow(0 6px 20px rgba(0,0,0,0.18))",
            }}
          />
        </div>
      </motion.div>

      {/* Artwork attribution (below sticker) */}
      <motion.p
        className="text-muted-foreground text-center text-sm md:text-base mt-6 mb-8 font-sans"
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
                {flower.artist} — {flower.artwork} ({flower.year})
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed mt-4">
                {flower.id === "almond-blossom"
                  ? "Vincent van Gogh painted Almond Blossom in February 1890 to celebrate the birth of his nephew, named after him. The delicate white blossoms against a serene blue sky symbolize new life and hope. The painting is part of the permanent collection at the Van Gogh Museum in Amsterdam."
                  : flower.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Source:{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Wikimedia Commons
                </a>
                {" · "}
                <a
                  href="https://www.vangoghmuseum.nl/en/collection/s0176V1962"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Van Gogh Museum, Amsterdam
                </a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

/** Fallback layout for flowers that don't have sticker assets yet */
const FallbackFlowerResult = ({
  flower,
  onReset,
  artworkSrc,
}: {
  flower: ArtFlower;
  onReset: () => void;
  artworkSrc: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 md:px-6"
  >
    <motion.div
      className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl mb-10"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <img src={artworkSrc} alt={`${flower.artwork} by ${flower.artist}`} className="w-full h-auto block" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 30%, rgba(0,0,0,0.35) 100%)" }}
      />
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

    <motion.p
      className="text-muted-foreground text-center text-sm md:text-base mb-8 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      from <span className="font-serif italic">"{flower.artwork}"</span> by {flower.artist}, {flower.year}
    </motion.p>

    <motion.div className="w-16 h-px bg-border mb-8" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.5 }} />

    <motion.p
      className="text-foreground/80 text-center text-base md:text-lg leading-relaxed mb-6 font-sans max-w-xl"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {flower.description}
    </motion.p>

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
  </motion.div>
);

export default FlowerResult;
