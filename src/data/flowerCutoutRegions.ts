import { CutoutRegion } from "@/lib/extractCutout";

/**
 * Crop regions for extracting a single flower from each source painting.
 * Coordinates are fractions (0–1) of the source image dimensions.
 * Tuned per painting to capture one prominent flower bud/stem.
 */
export const flowerCutoutRegions: Record<string, CutoutRegion> = {
  sunflower: {
    // Top-center sunflower from Van Gogh's Sunflowers
    x: 0.35,
    y: 0.05,
    w: 0.30,
    h: 0.45,
    mask: "ellipse",
  },
  "water-lily": {
    // Center-right water lily from Monet's Water Lilies
    x: 0.45,
    y: 0.35,
    w: 0.30,
    h: 0.35,
    mask: "ellipse",
  },
  iris: {
    // Central iris from Van Gogh's Irises
    x: 0.30,
    y: 0.15,
    w: 0.25,
    h: 0.55,
    mask: "ellipse",
  },
  "red-poppy": {
    // Left poppy from O'Keeffe's Oriental Poppies
    x: 0.05,
    y: 0.10,
    w: 0.45,
    h: 0.80,
    mask: "ellipse",
  },
  "almond-blossom": {
    // Center blossom cluster from Van Gogh's Almond Blossom
    x: 0.30,
    y: 0.25,
    w: 0.35,
    h: 0.40,
    mask: "ellipse",
  },
  rose: {
    // Central rose from Renoir's Roses
    x: 0.30,
    y: 0.20,
    w: 0.35,
    h: 0.45,
    mask: "ellipse",
  },
  chrysanthemum: {
    // Main chrysanthemum from Qi Baishi
    x: 0.25,
    y: 0.10,
    w: 0.50,
    h: 0.50,
    mask: "ellipse",
  },
  lotus: {
    // Central lotus from Zhang Daqian's Lotus Pond
    x: 0.30,
    y: 0.10,
    w: 0.35,
    h: 0.50,
    mask: "ellipse",
  },
  anemone: {
    // Central anemone from Boncompain
    x: 0.25,
    y: 0.15,
    w: 0.45,
    h: 0.55,
    mask: "ellipse",
  },
};
