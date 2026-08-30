import Image from "next/image";
import Link from "next/link";
import { logo } from "@/config/site.config";
import { cn } from "@/lib/utils";

const RATIO = logo.width / logo.height;

/**
 * The site wordmark. Source file, dimensions and the dark-surface behaviour
 * all come from `logo` in src/config/site.config.ts — swapping the brand mark
 * means dropping a file in /public/brand and editing that block.
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
  const knockout = logo.invertOnDark;

  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      height={height}
      width={Math.round(height * RATIO)}
      priority={priority}
      className={cn(
        "object-contain transition-[filter] duration-300",
        knockout &&
          (onDark ? "brightness-0 invert" : "dark:brightness-0 dark:invert"),
        className,
      )}
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
      aria-label={`${logo.alt} — home`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-[6px] transition-opacity hover:opacity-80",
        className,
      )}
    >
      <Logo height={height} priority={priority} onDark={onDark} />
    </Link>
  );
}
