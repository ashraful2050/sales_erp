/**
 * AccounTech BD — Logo & Favicon Asset Generator
 * Run: node generate-assets.cjs
 * Outputs: public/favicon.ico, public/logo-*.png, public/apple-touch-icon.png
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUB = path.join(__dirname, "public");

/* ─── SVG Sources ─────────────────────────────────────────────────────────── */

// Square icon mark (used for favicon + all square logos)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="50%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="letterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e0e7ff" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="dotGrad" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
      <stop offset="0%"   stop-color="#93c5fd" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect x="16" y="16" width="368" height="368" rx="82" fill="url(#bgGrad)"/>
  <rect x="16" y="16" width="368" height="368" rx="82" fill="url(#shine)"/>

  <!-- Grid lines (subtle) -->
  <g opacity="0.06" stroke="#ffffff" stroke-width="1.2" fill="none">
    <line x1="104" y1="16" x2="104" y2="384"/>
    <line x1="200" y1="16" x2="200" y2="384"/>
    <line x1="296" y1="16" x2="296" y2="384"/>
    <line x1="16"  y1="120" x2="384" y2="120"/>
    <line x1="16"  y1="200" x2="384" y2="200"/>
    <line x1="16"  y1="280" x2="384" y2="280"/>
  </g>

  <!-- Decorative glow circles -->
  <circle cx="62"  cy="62"  r="45" fill="#93c5fd" opacity="0.15"/>
  <circle cx="338" cy="338" r="60" fill="#a78bfa" opacity="0.12"/>

  <!-- Corner dots -->
  <circle cx="352" cy="52"  r="5.5" fill="#93c5fd" opacity="0.55"/>
  <circle cx="340" cy="72"  r="3.5" fill="#a78bfa" opacity="0.45"/>
  <circle cx="52"  cy="352" r="4.5" fill="#38bdf8" opacity="0.5"/>
  <circle cx="70"  cy="368" r="3"   fill="#818cf8" opacity="0.4"/>

  <!-- ── Letter A ── -->
  <!-- Outer shape -->
  <path d="M200 82 L122 318 L158 318 L200 192 L242 318 L278 318 Z" fill="url(#letterGrad)"/>
  <!-- Inner hollow -->
  <path d="M200 82 L158 318 L242 318 Z" fill="url(#bgGrad)" opacity="0.72"/>

  <!-- Crossbar — cyan→purple gradient -->
  <rect x="150" y="232" width="100" height="22" rx="11" fill="url(#bar)"/>

  <!-- Apex diamond -->
  <polygon points="200,68 213,88 200,102 187,88" fill="#7dd3fc" opacity="0.88"/>

  <!-- Bottom serifs -->
  <rect x="115" y="310" width="50" height="13" rx="6.5" fill="url(#letterGrad)" opacity="0.65"/>
  <rect x="235" y="310" width="50" height="13" rx="6.5" fill="url(#letterGrad)" opacity="0.65"/>

  <!-- Border ring -->
  <rect x="16" y="16" width="368" height="368" rx="82" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.14"/>
</svg>`;

// Favicon-optimised (crisp at tiny sizes)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <path d="M32 8 L12 56 L21 56 L32 27 L43 56 L52 56 Z" fill="white"/>
  <path d="M32 8 L21 56 L43 56 Z" fill="url(#bg)" opacity="0.75"/>
  <rect x="21" y="41" width="22" height="6" rx="3" fill="url(#bar)"/>
</svg>`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

async function svgToPng(svgStr, outputPath, size) {
    await sharp(Buffer.from(svgStr))
        .resize(size, size)
        .png({ compressionLevel: 9, quality: 100 })
        .toFile(outputPath);
    console.log(`  ✓ ${path.basename(outputPath)} (${size}x${size})`);
}

