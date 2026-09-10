const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#008080"/>
  <g fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 46 L26 30 L36 36 L50 20"/>
    <path d="M12 50 Q18 50 22 44 L16 40 Q12 44 12 50"/>
    <path d="M28 26 Q30 34 36 34 Q38 28 32 24 Z"/>
    <circle cx="14" cy="48" r="4" fill="white" stroke="none"/>
    <circle cx="48" cy="22" r="5" fill="white" stroke="none"/>
  </g>
</svg>`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'frontend', 'public', 'icons');

sizes.forEach(size => {
  const scaledSvg = svgContent.replace('viewBox="0 0 64 64"', `viewBox="0 0 64 64" width="${size}" height="${size}"`);
  const htmlContent = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:transparent;">
<div style="width:${size}px;height:${size}px;">${scaledSvg}</div>
</body></html>`;
  
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), scaledSvg);
  console.log(`Created icon-${size}.svg`);
});

console.log('\nSVG icons created. For PNG conversion, open generate-icons.html in browser.');
