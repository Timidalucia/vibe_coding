/**
 * Pixel-level flower extraction from source paintings.
 * Uses color-based foreground segmentation (no AI, no polygon masks).
 *
 * Pipeline:
 * 1. Crop the seed rectangle from the painting
 * 2. Sample background color from edge pixels
 * 3. Compute per-pixel foreground probability via color distance
 * 4. Morphological open/close (via iterative blur approximation)
 * 5. Keep largest connected component near center
 * 6. Feather edges with gaussian blur
 * 7. Apply mask as alpha channel
 */

const cache = new Map<string, string>();

export interface CutoutRegion {
  /** Crop rectangle as fractions of image dimensions (0–1) */
  x: number;
  y: number;
  w: number;
  h: number;
}

/* ───── helpers ───── */

function sampleEdgeBackground(
  data: Uint8ClampedArray,
  w: number,
  h: number
): [number, number, number] {
  // Sample pixels from a 6px border strip on all edges
  const STRIP = Math.max(4, Math.min(8, Math.floor(Math.min(w, h) * 0.03)));
  let rSum = 0, gSum = 0, bSum = 0, count = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isEdge =
        x < STRIP || x >= w - STRIP || y < STRIP || y >= h - STRIP;
      if (!isEdge) continue;
      const i = (y * w + x) * 4;
      rSum += data[i];
      gSum += data[i + 1];
      bSum += data[i + 2];
      count++;
    }
  }

  if (count === 0) return [200, 180, 100];
  return [
    Math.round(rSum / count),
    Math.round(gSum / count),
    Math.round(bSum / count),
  ];
}

function colorDist(
  r: number, g: number, b: number,
  br: number, bg: number, bb: number
): number {
  const dr = r - br, dg = g - bg, db = b - bb;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Build a foreground mask (0–255) based on color distance from background.
 * Also uses saturation boost: vivid flower pixels get higher scores.
 */
function buildForegroundMask(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  bgR: number,
  bgG: number,
  bgB: number
): Uint8Array {
  const mask = new Uint8Array(w * h);

  // Tighter thresholds for cleaner edges (like a hand-cut sticker)
  const LOW = 22;   // below → definitely background
  const HIGH = 50;  // above → definitely foreground

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pi = (y * w + x) * 4;
      const r = data[pi], g = data[pi + 1], b = data[pi + 2];

      const dist = colorDist(r, g, b, bgR, bgG, bgB);

      // Saturation gives a small bonus to vivid pixels
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const boostedDist = dist + sat * 20;

      if (boostedDist < LOW) {
        mask[y * w + x] = 0;
      } else if (boostedDist > HIGH) {
        mask[y * w + x] = 255;
      } else {
        mask[y * w + x] = Math.round(
          255 * ((boostedDist - LOW) / (HIGH - LOW))
        );
      }
    }
  }
  return mask;
}

/**
 * Simple morphological close then open using box blur as approximation.
 * This fills small holes and removes small noise specks.
 */
function morphCleanup(mask: Uint8Array, w: number, h: number, radius: number): void {
  const tmp = new Uint8Array(w * h);

  // Dilate (max filter) — closes gaps
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let maxVal = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
            maxVal = Math.max(maxVal, mask[ny * w + nx]);
          }
        }
      }
      tmp[y * w + x] = maxVal;
    }
  }

  // Erode (min filter) — removes small protrusions
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minVal = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
            minVal = Math.min(minVal, tmp[ny * w + nx]);
          }
        }
      }
      mask[y * w + x] = minVal;
    }
  }
}

/**
 * Keep only the largest connected component whose centroid is near the image center.
 * Uses flood-fill labeling on binarized mask (threshold 128).
 */
function keepLargestComponent(mask: Uint8Array, w: number, h: number): void {
  const labels = new Int32Array(w * h);
  labels.fill(-1);
  let nextLabel = 0;
  const componentSizes: number[] = [];
  const componentCentroids: [number, number][] = [];

  // BFS flood fill
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (mask[idx] < 128 || labels[idx] >= 0) continue;

      const label = nextLabel++;
      const queue: number[] = [idx];
      labels[idx] = label;
      let size = 0, cx = 0, cy = 0;

      while (queue.length > 0) {
        const cur = queue.pop()!;
        const curX = cur % w, curY = (cur - curX) / w;
        size++;
        cx += curX;
        cy += curY;

        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = curX + dx, ny = curY + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const ni = ny * w + nx;
            if (mask[ni] >= 128 && labels[ni] < 0) {
              labels[ni] = label;
              queue.push(ni);
            }
          }
        }
      }

      componentSizes.push(size);
      componentCentroids.push([cx / size, cy / size]);
    }
  }

  if (nextLabel === 0) return;

  // Score each component: prefer large + near center
  const centerX = w / 2, centerY = h / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
  let bestLabel = 0, bestScore = -1;

  for (let i = 0; i < nextLabel; i++) {
    const [ccx, ccy] = componentCentroids[i];
    const distFromCenter = Math.sqrt(
      (ccx - centerX) ** 2 + (ccy - centerY) ** 2
    );
    const proximityScore = 1 - distFromCenter / maxDist;
    const sizeScore = componentSizes[i] / (w * h);
    const score = sizeScore * 0.6 + proximityScore * 0.4;
    if (score > bestScore) {
      bestScore = score;
      bestLabel = i;
    }
  }

  // Zero out everything except the best component
  for (let i = 0; i < w * h; i++) {
    if (labels[i] !== bestLabel) {
      mask[i] = 0;
    }
  }
}

