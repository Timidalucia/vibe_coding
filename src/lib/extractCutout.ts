/**
 * Runtime flower crop from source paintings.
 * Crops a rectangular region — NO circular mask.
 * Subtle edge feathering only (thin border fade).
 */

const cache = new Map<string, string>();

export interface CutoutRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  mask?: string;
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

        // Draw the cropped region — full rectangle, no clipping
        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, outW, outH);

        // Very subtle edge fade (only outermost 5% of each edge)
        const feather = Math.min(outW, outH) * 0.05;
        if (feather > 2) {
          const edgeCanvas = document.createElement("canvas");
          edgeCanvas.width = outW;
          edgeCanvas.height = outH;
          const ec = edgeCanvas.getContext("2d")!;

          // Start fully opaque
          ec.fillStyle = "#000";
          ec.fillRect(0, 0, outW, outH);

          // Fade each edge
          ec.globalCompositeOperation = "destination-out";
          const edges = [
            { x0: 0, y0: 0, x1: feather, y1: 0, r: [0, 0, feather, outH] },
            { x0: outW, y0: 0, x1: outW - feather, y1: 0, r: [outW - feather, 0, feather, outH] },
            { x0: 0, y0: 0, x1: 0, y1: feather, r: [0, 0, outW, feather] },
            { x0: 0, y0: outH, x1: 0, y1: outH - feather, r: [0, outH - feather, outW, feather] },
          ] as const;

          for (const e of edges) {
            const g = ec.createLinearGradient(e.x0, e.y0, e.x1, e.y1);
            g.addColorStop(0, "rgba(0,0,0,1)");
            g.addColorStop(1, "rgba(0,0,0,0)");
            ec.fillStyle = g;
            ec.fillRect(e.r[0], e.r[1], e.r[2], e.r[3]);
          }

          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(edgeCanvas, 0, 0);
        }

        const dataUrl = canvas.toDataURL("image/png");
        cache.set(cacheKey, dataUrl);
        console.log("[extractCutout] Success:", outW, "x", outH);
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
