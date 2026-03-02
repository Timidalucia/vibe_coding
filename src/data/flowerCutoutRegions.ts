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
  chrysanthemum: {
    x: 0.15, y: 0.02, w: 0.60, h: 0.62,
  },
  peony: {
    x: 0.20, y: 0.10, w: 0.55, h: 0.50,
  },
  anemone: {
    x: 0.15, y: 0.10, w: 0.65, h: 0.60,
  },
  oleander: {
    x: 0.10, y: 0.05, w: 0.55, h: 0.65,
  },
  dahlia: {
    x: 0.20, y: 0.10, w: 0.55, h: 0.60,
  },
  carnation: {
    x: 0.15, y: 0.05, w: 0.60, h: 0.65,
  },
  wisteria: {
    x: 0.20, y: 0.10, w: 0.55, h: 0.60,
  },
  lilac: {
    x: 0.15, y: 0.05, w: 0.65, h: 0.65,
  },
  magnolia: {
    x: 0.20, y: 0.10, w: 0.55, h: 0.55,
  },
  violet: {
    x: 0.15, y: 0.10, w: 0.65, h: 0.60,
  },
  tulip: {
    x: 0.15, y: 0.10, w: 0.65, h: 0.60,
  },
  daisy: {
    x: 0.15, y: 0.05, w: 0.60, h: 0.65,
  },
  "redon-bouquet": {
    x: 0.15, y: 0.05, w: 0.65, h: 0.65,
  },
  "ruysch-bouquet": {
    x: 0.15, y: 0.05, w: 0.65, h: 0.65,
  },
  "bosschaert-tulip": {
    x: 0.15, y: 0.05, w: 0.65, h: 0.65,
  },
  "carnation-lily-rose": {
    x: 0.20, y: 0.10, w: 0.55, h: 0.60,
  },
};
