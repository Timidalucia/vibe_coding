/**
 * True contour-following background removal for sticker PNGs.
 * Uses multi-cluster background estimation + contour feathering.
 *
 * Pipeline:
 * 1. Load sticker into canvas
 * 2. K-means cluster border pixels → 2–3 background tones
 * 3. Per-pixel: min distance to any BG cluster → alpha
 * 4. Binarize, morphological close/open, keep largest component
 * 5. Feather contour edge (1–2px)
 * 6. Apply alpha mask, trim transparent margins → PNG
 */

const processedCache = new Map<string, string>();

function sampleBorderPixels(
  data: Uint8ClampedArray, w: number, h: number
): [number, number, number][] {
  const STRIP = Math.max(3, Math.min(8, Math.floor(Math.min(w, h) * 0.03)));
  const samples: [number, number, number][] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x >= STRIP && x < w - STRIP && y >= STRIP && y < h - STRIP) continue;
      const i = (y * w + x) * 4;
      if (data[i + 3] < 200) continue; // skip already-transparent
      samples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  return samples;
}

interface Cluster { r: number; g: number; b: number; }

function kMeansClusters(samples: [number, number, number][], k: number): Cluster[] {
  if (samples.length === 0) return [{ r: 240, g: 235, b: 225 }];

  const centers: [number, number, number][] = [];
  for (let i = 0; i < k; i++) {
    centers.push([...samples[Math.floor((i / k) * samples.length)]]);
  }

  for (let iter = 0; iter < 8; iter++) {
    const sums = centers.map(() => ({ r: 0, g: 0, b: 0, n: 0 }));
    for (const [r, g, b] of samples) {
      let best = 0, bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const dr = r - centers[c][0], dg = g - centers[c][1], db = b - centers[c][2];
        const d = dr * dr + dg * dg + db * db;
        if (d < bestD) { bestD = d; best = c; }
      }
      sums[best].r += r; sums[best].g += g; sums[best].b += b; sums[best].n++;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c].n > 0) {
        centers[c] = [sums[c].r / sums[c].n, sums[c].g / sums[c].n, sums[c].b / sums[c].n];
      }
    }
  }

  // Filter out tiny clusters
  const counts = centers.map(() => 0);
  for (const [r, g, b] of samples) {
    let best = 0, bestD = Infinity;
    for (let c = 0; c < k; c++) {
      const dr = r - centers[c][0], dg = g - centers[c][1], db = b - centers[c][2];
      if (dr * dr + dg * dg + db * db < bestD) { bestD = dr * dr + dg * dg + db * db; best = c; }
    }
    counts[best]++;
  }

  return centers
    .filter((_, i) => counts[i] > samples.length * 0.05)
    .map(c => ({ r: Math.round(c[0]), g: Math.round(c[1]), b: Math.round(c[2]) }));
}

function colorDist(r: number, g: number, b: number, c: Cluster): number {
  const dr = r - c.r, dg = g - c.g, db = b - c.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function keepLargest(mask: Uint8Array, w: number, h: number): void {
  const labels = new Int32Array(w * h).fill(-1);
  let nextLabel = 0;
  const sizes: number[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (mask[idx] < 128 || labels[idx] >= 0) continue;
      const label = nextLabel++;
      const stack = [idx];
      labels[idx] = label;
      let sz = 0;
      while (stack.length > 0) {
        const cur = stack.pop()!;
        sz++;
        const px = cur % w, py = (cur - px) / w;
        for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
          const nx = px + dx, ny = py + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const ni = ny * w + nx;
            if (mask[ni] >= 128 && labels[ni] < 0) { labels[ni] = label; stack.push(ni); }
          }
        }
      }
      sizes.push(sz);
    }
  }

  if (nextLabel === 0) return;
  const best = sizes.indexOf(Math.max(...sizes));
  for (let i = 0; i < w * h; i++) {
    if (labels[i] !== best) mask[i] = 0;
  }
}

