import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon. Same mark as `icon.tsx`, drawn at the size iOS actually
 * asks for so the glyph is rendered rather than upscaled from 32px.
 *
 * No rounded corners here on purpose — iOS applies its own mask, and baking a
 * radius in produces a visible double-corner once it does.
 */
export default async function AppleIcon() {
  const buf = await readFile(
    path.join(process.cwd(), "assets", "InstrumentSerif-Regular.ttf"),
  );
  const displayFont = buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength,
  ) as ArrayBuffer;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Echoes the share card's lit-from-above ground rather than flat ink.
          background:
            "radial-gradient(80% 70% at 50% 0%, #1a1608 0%, #0a0a0b 65%)",
          color: "#c8a24a",
          // Tuned against the measured glyph box, as in `icon.tsx`.
          fontSize: 150,
          lineHeight: 1,
          paddingTop: 6,
          fontFamily: "Instrument Serif",
        }}
      >
        S
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Instrument Serif",
          data: displayFont,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
