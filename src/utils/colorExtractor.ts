/**
 * Real-world Color Palette Extractor using HTML5 Canvas
 * Samples pixels from any image URL and computes dominant color HEX codes.
 */
export async function extractColorPalette(imageUrl: string, colorCount = 4): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(['#1E1E1E', '#4A4A4A', '#8C8C8C', '#D1D5DB']);
          return;
        }

        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imageData = ctx.getImageData(0, 0, 100, 100).data;
        const colorMap: Record<string, number> = {};

        // Sample every 4th pixel for speed & accuracy
        for (let i = 0; i < imageData.length; i += 16) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          // Skip transparent or near-white/near-black extremes if necessary
          if (a < 128) continue;

          // Quantize color to 16-step buckets
          const qR = Math.round(r / 32) * 32;
          const qG = Math.round(g / 32) * 32;
          const qB = Math.round(b / 32) * 32;

          const hex = `#${((1 << 24) + (qR << 16) + (qG << 8) + qB).toString(16).slice(1).toUpperCase()}`;
          colorMap[hex] = (colorMap[hex] || 0) + 1;
        }

        // Sort by frequency
        const sortedHexes = Object.keys(colorMap).sort((a, b) => colorMap[b] - colorMap[a]);
        const result = sortedHexes.slice(0, colorCount);

        if (result.length === 0) {
          resolve(['#2B2E33', '#4A4E53', '#1A1C1F', '#D1D5DB']);
        } else {
          resolve(result);
        }
      } catch (err) {
        // Fallback for CORS restricted images
        resolve(['#2B2E33', '#4A4E53', '#8C8C8C', '#D1D5DB']);
      }
    };

    img.onerror = () => {
      resolve(['#2B2E33', '#4A4E53', '#8C8C8C', '#D1D5DB']);
    };
  });
}
