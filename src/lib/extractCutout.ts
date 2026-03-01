/**
 * Runtime flower cutout from source paintings.
 * Crops a region then applies a POLYGON mask to carve out the flower shape.
 * Result: pixel-exact cutout with real alpha transparency.
 */

const cache = new Map<string, string>();

export interface CutoutRegion {
  /** Crop rectangle as fractions of image dimensions (0–1) */
  x: number;
  y: number;
  w: number;
  h: number;
  /**
   * Polygon mask points as fractions (0–1) of the CROP region.
   * Each point is [fractionalX, fractionalY].
   * If omitted, the full rectangle is used (no mask).
   */
  polygon?: [number, number][];
  /** Optional rotation in degrees */
  rotation?: number;
}

export function extractCutout(
  paintingSrc: string,
  region: CutoutRegion,
  outputSize = 600
): Promise<string> {
  const cacheKey = `${paintingSrc}:${JSON.stringify(region)}`;
  if (cache.has(cacheKey)) return Promise.resolve(cache.get(cacheKey)!);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;

        const cx = Math.round(region.x * srcW);
        const cy = Math.round(region.y * srcH);
        const cw = Math.round(region.w * srcW);
        const ch = Math.round(region.h * srcH);

        const aspect = cw / ch;
        const outW = aspect >= 1 ? outputSize : Math.round(outputSize * aspect);
        const outH = aspect >= 1 ? Math.round(outputSize / aspect) : outputSize;

        const canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext("2d")!;

        if (region.rotation) {
          ctx.translate(outW / 2, outH / 2);
          ctx.rotate((region.rotation * Math.PI) / 180);
          ctx.translate(-outW / 2, -outH / 2);
        }

        // Apply polygon mask if defined
        if (region.polygon && region.polygon.length >= 3) {
          ctx.beginPath();
          const [startX, startY] = region.polygon[0];
          ctx.moveTo(startX * outW, startY * outH);
          for (let i = 1; i < region.polygon.length; i++) {
            const [px, py] = region.polygon[i];
            ctx.lineTo(px * outW, py * outH);
          }
          ctx.closePath();
          ctx.clip();
        }

        // Draw cropped painting region into the (possibly clipped) canvas
        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, outW, outH);

        // Subtle anti-aliased edge softening (1-2px feather on the polygon edge)
        if (region.polygon && region.polygon.length >= 3) {
          const featherCanvas = document.createElement("canvas");
          featherCanvas.width = outW;
          featherCanvas.height = outH;
          const fc = featherCanvas.getContext("2d")!;

          // Draw the polygon slightly inset for soft edges
          fc.beginPath();
          const [sx, sy] = region.polygon[0];
          fc.moveTo(sx * outW, sy * outH);
          for (let i = 1; i < region.polygon.length; i++) {
            const [px, py] = region.polygon[i];
            fc.lineTo(px * outW, py * outH);
          }
          fc.closePath();
          fc.filter = "blur(2px)";
          fc.fillStyle = "#000";
          fc.fill();

          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(featherCanvas, 0, 0);
        }

        const dataUrl = canvas.toDataURL("image/png");
        cache.set(cacheKey, dataUrl);
        resolve(dataUrl);
      } catch (err) {
        console.warn("[extractCutout] Failed:", err);
        resolve("");
      }
    };

    img.onerror = () => {
      console.warn("[extractCutout] Image load failed for", paintingSrc);
      resolve("");
    };

    img.src = paintingSrc;
  });
}
