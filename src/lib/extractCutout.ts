/**
 * True contour-following flower cutout from source paintings.
 * Produces PNG with alpha that traces the flower silhouette — no rectangles.
 *
 * Pipeline:
 * 1. Crop ROI from painting
 * 2. Multi-cluster background estimation from border strips
 * 3. Color-distance + saturation foreground mask
 * 4. GrabCut-style iterative refinement (3 passes)
 * 5. Morphological close (fill holes) → open (remove specks)
 * 6. Keep largest connected component near center
 * 7. Feather contour edges (1–2px Gaussian blur on boundary only)
 * 8. Trim transparent margins
 * 9. Apply alpha mask to original pixels → PNG
 */

const cache = new Map<string, string>();

export interface CutoutRegion {
  x: number; y: number; w: number; h: number;
}

/* ═══════ Background Color Estimation ═══════ */

interface ColorCluster {
  r: number; g: number; b: number; count: number;
}

/** Sample pixels from border strips, cluster into 2–3 dominant background tones */
function estimateBackgroundColors(
  data: Uint8ClampedArray, w: number, h: number
): ColorCluster[] {
  const STRIP = Math.max(4, Math.min(10, Math.floor(Math.min(w, h) * 0.04)));
  const samples: [number, number, number][] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x >= STRIP && x < w - STRIP && y >= STRIP && y < h - STRIP) continue;
      const i = (y * w + x) * 4;
      samples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  if (samples.length === 0) return [{ r: 180, g: 170, b: 150, count: 1 }];

  // K-means with k=3
  const k = 3;
  const centers: [number, number, number][] = [];
  for (let i = 0; i < k; i++) {
    const idx = Math.floor((i / k) * samples.length);
    centers.push([...samples[idx]]);
  }

  for (let iter = 0; iter < 8; iter++) {
    const sums = centers.map(() => ({ r: 0, g: 0, b: 0, count: 0 }));

    for (const [r, g, b] of samples) {
      let bestDist = Infinity, bestIdx = 0;
      for (let c = 0; c < k; c++) {
        const dr = r - centers[c][0], dg = g - centers[c][1], db = b - centers[c][2];
        const d = dr * dr + dg * dg + db * db;
        if (d < bestDist) { bestDist = d; bestIdx = c; }
      }
      sums[bestIdx].r += r;
      sums[bestIdx].g += g;
      sums[bestIdx].b += b;
      sums[bestIdx].count++;
    }

    for (let c = 0; c < k; c++) {
      if (sums[c].count > 0) {
        centers[c][0] = sums[c].r / sums[c].count;
        centers[c][1] = sums[c].g / sums[c].count;
        centers[c][2] = sums[c].b / sums[c].count;
      }
    }
  }

  // Return clusters with counts
  const result: ColorCluster[] = [];
  const assign = centers.map(() => 0);
  for (const [r, g, b] of samples) {
    let bestDist = Infinity, bestIdx = 0;
    for (let c = 0; c < k; c++) {
      const dr = r - centers[c][0], dg = g - centers[c][1], db = b - centers[c][2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestDist) { bestDist = d; bestIdx = c; }
    }
    assign[bestIdx]++;
  }

  for (let c = 0; c < k; c++) {
    if (assign[c] > samples.length * 0.05) {
      result.push({
        r: Math.round(centers[c][0]),
        g: Math.round(centers[c][1]),
        b: Math.round(centers[c][2]),
        count: assign[c],
      });
    }
  }

  return result.length > 0 ? result : [{ r: 180, g: 170, b: 150, count: 1 }];
}

/* ═══════ Foreground Mask ═══════ */

function colorDist(r: number, g: number, b: number, cr: number, cg: number, cb: number): number {
  const dr = r - cr, dg = g - cg, db = b - cb;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function buildMask(
  data: Uint8ClampedArray, w: number, h: number,
  bgClusters: ColorCluster[]
): Uint8Array {
  const mask = new Uint8Array(w * h);
  const LOW = 25;
  const HIGH = 55;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pi = (y * w + x) * 4;
      const r = data[pi], g = data[pi + 1], b = data[pi + 2];

      // Min distance to any background cluster
      let minDist = Infinity;
      for (const bg of bgClusters) {
        minDist = Math.min(minDist, colorDist(r, g, b, bg.r, bg.g, bg.b));
      }

      // Saturation boost
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const sat = mx === 0 ? 0 : (mx - mn) / mx;
      const boosted = minDist + sat * 18;

      if (boosted < LOW) {
        mask[y * w + x] = 0;
      } else if (boosted > HIGH) {
        mask[y * w + x] = 255;
      } else {
        mask[y * w + x] = Math.round(255 * ((boosted - LOW) / (HIGH - LOW)));
      }
    }
  }
  return mask;
}

