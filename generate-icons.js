const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'frontend', 'public', 'icons');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const r = size * 0.22;

  // Background
  ctx.fillStyle = '#008080';
  roundRect(ctx, 0, 0, size, size, r);
  ctx.fill();

  // Wrench handle
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.047;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.28, size * 0.72);
  ctx.lineTo(size * 0.41, size * 0.47);
  ctx.lineTo(size * 0.56, size * 0.56);
  ctx.lineTo(size * 0.78, size * 0.31);
  ctx.stroke();

  // Pipe/elbow
  ctx.beginPath();
  ctx.moveTo(size * 0.19, size * 0.78);
  ctx.quadraticCurveTo(size * 0.28, size * 0.78, size * 0.34, size * 0.69);
  ctx.lineTo(size * 0.25, size * 0.63);
  ctx.quadraticCurveTo(size * 0.19, size * 0.69, size * 0.19, size * 0.78);
  ctx.stroke();

  // Brush shape
  ctx.beginPath();
  ctx.moveTo(size * 0.44, size * 0.41);
  ctx.quadraticCurveTo(size * 0.47, size * 0.53, size * 0.56, size * 0.53);
  ctx.quadraticCurveTo(size * 0.59, size * 0.44, size * 0.50, size * 0.38);
  ctx.closePath();
  ctx.stroke();

  // Bottom dot
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(size * 0.22, size * 0.75, size * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Top-right dot
  ctx.beginPath();
  ctx.arc(size * 0.75, size * 0.34, size * 0.078, 0, Math.PI * 2);
  ctx.fill();

  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created icon-${size}.png`);
});

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

console.log('\nAll icons generated!');
