import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card is generated at build time rather than maintained as a static
 * asset — change the name or role in content/site.ts and the card follows.
 *
 * Satori (which powers ImageResponse) has no access to next/font's webfonts and
 * no system font stack, so the display face is loaded explicitly from a local
 * TTF. Without this the name renders in Satori's default sans and the card
 * stops looking like the site.
 */
export default async function Image() {
  // Satori's font loader wants a plain ArrayBuffer; a Node Buffer is accepted
  // silently and then ignored, which shows up as the type falling back to sans.
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
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(80% 60% at 50% 0%, #1a1608 0%, #0a0a0b 60%)",
          padding: "72px",
          color: "#edeae4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#c8a24a",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8c8880",
            }}
          >
            {`${site.location} · ${site.timezone}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 108,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              fontFamily: "Instrument Serif",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              color: "#8c8880",
              letterSpacing: "-0.01em",
            }}
          >
            {site.role}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(237,234,228,0.14)",
            paddingTop: "32px",
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8c8880",
          }}
        >
          <div>{site.tagline}</div>
          <div style={{ color: "#c8a24a" }}>
            {site.availability.open ? "Available for work" : "Currently booked"}
          </div>
        </div>
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