/* ═══════ GrabCut-style Iterative Refinement ═══════ */

function refineIterative(
  data: Uint8ClampedArray, mask: Uint8Array,
  w: number, h: number, passes: number
): void {
  for (let pass = 0; pass < passes; pass++) {
    // Re-estimate FG and BG color models from current mask
    let fgR = 0, fgG = 0, fgB = 0, fgN = 0;
    let bgR = 0, bgG = 0, bgB = 0, bgN = 0;

    for (let i = 0; i < w * h; i++) {
      const pi = i * 4;
      const r = data[pi], g = data[pi + 1], b = data[pi + 2];
      if (mask[i] > 200) {
        fgR += r; fgG += g; fgB += b; fgN++;
      } else if (mask[i] < 50) {
        bgR += r; bgG += g; bgB += b; bgN++;
      }
    }

    if (fgN === 0 || bgN === 0) break;

    const fR = fgR / fgN, fG = fgG / fgN, fB = fgB / fgN;
    const bR = bgR / bgN, bG = bgG / bgN, bB = bgB / bgN;

    // Re-classify uncertain pixels (50–200)
    for (let i = 0; i < w * h; i++) {
      if (mask[i] >= 50 && mask[i] <= 200) {
        const pi = i * 4;
        const r = data[pi], g = data[pi + 1], b = data[pi + 2];
        const dFg = colorDist(r, g, b, fR, fG, fB);
        const dBg = colorDist(r, g, b, bR, bG, bB);

        if (dBg < dFg * 0.85) {
          mask[i] = Math.max(0, mask[i] - 40);
        } else if (dFg < dBg * 0.85) {
          mask[i] = Math.min(255, mask[i] + 40);
        }
      }
    }

    // Force border pixels to background
    const border = Math.max(2, Math.floor(Math.min(w, h) * 0.02));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (x < border || x >= w - border || y < border || y >= h - border) {
          mask[y * w + x] = 0;
        }
      }
    }
  }
}

/* ═══════ Morphological Operations ═══════ */

function morphClose(mask: Uint8Array, w: number, h: number, radius: number): void {
  const tmp = new Uint8Array(w * h);
  // Dilate
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let maxVal = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
            maxVal = Math.max(maxVal, mask[ny * w + nx]);
          }
        }
      }
      tmp[y * w + x] = maxVal;
    }
  }
  // Erode
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minVal = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
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

function morphOpen(mask: Uint8Array, w: number, h: number, radius: number): void {
  const tmp = new Uint8Array(w * h);
  // Erode
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minVal = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
            minVal = Math.min(minVal, tmp[ny * w + nx] !== undefined ? mask[ny * w + nx] : 255);
          }
        }
      }
      tmp[y * w + x] = minVal;
    }
  }
  // Dilate
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let maxVal = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
            maxVal = Math.max(maxVal, tmp[ny * w + nx]);
          }
        }
      }
      mask[y * w + x] = maxVal;
    }
  }
}

/* ═══════ Connected Component Analysis ═══════ */

function keepLargestComponent(mask: Uint8Array, w: number, h: number): void {
  const labels = new Int32Array(w * h).fill(-1);
  let nextLabel = 0;
  const sizes: number[] = [];
  const centroids: [number, number][] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (mask[idx] < 128 || labels[idx] >= 0) continue;

      const label = nextLabel++;
      const stack: number[] = [idx];
      labels[idx] = label;
      let size = 0, cx = 0, cy = 0;

      while (stack.length > 0) {
        const cur = stack.pop()!;
        const px = cur % w, py = (cur - px) / w;
        size++; cx += px; cy += py;

        for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
          const nx = px + dx, ny = py + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const ni = ny * w + nx;
            if (mask[ni] >= 128 && labels[ni] < 0) {
              labels[ni] = label;
              stack.push(ni);
            }
          }
        }
      }
      sizes.push(size);
      centroids.push([cx / size, cy / size]);
    }
  }

  if (nextLabel === 0) return;

  // Score: large + near center
  const midX = w / 2, midY = h / 2;
  const maxD = Math.sqrt(midX * midX + midY * midY);
  let bestLabel = 0, bestScore = -1;

  for (let i = 0; i < nextLabel; i++) {
    const dist = Math.sqrt((centroids[i][0] - midX) ** 2 + (centroids[i][1] - midY) ** 2);
    const score = (sizes[i] / (w * h)) * 0.6 + (1 - dist / maxD) * 0.4;
    if (score > bestScore) { bestScore = score; bestLabel = i; }
  }

  for (let i = 0; i < w * h; i++) {
    if (labels[i] !== bestLabel) mask[i] = 0;
  }
}

/* ═══════ Edge Feathering ═══════ */

