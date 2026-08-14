import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Browser-tab mark. The project previously shipped Next's stock Vercel triangle,
 * which is the framework's logo rather than anyone's brand.
 *
 * Generated at build time from the same Instrument Serif face as the wordmark and
 * the share card, so the three cannot drift. Satori cannot see next/font webfonts,
 * hence the explicit TTF read — the same constraint documented in
 * `opengraph-image.tsx`.
 *
 * Deliberately a solid ink tile rather than a transparent glyph: a favicon sits on
 * browser chrome whose colour we do not control, and a bare gold letter on a light
 * tab strip loses most of its contrast. The tile guarantees the same reading in
 * both themes.
 */
export default async function Icon() {
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
          background: "#0a0a0b",
          color: "#c8a24a",
          // The serif S renders high in its own em box, so flex centring alone
          // leaves it visibly top-heavy; the top padding pushes it back onto the
          // optical centre. Values tuned by measuring the rendered glyph's
          // bounding box, not by eye.
          fontSize: 32,
          lineHeight: 1,
          paddingTop: 1,
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