function morphOp(mask: Uint8Array, w: number, h: number, r: number, type: "close" | "open"): void {
  const tmp = new Uint8Array(w * h);
  const ops: ["max" | "min", "max" | "min"] = type === "close" ? ["max", "min"] : ["min", "max"];

  for (const op of ops) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let val = op === "max" ? 0 : 255;
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (dx * dx + dy * dy > r * r) continue;
            const ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
              const src = op === ops[0] ? mask : tmp;
              const v = src[ny * w + nx];
              val = op === "max" ? Math.max(val, v) : Math.min(val, v);
            }
          }
        }
        (op === ops[0] ? tmp : mask)[y * w + x] = val;
      }
    }
  }
}

function featherEdge(mask: Uint8Array, w: number, h: number): void {
  const tmp = new Uint8Array(mask);
  for (let pass = 0; pass < 2; pass++) {
    const src = pass === 0 ? tmp : mask;
    const dst = pass === 0 ? mask : tmp;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const v = src[idx];
        // Only blur near boundaries
        const hasEdge =
          Math.abs(v - src[idx - 1]) > 100 ||
          Math.abs(v - src[idx + 1]) > 100 ||
          Math.abs(v - src[idx - w]) > 100 ||
          Math.abs(v - src[idx + w]) > 100;
        if (!hasEdge) { dst[idx] = v; continue; }
        dst[idx] = Math.round(
          (src[idx - 1] + src[idx + 1] + src[idx - w] + src[idx + w] + v * 2) / 6
        );
      }
    }
  }
  for (let i = 0; i < w * h; i++) mask[i] = tmp[i];
}

export function removeStickerBackground(src: string): Promise<string> {
  if (processedCache.has(src)) return Promise.resolve(processedCache.get(src)!);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const w = img.naturalWidth, h = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, w, h);
        const { data } = imageData;

        // Multi-cluster background estimation
        const borderSamples = sampleBorderPixels(data, w, h);
        const clusters = kMeansClusters(borderSamples, 3);

        // Build alpha mask
        const mask = new Uint8Array(w * h);
        const LOW = 20, HIGH = 42;

        for (let i = 0; i < w * h; i++) {
          const pi = i * 4;
          const r = data[pi], g = data[pi + 1], b = data[pi + 2];
          let minD = Infinity;
          for (const c of clusters) minD = Math.min(minD, colorDist(r, g, b, c));

          const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
          const sat = mx === 0 ? 0 : (mx - mn) / mx;
          const boosted = minD + sat * 15;

          if (boosted < LOW) mask[i] = 0;
          else if (boosted > HIGH) mask[i] = 255;
          else mask[i] = Math.round(255 * ((boosted - LOW) / (HIGH - LOW)));
        }

        // Morph close then open
        morphOp(mask, w, h, 2, "close");
        morphOp(mask, w, h, 1, "open");

        // Keep largest component
        keepLargest(mask, w, h);

        // Binarize + feather
        for (let i = 0; i < w * h; i++) mask[i] = mask[i] >= 128 ? 255 : 0;
        featherEdge(mask, w, h);

        // Apply alpha
        for (let i = 0; i < w * h; i++) {
          data[i * 4 + 3] = mask[i];
        }
        ctx.putImageData(imageData, 0, 0);

        // Trim transparent margins
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

        if (top <= bottom && left <= right) {
          const pad = 2;
          const tl = Math.max(0, left - pad), tt = Math.max(0, top - pad);
          const tw = Math.min(w - tl, right - left + 1 + pad * 2);
          const th = Math.min(h - tt, bottom - top + 1 + pad * 2);
          const trimmed = document.createElement("canvas");
          trimmed.width = tw; trimmed.height = th;
          trimmed.getContext("2d")!.drawImage(canvas, tl, tt, tw, th, 0, 0, tw, th);
          const result = trimmed.toDataURL("image/png");
          processedCache.set(src, result);
          resolve(result);
        } else {
          const result = canvas.toDataURL("image/png");
          processedCache.set(src, result);
          resolve(result);
        }
      } catch (err) {
        console.warn("[removeStickerBackground] Failed:", err);
        resolve(src);
      }
    };

    img.onerror = () => resolve(src);
    img.src = src;
  });
}
