import { CutoutRegion } from "@/lib/extractCutout";

/**
 * Crop rectangles targeting a SINGLE largest flower + stem.
 * Coordinates are fractions (0–1) of the source painting dimensions.
 */
export const flowerCutoutRegions: Record<string, CutoutRegion> = {
  // Van Gogh Sunflowers — large central sunflower
  sunflower: {
    x: 0.30, y: 0.05, w: 0.30, h: 0.45,
  },
  // Monet Water Lilies — single lily center-right
  "water-lily": {
    x: 0.40, y: 0.30, w: 0.25, h: 0.35,
  },
  // Van Gogh Irises — one tall iris left of center
  iris: {
    x: 0.30, y: 0.05, w: 0.20, h: 0.55,
  },
  // O'Keeffe Oriental Poppies — left poppy (larger)
  "red-poppy": {
    x: 0.05, y: 0.10, w: 0.45, h: 0.80,
  },
  // Van Gogh Almond Blossom — one branch cluster center
  "almond-blossom": {
    x: 0.30, y: 0.15, w: 0.30, h: 0.40,
  },
  // Renoir Roses — central large rose
  rose: {
    x: 0.28, y: 0.15, w: 0.35, h: 0.40,
  },
  // Renoir Chrysanthemums — one large bloom upper-center
  chrysanthemum: {
    x: 0.25, y: 0.05, w: 0.35, h: 0.40,
  },
  // Manet Bouquet of Peonies — largest peony center-top
  peony: {
    x: 0.25, y: 0.08, w: 0.40, h: 0.40,
  },
  // Renoir Anemones — one red anemone center
  anemone: {
    x: 0.25, y: 0.15, w: 0.35, h: 0.40,
  },
  // Van Gogh Oleanders — one flower cluster top-center
  oleander: {
    x: 0.25, y: 0.05, w: 0.30, h: 0.40,
  },
  // Cézanne Dahlias — one dahlia upper area
  dahlia: {
    x: 0.30, y: 0.08, w: 0.30, h: 0.38,
  },
  // Van Gogh Vase with Carnations — one carnation top-center
  carnation: {
    x: 0.30, y: 0.05, w: 0.28, h: 0.38,
  },
  // Monet Wisteria — one hanging cluster center
  wisteria: {
    x: 0.30, y: 0.15, w: 0.30, h: 0.45,
  },
  // Manet Lilacs — one branch center
  lilac: {
    x: 0.25, y: 0.08, w: 0.35, h: 0.45,
  },
  // Heade Giant Magnolias — the larger magnolia (left)
  magnolia: {
    x: 0.10, y: 0.15, w: 0.40, h: 0.50,
  },
  // Manet Bouquet of Violets — single cluster center
  violet: {
    x: 0.25, y: 0.15, w: 0.35, h: 0.40,
  },
  // Monet Tulip Fields — one foreground tulip area
  tulip: {
    x: 0.30, y: 0.40, w: 0.25, h: 0.35,
  },
  // Van Gogh Vase with Daisies — one large daisy top-center
  daisy: {
    x: 0.30, y: 0.05, w: 0.28, h: 0.38,
  },
  // Redon Vase of Flowers — one prominent bloom upper-center
  "redon-bouquet": {
    x: 0.30, y: 0.08, w: 0.30, h: 0.38,
  },
  // Ruysch Flowers in a Vase — one large bloom top-center
  "ruysch-bouquet": {
    x: 0.25, y: 0.05, w: 0.35, h: 0.35,
  },
  // Bosschaert Flower Still Life — one tulip top-center
  "bosschaert-tulip": {
    x: 0.30, y: 0.03, w: 0.25, h: 0.35,
  },
  // Sargent Carnation Lily Lily Rose — one lily center
  "carnation-lily-rose": {
    x: 0.35, y: 0.25, w: 0.25, h: 0.35,
  },
};
