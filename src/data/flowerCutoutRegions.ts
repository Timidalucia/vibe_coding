import { CutoutRegion } from "@/lib/extractCutout";

/**
 * Crop rectangles for each flower — the segmentation algorithm
 * handles the actual silhouette extraction from these regions.
 * Coordinates are fractions (0–1) of the source painting dimensions.
 */
export const flowerCutoutRegions: Record<string, CutoutRegion> = {
  sunflower: {
    x: 0.25, y: 0.00, w: 0.45, h: 0.65,
  },
  "water-lily": {
    x: 0.30, y: 0.20, w: 0.45, h: 0.55,
  },
  iris: {
    x: 0.25, y: 0.05, w: 0.35, h: 0.70,
  },
  "red-poppy": {
    x: 0.05, y: 0.05, w: 0.50, h: 0.88,
  },
  "almond-blossom": {
    x: 0.20, y: 0.12, w: 0.48, h: 0.58,
  },
  rose: {
    x: 0.24, y: 0.10, w: 0.48, h: 0.62,
  },
  oleander: {
    x: 0.10, y: 0.05, w: 0.80, h: 0.85,
  },
  peony: {
    x: 0.15, y: 0.05, w: 0.70, h: 0.55,
  },
  anemone: {
    x: 0.18, y: 0.06, w: 0.55, h: 0.68,
  },
  lilac: {
    x: 0.15, y: 0.05, w: 0.65, h: 0.80,
  },
  tulip: {
    x: 0.15, y: 0.05, w: 0.60, h: 0.85,
  },
  wildflower: {
    x: 0.10, y: 0.05, w: 0.70, h: 0.75,
  },
  "golden-bouquet": {
    x: 0.15, y: 0.05, w: 0.70, h: 0.85,
  },
  daisy: {
    x: 0.15, y: 0.02, w: 0.65, h: 0.90,
  },
  carnation: {
    x: 0.15, y: 0.02, w: 0.65, h: 0.90,
  },
};
