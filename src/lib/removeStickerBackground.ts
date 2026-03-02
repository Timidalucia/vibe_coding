/**
 * Deterministic client-side paper-background removal for sticker PNGs.
 *
 * Pipeline:
 * 1. Load sticker image into an offscreen canvas
 * 2. Sample "paper" background color from corner patches
 * 3. Per-pixel: compute color distance to background
 * 4. Soft threshold: near bg → transparent, far → opaque, band in between
 * 5. Cache result as dataURL
 */

const processedCache = new Map<string, string>();

/* ── helpers ── */

/** Sample average color from a square patch */
function samplePatch(
  data: Uint8ClampedArray,
  w: number,
  startX: number,
  startY: number,
  size: number
): [number, number, number] {
  let r = 0, g = 0, b = 0, count = 0;
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      const x = startX + dx;
      const y = startY + dy;
      const i = (y * w + x) * 4;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  return [r / count, g / count, b / count];
}

/** Sample background color by averaging corner patches */
function sampleCornerBackground(
  data: Uint8ClampedArray,
  w: number,
  h: number
): [number, number, number] {
  const patchSize = Math.max(4, Math.min(12, Math.floor(Math.min(w, h) * 0.04)));
  const margin = 2; // offset from absolute edge

  const corners = [
    samplePatch(data, w, margin, margin, patchSize),                             // top-left
    samplePatch(data, w, w - margin - patchSize, margin, patchSize),             // top-right
    samplePatch(data, w, margin, h - margin - patchSize, patchSize),             // bottom-left
    samplePatch(data, w, w - margin - patchSize, h - margin - patchSize, patchSize), // bottom-right
  ];

  const r = corners.reduce((s, c) => s + c[0], 0) / 4;
  const g = corners.reduce((s, c) => s + c[1], 0) / 4;
  const b = corners.reduce((s, c) => s + c[2], 0) / 4;

  return [r, g, b];
}

function colorDistance(
  r: number, g: number, b: number,
  br: number, bg: number, bb: number
): number {
  const dr = r - br, dg = g - bg, db = b - bb;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/* ── main export ── */

export function removeStickerBackground(src: string): Promise<string> {
  if (processedCache.has(src)) {
    return Promise.resolve(processedCache.get(src)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, w, h);
        const { data } = imageData;

        // Step 1: Sample paper background from corners
        const [bgR, bgG, bgB] = sampleCornerBackground(data, w, h);

        // Step 2: Per-pixel background removal with soft threshold
        const LOW = 18;   // below this distance → fully transparent
        const HIGH = 38;  // above this distance → fully opaque

        for (let i = 0; i < w * h; i++) {
          const pi = i * 4;
          const r = data[pi], g = data[pi + 1], b = data[pi + 2];
          const dist = colorDistance(r, g, b, bgR, bgG, bgB);

          if (dist < LOW) {
            data[pi + 3] = 0; // fully transparent
          } else if (dist < HIGH) {
            // feathering band — smooth transition
            const alpha = Math.round(255 * ((dist - LOW) / (HIGH - LOW)));
            data[pi + 3] = Math.min(data[pi + 3], alpha);
          }
          // else: keep original alpha
        }

        ctx.putImageData(imageData, 0, 0);
        const result = canvas.toDataURL("image/png");
        processedCache.set(src, result);
        resolve(result);
      } catch (err) {
        console.warn("[removeStickerBackground] Processing failed, using original:", err);
        resolve(src);
      }
    };

    img.onerror = () => {
      console.warn("[removeStickerBackground] Load failed for", src);
      resolve(src);
    };

    img.src = src;
  });
}
