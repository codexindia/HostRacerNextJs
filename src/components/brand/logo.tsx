import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import logoSrc from "../../../public/brand/logo.png";

const RATIO = 1288 / 220;

/**
 * The Hostracer wordmark.
 *
 * The source PNG is a violet→indigo gradient, which reads well on light
 * surfaces but drops to ~3.1:1 on ink-950 at the indigo end — the "RACER" half
 * visibly fades. On dark surfaces we knock it out to solid white instead
 * (19.7:1). `onDark` forces that; dark *theme* gets it automatically.
 */
export function Logo({
  height = 30,
  className,
  priority,
  onDark,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
  /** Force the white knockout — for dark bands inside a light theme. */
  onDark?: boolean;
}) {
  return (
    <Image
      src={logoSrc}
      alt="Hostracer"
      height={height}
      width={Math.round(height * RATIO)}
      priority={priority}
      className={cn(
        "h-auto w-auto object-contain transition-[filter] duration-300",
        onDark
          ? "brightness-0 invert"
          : "dark:brightness-0 dark:invert",
        className,
      )}
      style={{ height }}
    />
  );
}

export function LogoLink({
  height,
  className,
  priority,
  onDark,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Hostracer — home"
      className={cn(
        "inline-flex shrink-0 items-center rounded-[6px] transition-opacity hover:opacity-80",
        className,
      )}
    >
      <Logo height={height} priority={priority} onDark={onDark} />
    </Link>
  );
}
