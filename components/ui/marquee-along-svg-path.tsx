"use client";

import React, {
  RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import {
  motion,
  MotionValue,
  SpringOptions,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Items travelling along an arbitrary SVG path, via CSS `offset-path`.
 *
 * Two changes from the source this was adapted from:
 *
 * 1. **Per-item hooks moved into `MarqueeItem`.** The original called
 *    `useMotionValue` / `useTransform` / `useEffect` inside `items.map()`, and
 *    `useTransform` again inside an `Object.fromEntries(...map())` for the CSS
 *    variables. That only holds while `items.length` never changes — the moment
 *    `repeat` or `children` change, hook order desyncs and React throws
 *    "rendered fewer hooks than expected". Each item is now its own component, so
 *    every hook is called unconditionally at that component's top level.
 *
 * 2. **Reduced-motion support.** The original ran `useAnimationFrame` unconditionally,
 *    an unbounded loop regardless of user preference. It now freezes at the resting
 *    layout, so items stay laid out along the path but nothing moves.
 */

const wrap = (min: number, max: number, value: number): number => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax";

interface CSSVariableInterpolation {
  property: string;
  from: number | string;
  to: number | string;
}

type PreserveAspectRatioMeetOrSlice = "meet" | "slice";

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`;

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  className?: string;

  path: string;
  pathId?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;

  width?: string | number;
  height?: string | number;
  viewBox?: string;

  baseVelocity?: number;
  direction?: "normal" | "reverse";
  easing?: (value: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  slowDownSpringConfig?: SpringOptions;

  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  scrollSpringConfig?: SpringOptions;
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null;

  repeat?: number;

  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  grabCursor?: boolean;

  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;

  cssVariableInterpolation?: CSSVariableInterpolation[];

  responsive?: boolean;
}

/**
 * One item on the path. Every hook lives here, at a stable top level, so the hook
 * count per component instance never varies.
 */
function MarqueeItem({
  child,
  itemIndex,
  itemCount,
  baseOffset,
  path,
  easing,
  draggable,
  grabCursor,
  calculateZIndex,
  enableRollingZIndex,
  cssVariableInterpolation,
  isHoveredRef,
  ariaHidden,
}: {
  child: React.ReactNode;
  itemIndex: number;
  itemCount: number;
  baseOffset: MotionValue<number>;
  path: string;
  easing?: (value: number) => number;
  draggable: boolean;
  grabCursor: boolean;
  calculateZIndex: (offsetDistance: number) => number | undefined;
  enableRollingZIndex: boolean;
  cssVariableInterpolation: CSSVariableInterpolation[];
  isHoveredRef: React.MutableRefObject<boolean>;
  ariaHidden: boolean;
}) {
  const itemOffset = useTransform(baseOffset, (v) => {
    const position = (itemIndex * 100) / itemCount;
    const wrapped = wrap(0, 100, v + position);
    return `${easing ? easing(wrapped / 100) * 100 : wrapped}%`;
  });

  const currentOffsetDistance = useMotionValue(0);
  const zIndex = useTransform(currentOffsetDistance, (value) =>
    calculateZIndex(value),
  );

  useEffect(() => {
    const unsubscribe = itemOffset.on("change", (value: string) => {
      const match = /^([\d.]+)%$/.exec(value);
      if (match?.[1]) currentOffsetDistance.set(parseFloat(match[1]));
    });
    return unsubscribe;
  }, [itemOffset, currentOffsetDistance]);

  // Fixed-length: `cssVariableInterpolation` is a stable prop for a given usage, and
  // the hook count here is constant for the life of the component.
  const varEntries = cssVariableInterpolation.map(({ property, from, to }) => [
    property,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(currentOffsetDistance, [0, 100], [from, to]),
  ]);
  const cssVariables = Object.fromEntries(varEntries);

  return (
    <motion.div
      className={cn("absolute top-0 left-0", draggable && grabCursor && "cursor-grab")}
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        zIndex: enableRollingZIndex ? zIndex : undefined,
        willChange: "offset-distance",
        backfaceVisibility: "hidden",
        ...cssVariables,
      }}
      aria-hidden={ariaHidden}
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => (isHoveredRef.current = false)}
    >
      {child}
    </motion.div>
  );
}

const MarqueeAlongSvgPath = ({
  children,
  className,

  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",

  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },

  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,

  repeat = 3,

  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,

  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,

  cssVariableInterpolation = [],

  responsive = false,
}: MarqueeAlongSvgPathProps) => {
  const container = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);
  const reduced = useReducedMotion();

  // Responsive scaling by direct DOM writes — going through state here would
  // re-render every item on each resize frame.
  useEffect(() => {
    if (!responsive) return;

    const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
    const originalWidth = vbWidth || 100;
    const originalHeight = vbHeight || 100;

    const updateScale = () => {
      const wrapper = container.current;
      const marqueeContainer = marqueeContainerRef.current;
      if (!wrapper || !marqueeContainer) return;

      const scale = Math.min(
        wrapper.clientWidth / originalWidth,
        wrapper.clientHeight / originalHeight,
      );

      const offsetX = (wrapper.clientWidth - originalWidth * scale) / 2;
      const offsetY = (wrapper.clientHeight - originalHeight * scale) / 2;

      marqueeContainer.style.width = `${originalWidth}px`;
      marqueeContainer.style.height = `${originalHeight}px`;
      marqueeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      marqueeContainer.style.transformOrigin = "top left";
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (container.current) ro.observe(container.current);
    window.addEventListener("resize", updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [responsive, viewBox]);

  const items = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => ({
        child,
        repeatIndex,
        itemIndex: repeatIndex * childrenArray.length + childIndex,
        key: `${childIndex}-${repeatIndex}`,
      })),
    );
  }, [children, repeat]);

  const calculateZIndex = useCallback(
    (offsetDistance: number) => {
      if (!enableRollingZIndex) return undefined;
      return Math.floor(zIndexBase + (offsetDistance / 100) * zIndexRange);
    },
    [enableRollingZIndex, zIndexBase, zIndexRange],
  );

  // useId rather than Math.random: the original was impure during render and
  // produced a different id on server and client, which is a hydration mismatch.
  const generatedId = useId();
  const id = pathId ?? `marquee-path-${generatedId.replace(/:/g, "")}`;

  const { scrollY } = useScroll({
    container: (scrollContainer as RefObject<HTMLDivElement | null>) || container,
  });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig);

  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);
  const directionFactor = useRef(direction === "normal" ? 1 : -1);

  const hoverFactorValue = useMotionValue(1);
  const defaultVelocity = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig);

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false },
  );

  useAnimationFrame((_, delta) => {
    // Frozen for anyone who asked for reduced motion — items stay on the path,
    // nothing animates.
    if (reduced) return;

    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current);
      dragVelocity.current *= 0.9;
      if (Math.abs(dragVelocity.current) < 0.01) dragVelocity.current = 0;
      return;
    }

    hoverFactorValue.set(
      isHovered.current && slowdownOnHover ? slowDownFactor : 1,
    );

    let moveBy =
      directionFactor.current *
      baseVelocity *
      (delta / 1000) *
      smoothHoverFactor.get();

    if (scrollAwareDirection && !isDragging.current) {
      if (velocityFactor.get() < 0) directionFactor.current = -1;
      else if (velocityFactor.get() > 0) directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    if (draggable) {
      moveBy += dragVelocity.current;
      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocity.current);
      }
      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay;
      } else if (!isDragging.current) {
        dragVelocity.current = 0;
      }
    }

    baseOffset.set(baseOffset.get() + moveBy);
  });

  const lastPointerPosition = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable || reduced) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (grabCursor) (e.currentTarget as HTMLElement).style.cursor = "grabbing";
    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return;
    const deltaX = e.clientX - lastPointerPosition.current.x;
    const deltaY = e.clientY - lastPointerPosition.current.y;
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    dragVelocity.current = (deltaX > 0 ? magnitude : -magnitude) * dragSensitivity;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    isDragging.current = false;
    if (grabCursor) (e.currentTarget as HTMLElement).style.cursor = "grab";
  };

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("relative", className)}
    >
      <div
        ref={marqueeContainerRef}
        className="relative"
        style={{ contain: "layout style" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="h-full w-full"
          aria-hidden
        >
          <path
            id={id}
            d={path}
            stroke={showPath ? "currentColor" : "none"}
            fill="none"
          />
        </svg>

        {items.map(({ child, repeatIndex, itemIndex, key }) => (
          <MarqueeItem
            key={key}
            child={child}
            itemIndex={itemIndex}
            itemCount={items.length}
            baseOffset={baseOffset}
            path={path}
            easing={easing}
            draggable={draggable}
            grabCursor={grabCursor}
            calculateZIndex={calculateZIndex}
            enableRollingZIndex={enableRollingZIndex}
            cssVariableInterpolation={cssVariableInterpolation}
            isHoveredRef={isHovered}
            // Repeats are visual padding for the loop; only the first pass is
            // exposed to assistive tech.
            ariaHidden={repeatIndex > 0}
          />
        ))}
      </div>
    </div>
  );
};

export default MarqueeAlongSvgPath;
