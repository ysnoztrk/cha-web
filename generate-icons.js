import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

function generateHeartIcon(size, outputPath) {
  const png = new PNG({ width: size, height: size });

  // Center & scale
  const cx = size / 2;
  const cy = size * 0.46;
  const heartScale = size * 0.38;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Rounded squircle background for iOS & Android
      const dxBg = (x - size / 2) / (size / 2);
      const dyBg = (y - size / 2) / (size / 2);
      const distBg = Math.pow(Math.abs(dxBg), 4) + Math.pow(Math.abs(dyBg), 4);

      if (distBg > 1.05) {
        // Transparent outside squircle
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
        continue;
      }

      // Background color: Pastel pink with subtle gradient
      let bgR = 255;
      let bgG = 209 - Math.floor((y / size) * 20);
      let bgB = 220 - Math.floor((y / size) * 15);

      // Heart equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      const nx = (x - cx) / heartScale;
      const ny = -(y - cy) / heartScale; // flip y

      const heartVal = Math.pow(nx * nx + ny * ny - 1, 3) - (nx * nx * Math.pow(ny, 3));

      if (heartVal <= 0.05) {
        // Inside heart
        const distFromCenter = Math.sqrt(nx * nx + (ny - 0.2) * (ny - 0.2));
        
        // Shiny highlight at top-left
        const hlX = nx + 0.35;
        const hlY = ny - 0.35;
        const hlDist = Math.sqrt(hlX * hlX + hlY * hlY);

        if (hlDist < 0.28 && heartVal < -0.15) {
          // Glossy highlight
          png.data[idx] = 255;
          png.data[idx + 1] = 182;
          png.data[idx + 2] = 217;
          png.data[idx + 3] = 255;
        } else {
          // Vibrant hot pink / rose pink
          const shade = Math.min(1, Math.max(0, 1 - distFromCenter * 0.4));
          png.data[idx] = Math.floor(255 * shade);
          png.data[idx + 1] = Math.floor(20 + 85 * shade);
          png.data[idx + 2] = Math.floor(147 + 40 * shade);
          png.data[idx + 3] = 255;
        }

        // Heart border
        if (heartVal > -0.08) {
          png.data[idx] = 180;
          png.data[idx + 1] = 0;
          png.data[idx + 2] = 90;
          png.data[idx + 3] = 255;
        }
      } else {
        // Background
        // Add a cute little sparkle at top-right
        const spX = (x - (cx + heartScale * 0.85));
        const spY = (y - (cy - heartScale * 0.7));
        const spDist = Math.sqrt(spX * spX + spY * spY);
        const spCross = (Math.abs(spX) < size * 0.015 && Math.abs(spY) < size * 0.06) ||
                        (Math.abs(spY) < size * 0.015 && Math.abs(spX) < size * 0.06);

        if (spDist < size * 0.06 && spCross) {
          // Gold sparkle
          png.data[idx] = 255;
          png.data[idx + 1] = 223;
          png.data[idx + 2] = 0;
          png.data[idx + 3] = 255;
        } else {
          png.data[idx] = bgR;
          png.data[idx + 1] = bgG;
          png.data[idx + 2] = bgB;
          png.data[idx + 3] = 255;
        }
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved ${outputPath} (${size}x${size})`);
}

const publicDir = path.resolve('public');
generateHeartIcon(192, path.join(publicDir, 'icon-192.png'));
generateHeartIcon(512, path.join(publicDir, 'icon-512.png'));
generateHeartIcon(180, path.join(publicDir, 'apple-touch-icon.png'));
generateHeartIcon(64, path.join(publicDir, 'favicon.png'));
