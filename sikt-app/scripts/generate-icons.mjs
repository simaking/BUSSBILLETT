import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = path.resolve(process.cwd());
const assetsDir = path.join(projectRoot, 'assets');
const svgPath = path.join(assetsDir, 'logo.svg');

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Input file not found: ${filePath}`);
    process.exit(1);
  }
}

async function renderPngFromSvg(svgBuffer, size, outputPath) {
  await sharp(svgBuffer, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  console.log(`Wrote ${outputPath} (${size}x${size})`);
}

async function main() {
  ensureFileExists(svgPath);
  const svgBuffer = fs.readFileSync(svgPath);

  const outputs = [
    { size: 1024, file: 'icon.png' },
    { size: 1024, file: 'adaptive-icon.png' },
    { size: 1024, file: 'splash-icon.png' },
    { size: 64, file: 'favicon.png' }
  ];

  for (const { size, file } of outputs) {
    const outPath = path.join(assetsDir, file);
    await renderPngFromSvg(svgBuffer, size, outPath);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

