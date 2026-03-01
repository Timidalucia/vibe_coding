import { CutoutRegion } from "@/lib/extractCutout";

/**
 * Paddle / hand-mirror silhouette mask.
 * Wide rounded top (the "head") tapering to a narrow handle (the "stem").
 * Points are fractional (0–1) of the crop rectangle.
 */
const paddleMask: [number, number][] = [
  // Top center
  [0.50, 0.00],
  [0.58, 0.005],
  [0.66, 0.02],
  [0.73, 0.04],
  [0.79, 0.07],
  [0.84, 0.11],
  [0.89, 0.16],
  [0.93, 0.22],
  [0.96, 0.28],
  [0.98, 0.34],
  [0.99, 0.40],
  [1.00, 0.46],
  // Right bulge widest
  [0.99, 0.52],
  [0.98, 0.56],
  [0.96, 0.60],
  [0.93, 0.64],
  [0.89, 0.67],
  [0.84, 0.70],
  [0.78, 0.72],
  [0.72, 0.73],
  [0.66, 0.74],
  // Taper into handle — right side
  [0.62, 0.75],
  [0.59, 0.77],
  [0.57, 0.79],
  [0.56, 0.82],
  [0.555, 0.86],
  [0.55, 0.90],
  [0.55, 0.94],
  [0.55, 1.00],
  // Handle bottom left
  [0.45, 1.00],
  [0.45, 0.94],
  [0.45, 0.90],
  [0.445, 0.86],
  [0.44, 0.82],
  [0.43, 0.79],
  [0.41, 0.77],
  [0.38, 0.75],
  // Taper from handle — left side
  [0.34, 0.74],
  [0.28, 0.73],
  [0.22, 0.72],
  [0.16, 0.70],
  [0.11, 0.67],
  [0.07, 0.64],
  [0.04, 0.60],
  [0.02, 0.56],
  [0.01, 0.52],
  [0.00, 0.46],
  // Left bulge back up
  [0.01, 0.40],
  [0.02, 0.34],
  [0.04, 0.28],
  [0.07, 0.22],
  [0.11, 0.16],
  [0.16, 0.11],
  [0.21, 0.07],
  [0.27, 0.04],
  [0.34, 0.02],
  [0.42, 0.005],
];

export const flowerCutoutRegions: Record<string, CutoutRegion> = {
  sunflower: {
    x: 0.28, y: 0.01, w: 0.42, h: 0.62,
    polygon: paddleMask,
  },
  "water-lily": {
    x: 0.35, y: 0.25, w: 0.38, h: 0.50,
    polygon: paddleMask,
  },
  iris: {
    x: 0.28, y: 0.08, w: 0.30, h: 0.65,
    polygon: paddleMask,
  },
  "red-poppy": {
    x: 0.05, y: 0.06, w: 0.50, h: 0.88,
    polygon: paddleMask,
  },
  "almond-blossom": {
    x: 0.22, y: 0.15, w: 0.44, h: 0.55,
    polygon: paddleMask,
  },
  rose: {
    x: 0.26, y: 0.12, w: 0.44, h: 0.58,
    polygon: paddleMask,
  },
  chrysanthemum: {
    x: 0.18, y: 0.03, w: 0.58, h: 0.60,
    polygon: paddleMask,
  },
  lotus: {
    x: 0.22, y: 0.03, w: 0.44, h: 0.60,
    polygon: paddleMask,
  },
  anemone: {
    x: 0.20, y: 0.08, w: 0.52, h: 0.65,
    polygon: paddleMask,
  },
};
