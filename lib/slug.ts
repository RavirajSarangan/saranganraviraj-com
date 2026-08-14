/**
 * Heading → anchor id. Shared by the post renderer and the table of contents so the
 * two can never disagree about what an anchor is called.
 */
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