/**
 * Gaussian-ish blur on the mask for soft feathered edges.
 * Uses 3-pass box blur as approximation.
 */
function blurMask(mask: Uint8Array, w: number, h: number, radius: number): void {
  const tmp = new Float32Array(w * h);

  for (let pass = 0; pass < 3; pass++) {
    // Horizontal pass
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0, count = 0;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx >= 0 && nx < w) {
            sum += mask[y * w + nx];
            count++;
          }
        }
        tmp[y * w + x] = sum / count;
      }
    }
    // Vertical pass
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0, count = 0;
        for (let dy = -radius; dy <= radius; dy++) {
          const ny = y + dy;
          if (ny >= 0 && ny < h) {
            sum += tmp[ny * w + x];
            count++;
          }
        }
        mask[y * w + x] = Math.round(sum / count);
      }
    }
  }
}

/* ───── main export ───── */

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

        // Crop rectangle in pixel coords
        const cx = Math.round(region.x * srcW);
        const cy = Math.round(region.y * srcH);
        const cw = Math.round(region.w * srcW);
        const ch = Math.round(region.h * srcH);

        // Scale to output size preserving aspect
        const aspect = cw / ch;
        const outW = aspect >= 1 ? outputSize : Math.round(outputSize * aspect);
        const outH = aspect >= 1 ? Math.round(outputSize / aspect) : outputSize;

        // Step 1: Draw cropped region to working canvas
        const workCanvas = document.createElement("canvas");
        workCanvas.width = outW;
        workCanvas.height = outH;
        const workCtx = workCanvas.getContext("2d")!;
        workCtx.drawImage(img, cx, cy, cw, ch, 0, 0, outW, outH);

        const imageData = workCtx.getImageData(0, 0, outW, outH);
        const { data } = imageData;

        // Step 2: Sample background color from edges
        const [bgR, bgG, bgB] = sampleEdgeBackground(data, outW, outH);

        // Step 3: Build foreground mask
        const mask = buildForegroundMask(data, outW, outH, bgR, bgG, bgB);

        // Step 4: Morphological cleanup (radius 2–3 at this resolution)
        const morphRadius = Math.max(2, Math.round(outputSize / 200));
        morphCleanup(mask, outW, outH, morphRadius);

        // Step 5: Keep largest connected component near center
        keepLargestComponent(mask, outW, outH);

        // Step 6: Feather edges
        const blurRadius = Math.max(2, Math.round(outputSize / 150));
        blurMask(mask, outW, outH, blurRadius);

        // Step 7: Apply mask as alpha channel
        for (let i = 0; i < outW * outH; i++) {
          data[i * 4 + 3] = mask[i];
        }

        workCtx.putImageData(imageData, 0, 0);

        const dataUrl = workCanvas.toDataURL("image/png");
        cache.set(cacheKey, dataUrl);
        resolve(dataUrl);
      } catch (err) {
        console.warn("[extractCutout] Segmentation failed, falling back to rect crop:", err);
        // Fallback: rectangular crop without segmentation
        fallbackRectCrop(img, region, outputSize).then((url) => {
          cache.set(cacheKey, url);
          resolve(url);
        });
      }
    };

    img.onerror = () => {
      console.warn("[extractCutout] Image load failed for", paintingSrc);
      resolve("");
    };

    img.src = paintingSrc;
  });
}

/** Fallback: simple rectangular crop (no segmentation) */
function fallbackRectCrop(
  img: HTMLImageElement,
  region: CutoutRegion,
  outputSize: number
): Promise<string> {
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
  ctx.drawImage(img, cx, cy, cw, ch, 0, 0, outW, outH);
  return Promise.resolve(canvas.toDataURL("image/png"));
}
