/**
 * Runtime flower cutout extraction from source paintings.
 * Crops a region from the painting and applies an ellipse mask
 * to produce a transparent PNG cutout — no pre-made sticker assets needed.
 */

const cache = new Map<string, string>();

export interface CutoutRegion {
  /** Crop rectangle as fractions of image dimensions (0–1) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Mask type */
  mask: "ellipse" | "rounded-rect";
  /** Optional rotation in degrees */
  rotation?: number;
}

/**
 * Extract a flower cutout from a painting image at runtime.
 * Returns a PNG dataURL with transparent background.
 */
export function extractCutout(
  paintingSrc: string,
  region: CutoutRegion,
  outputSize = 400
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

        // Crop coordinates in pixels
        const cx = Math.round(region.x * srcW);
        const cy = Math.round(region.y * srcH);
        const cw = Math.round(region.w * srcW);
        const ch = Math.round(region.h * srcH);

        // Output canvas — maintain aspect ratio of crop
        const aspect = cw / ch;
        const outW = aspect >= 1 ? outputSize : Math.round(outputSize * aspect);
        const outH = aspect >= 1 ? Math.round(outputSize / aspect) : outputSize;

        const canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext("2d")!;

        // Apply rotation if specified
        if (region.rotation) {
          ctx.translate(outW / 2, outH / 2);
          ctx.rotate((region.rotation * Math.PI) / 180);
          ctx.translate(-outW / 2, -outH / 2);
        }

        // Apply mask shape
        ctx.beginPath();
        if (region.mask === "ellipse") {
          ctx.ellipse(
            outW / 2,
            outH / 2,
            outW / 2 - 2,
            outH / 2 - 2,
            0,
            0,
            Math.PI * 2
          );
        } else {
          // rounded-rect
          const r = Math.min(outW, outH) * 0.12;
          ctx.moveTo(r, 0);
          ctx.lineTo(outW - r, 0);
          ctx.quadraticCurveTo(outW, 0, outW, r);
          ctx.lineTo(outW, outH - r);
          ctx.quadraticCurveTo(outW, outH, outW - r, outH);
          ctx.lineTo(r, outH);
          ctx.quadraticCurveTo(0, outH, 0, outH - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
        }
        ctx.closePath();
        ctx.clip();

        // Draw cropped painting region
        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, outW, outH);

        // Soft edge feathering — draw a radial gradient to soften edges
        const edgeCanvas = document.createElement("canvas");
        edgeCanvas.width = outW;
        edgeCanvas.height = outH;
        const edgeCtx = edgeCanvas.getContext("2d")!;
        
        // Create feather mask
        const gradient = edgeCtx.createRadialGradient(
          outW / 2, outH / 2, Math.min(outW, outH) * 0.35,
          outW / 2, outH / 2, Math.min(outW, outH) * 0.5
        );
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        edgeCtx.fillStyle = gradient;
        edgeCtx.fillRect(0, 0, outW, outH);

        // Apply feather as alpha mask
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