async function buildIco(pngBuffers, outputPath) {
    // Minimal ICO builder: supports 16, 32, 48 px entries
    const sizes = pngBuffers.map((b) => ({ size: b.length, data: b }));
    const numImages = sizes.length;
    const headerSize = 6;
    const dirEntrySize = 16;
    const dataOffset = headerSize + dirEntrySize * numImages;

    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type: 1 = ICO
    header.writeUInt16LE(numImages, 4);

    let offset = dataOffset;
    const dirEntries = [];

    for (let i = 0; i < numImages; i++) {
        const dim = [16, 32, 48][i];
        const entry = Buffer.alloc(16);
        entry.writeUInt8(dim === 256 ? 0 : dim, 0); // Width  (0 = 256)
        entry.writeUInt8(dim === 256 ? 0 : dim, 1); // Height (0 = 256)
        entry.writeUInt8(0, 2); // Colour count
        entry.writeUInt8(0, 3); // Reserved
        entry.writeUInt16LE(1, 4); // Colour planes
        entry.writeUInt16LE(32, 6); // Bits per pixel
        entry.writeUInt32LE(sizes[i].size, 8);
        entry.writeUInt32LE(offset, 12);
        offset += sizes[i].size;
        dirEntries.push(entry);
    }

    const parts = [header, ...dirEntries, ...pngBuffers];
    fs.writeFileSync(outputPath, Buffer.concat(parts));
    console.log(
        `  ✓ ${path.basename(outputPath)} (multi-size ICO: 16, 32, 48)`,
    );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */

async function generate() {
    console.log("\n🎨  AccounTech BD — Generating logo & favicon assets...\n");

    // ── Square icon PNG variants ──
    await svgToPng(iconSvg, path.join(PUB, "logo-512.png"), 512);
    await svgToPng(iconSvg, path.join(PUB, "logo-256.png"), 256);
    await svgToPng(iconSvg, path.join(PUB, "logo-192.png"), 192);
    await svgToPng(iconSvg, path.join(PUB, "logo-128.png"), 128);
    await svgToPng(iconSvg, path.join(PUB, "logo-64.png"), 64);

    // ── Apple touch icon ──
    await svgToPng(iconSvg, path.join(PUB, "apple-touch-icon.png"), 180);

    // ── OG / Social preview icon ──
    await svgToPng(iconSvg, path.join(PUB, "logo-og.png"), 512);

    // ── Favicon PNGs ──
    const fav16Buf = await sharp(Buffer.from(faviconSvg))
        .resize(16, 16)
        .png()
        .toBuffer();
    const fav32Buf = await sharp(Buffer.from(faviconSvg))
        .resize(32, 32)
        .png()
        .toBuffer();
    const fav48Buf = await sharp(Buffer.from(faviconSvg))
        .resize(48, 48)
        .png()
        .toBuffer();

    await fs.promises.writeFile(path.join(PUB, "favicon-16.png"), fav16Buf);
    await fs.promises.writeFile(path.join(PUB, "favicon-32.png"), fav32Buf);
    console.log("  ✓ favicon-16.png (16x16)");
    console.log("  ✓ favicon-32.png (32x32)");

    // ── Multi-size .ico (16 + 32 + 48) ──
    await buildIco(
        [fav16Buf, fav32Buf, fav48Buf],
        path.join(PUB, "favicon.ico"),
    );

    // ── Write manifest icons entry hint (JSON) ──
    const manifest = {
        name: "AccounTech BD",
        short_name: "AccounTech",
        description: "Complete ERP for Bangladesh Businesses",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
            { src: "/logo-192.png", sizes: "192x192", type: "image/png" },
            { src: "/logo-512.png", sizes: "512x512", type: "image/png" },
        ],
    };
    fs.writeFileSync(
        path.join(PUB, "site.webmanifest"),
        JSON.stringify(manifest, null, 2),
    );
    console.log("  ✓ site.webmanifest");

    console.log("\n✅  All assets generated successfully in public/\n");
}

generate().catch((err) => {
    console.error("❌  Error:", err.message);
    process.exit(1);
});
