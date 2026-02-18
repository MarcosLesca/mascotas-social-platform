import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(__dirname, 'public');

const size192 = 192;
const size512 = 512;

// Create a simple icon with the brand color #203553 and a paw symbol
async function generateIcons() {
  const svgIcon = `
    <svg width="${size512}" height="${size512}" viewBox="0 0 ${size512} ${size512}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size512}" height="${size512}" fill="#203553" rx="64"/>
      <g fill="#ecdbbd" transform="translate(100, 100)">
        <!-- Main pad -->
        <ellipse cx="156" cy="220" rx="70" ry="55"/>
        <!-- Top left toe -->
        <circle cx="70" cy="100" r="35"/>
        <!-- Top right toe -->
        <circle cx="156" cy="60" r="35"/>
        <!-- Right toe -->
        <circle cx="242" cy="100" r="35"/>
        <!-- Bottom left toe -->
        <circle cx="40" cy="170" r="30"/>
        <!-- Bottom right toe -->
        <circle cx="272" cy="170" r="30"/>
      </g>
      <text x="256" y="380" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ecdbbd" text-anchor="middle">Mascotas SJ</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgIcon);

  // Generate 192x192
  await sharp(svgBuffer)
    .resize(size192, size192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  console.log('Created pwa-192x192.png');

  // Generate 512x512
  await sharp(svgBuffer)
    .resize(size512, size512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  console.log('Created pwa-512x512.png');
}

generateIcons().catch(console.error);
