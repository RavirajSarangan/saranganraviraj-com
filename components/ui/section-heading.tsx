import type { ReactNode } from "react";
import { MaskText, RuleLine } from "./reveal";

/**
 * Consistent section opener: a hairline, a mono eyebrow with an index,
 * and the display heading. Repeating this exactly is what makes the page
 * feel like one system rather than a stack of blocks.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  aside,
  className = "",
}: {
  eyebrow: string;
  index?: string;
  title: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <RuleLine />
      <div className="flex items-baseline justify-between gap-6 pt-5">
        <span className="label">
          {index ? <span className="text-accent">{index}</span> : null}
          {index ? " / " : ""}
          {eyebrow}
        </span>
        {aside ? <span className="label hidden sm:block">{aside}</span> : null}
      </div>

      <MaskText
        as="h2"
        text={title}
        className="display-lg mt-10 max-w-[16ch] text-fg sm:mt-14"
      />
    </div>
  );
}
