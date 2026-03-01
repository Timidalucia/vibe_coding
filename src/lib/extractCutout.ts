/**
 * Runtime flower crop extraction from source paintings.
 * Crops a rectangular region and applies subtle edge feathering —
 * NO circular/ellipse mask. The result is a large rectangular cutout.
 */

const cache = new Map<string, string>();

export interface CutoutRegion {
  /** Crop rectangle as fractions of image dimensions (0–1) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Kept for compatibility but ignored — always rectangular now */
  mask?: string;
  rotation?: number;
}

/**
 * Extract a rectangular flower crop from a painting image at runtime.
 * Returns a PNG dataURL — rectangular, no circle mask.
 */
export function extractCutout(
  paintingSrc: string,
  region: CutoutRegion,
  outputSize = 480
): Promise<string> {
  const cacheKey = `${paintingSrc}:${JSON.stringify(region)}`;
  if (cache.has(cacheKey)) {
    return Promise.resolve(cache.get(cacheKey)!);
  }

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

        // Output canvas — maintain aspect ratio
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

        // Draw cropped region — full rectangle, no clip mask
        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, outW, outH);

        // Subtle rectangular edge feathering (inset box shadow effect)
        const feather = Math.min(outW, outH) * 0.08;
        const edgeCanvas = document.createElement("canvas");
        edgeCanvas.width = outW;
        edgeCanvas.height = outH;
        const edgeCtx = edgeCanvas.getContext("2d")!;

        // Fill opaque center, transparent edges
        edgeCtx.fillStyle = "#000";
        edgeCtx.fillRect(0, 0, outW, outH);

        // Feather all 4 edges with linear gradients
        const sides = [
          { x0: 0, y0: 0, x1: feather, y1: 0, rect: [0, 0, feather, outH] },
          { x0: outW, y0: 0, x1: outW - feather, y1: 0, rect: [outW - feather, 0, feather, outH] },
          { x0: 0, y0: 0, x1: 0, y1: feather, rect: [0, 0, outW, feather] },
          { x0: 0, y0: outH, x1: 0, y1: outH - feather, rect: [0, outH - feather, outW, feather] },
        ] as const;

        edgeCtx.globalCompositeOperation = "destination-in";
        for (const s of sides) {
          const g = edgeCtx.createLinearGradient(s.x0, s.y0, s.x1, s.y1);
          g.addColorStop(0, "rgba(0,0,0,0)");
          g.addColorStop(1, "rgba(0,0,0,1)");
          edgeCtx.fillStyle = g;
          edgeCtx.fillRect(s.rect[0], s.rect[1], s.rect[2], s.rect[3]);
        }

        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(edgeCanvas, 0, 0);

        const dataUrl = canvas.toDataURL("image/png");
        cache.set(cacheKey, dataUrl);
        resolve(dataUrl);
      } catch (err) {
        console.warn("[extractCutout] Failed:", err);
        resolve("");
      }
    };

    img.onerror = () => {
      console.warn("[extractCutout] Image load failed");
      resolve("");
    };

    img.src = paintingSrc;
  });
}