/** Blur ONLY the boundary pixels (1–2px feather on the contour edge) */
function featherContour(mask: Uint8Array, w: number, h: number, radius: number): void {
  // Find boundary pixels (FG adjacent to BG or vice versa)
  const isBoundary = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const v = mask[y * w + x];
      if (v > 20 && v < 235) { isBoundary[y * w + x] = 1; continue; }
      // Check 4-neighbors
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nv = mask[(y + dy) * w + (x + dx)];
        if (Math.abs(v - nv) > 100) { isBoundary[y * w + x] = 1; break; }
      }
    }
  }

  // Expand boundary band by radius
  const band = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!isBoundary[y * w + x]) continue;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
            band[ny * w + nx] = 1;
          }
        }
      }
    }
  }

  // Blur only within the band
  const tmp = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) tmp[i] = mask[i];

  for (let pass = 0; pass < 2; pass++) {
    const src = pass === 0 ? tmp : mask;
    const dst = pass === 0 ? mask : tmp;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!band[y * w + x]) { (dst as any)[y * w + x] = (src as any)[y * w + x]; continue; }
        let sum = 0, count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
              sum += Number((src as any)[ny * w + nx]);
              count++;
            }
          }
        }
        (dst as any)[y * w + x] = Math.round(sum / count);
      }
    }
  }

  // Copy back
  for (let i = 0; i < w * h; i++) mask[i] = Math.round(tmp[i]);
}

/* ═══════ Trim Transparent Margins ═══════ */

function trimTransparent(
  canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const w = canvas.width, h = canvas.height;
  const data = ctx.getImageData(0, 0, w, h).data;

  let top = h, left = w, bottom = 0, right = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 10) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  if (top > bottom || left > right) return { canvas, ctx };

  const pad = 4;
  const tl = Math.max(0, left - pad);
  const tt = Math.max(0, top - pad);
  const tw = Math.min(w - tl, right - left + 1 + pad * 2);
  const th = Math.min(h - tt, bottom - top + 1 + pad * 2);

  const trimmed = document.createElement("canvas");
  trimmed.width = tw;
  trimmed.height = th;
  const tCtx = trimmed.getContext("2d")!;
  tCtx.drawImage(canvas, tl, tt, tw, th, 0, 0, tw, th);

  return { canvas: trimmed, ctx: tCtx };
}

/* ═══════ Main Export ═══════ */

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
        const srcW = img.naturalWidth, srcH = img.naturalHeight;
        const cx = Math.round(region.x * srcW);
        const cy = Math.round(region.y * srcH);
        const cw = Math.round(region.w * srcW);
        const ch = Math.round(region.h * srcH);

        const aspect = cw / ch;
        const outW = aspect >= 1 ? outputSize : Math.round(outputSize * aspect);
        const outH = aspect >= 1 ? Math.round(outputSize / aspect) : outputSize;

        // Step 1: Crop ROI
        const workCanvas = document.createElement("canvas");
        workCanvas.width = outW;
        workCanvas.height = outH;
        const workCtx = workCanvas.getContext("2d")!;
        workCtx.drawImage(img, cx, cy, cw, ch, 0, 0, outW, outH);

        const imageData = workCtx.getImageData(0, 0, outW, outH);
        const { data } = imageData;

        // Step 2: Multi-cluster background estimation
        const bgClusters = estimateBackgroundColors(data, outW, outH);

        // Step 3: Build initial foreground mask
        const mask = buildMask(data, outW, outH, bgClusters);

        // Step 4: GrabCut-style iterative refinement
        refineIterative(data, mask, outW, outH, 3);

        // Step 5: Morphological close (fill holes) then open (remove specks)
        const morphR = Math.max(2, Math.round(outputSize / 200));
        morphClose(mask, outW, outH, morphR);
        morphOpen(mask, outW, outH, Math.max(1, morphR - 1));

        // Step 6: Keep largest connected component near center
        keepLargestComponent(mask, outW, outH);

        // Step 7: Binarize to clean alpha, then feather contour edges
        for (let i = 0; i < outW * outH; i++) {
          mask[i] = mask[i] >= 128 ? 255 : 0;
        }
        featherContour(mask, outW, outH, 2);

        // Step 8: Apply mask as alpha
        for (let i = 0; i < outW * outH; i++) {
          data[i * 4 + 3] = mask[i];
        }
        workCtx.putImageData(imageData, 0, 0);

        // Step 9: Trim transparent margins
        const { canvas: trimmedCanvas } = trimTransparent(workCanvas, workCtx);

        const dataUrl = trimmedCanvas.toDataURL("image/png");
        cache.set(cacheKey, dataUrl);
        resolve(dataUrl);
      } catch (err) {
        console.warn("[extractCutout] Segmentation failed:", err);
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
