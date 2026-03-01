/**
 * Deterministic client-side background removal for sticker PNGs.
 * Samples corner patches to detect the paper background color,
 * then removes it with soft feathering for clean edges.
 */

const cache = new Map<string, string>();

const PATCH_SIZE = 8; // sample 8×8 patch from each corner
const THRESHOLD_LOW = 25; // below this distance → fully transparent
const THRESHOLD_HIGH = 45; // above this distance → fully opaque
// Between low and high → linear feathering

interface RGB {
  r: number;
  g: number;
  b: number;
}

function sampleCornerColor(
  data: Uint8ClampedArray,
  width: number,
  height: number
): RGB {
  const corners = [
    { x: 0, y: 0 },
    { x: width - PATCH_SIZE, y: 0 },
    { x: 0, y: height - PATCH_SIZE },
    { x: width - PATCH_SIZE, y: height - PATCH_SIZE },
  ];

  let totalR = 0,
    totalG = 0,
    totalB = 0,
    count = 0;

  for (const corner of corners) {
    for (let dy = 0; dy < PATCH_SIZE; dy++) {
      for (let dx = 0; dx < PATCH_SIZE; dx++) {
        const idx = ((corner.y + dy) * width + (corner.x + dx)) * 4;
        // Only sample opaque pixels
        if (data[idx + 3] > 200) {
          totalR += data[idx];
          totalG += data[idx + 1];
          totalB += data[idx + 2];
          count++;
        }
      }
    }
  }

  if (count === 0) {
    return { r: 240, g: 235, b: 225 }; // fallback paper color
  }

  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
  };
}

function colorDistance(r: number, g: number, b: number, bg: RGB): number {
  const dr = r - bg.r;
  const dg = g - bg.g;
  const db = b - bg.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function removeBackground(imageSrc: string): Promise<string> {
  // Return from memory cache
  if (cache.has(imageSrc)) {
    return Promise.resolve(cache.get(imageSrc)!);
  }

  // Check localStorage cache
  const storageKey = `bg-removed:${imageSrc}`;
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      cache.set(imageSrc, cached);
      return Promise.resolve(cached);
    }
  } catch {
    // localStorage unavailable, continue
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;

        const bgColor = sampleCornerColor(data, canvas.width, canvas.height);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 10) continue; // already transparent

          const dist = colorDistance(r, g, b, bgColor);

          if (dist < THRESHOLD_LOW) {
            data[i + 3] = 0; // fully transparent
          } else if (dist < THRESHOLD_HIGH) {
            // Soft feather: linear ramp from 0 to original alpha
            const t = (dist - THRESHOLD_LOW) / (THRESHOLD_HIGH - THRESHOLD_LOW);
            data[i + 3] = Math.round(a * t);
          }
          // else keep original alpha
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");

        // Cache in memory
        cache.set(imageSrc, dataUrl);

        // Try localStorage
        try {
          localStorage.setItem(storageKey, dataUrl);
        } catch {
          // quota exceeded, skip
        }

        resolve(dataUrl);
      } catch (err) {
        console.warn("[removeBackground] Processing failed, using original:", err);
        resolve(imageSrc);
      }
    };

    img.onerror = () => {
      console.warn("[removeBackground] Image load failed, using original");
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
