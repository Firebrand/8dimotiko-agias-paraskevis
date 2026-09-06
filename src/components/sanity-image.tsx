import Image from "next/image";

import type { Figure } from "@/lib/types";
import { cx } from "@/lib/utils";
import { imageSrc } from "@/sanity/image";

type Props = {
  image: Figure & { asset: { url: string } };
  sizes: string;
  className?: string;
  /** Rendered with `fill` inside a positioned parent when true. */
  fill?: boolean;
  width?: number;
  priority?: boolean;
};

/**
 * Thin wrapper over next/image that feeds it Sanity's CDN URL plus the blur
 * placeholder Sanity generates for every upload.
 */
export function SanityImage({ image, sizes, className, fill, width = 1600, priority }: Props) {
  const { asset } = image;
  const dimensions = asset.dimensions;
  const blur = asset.lqip
    ? ({ placeholder: "blur", blurDataURL: asset.lqip } as const)
    : ({ placeholder: "empty" } as const);

  if (fill) {
    return (
      <Image
        src={imageSrc(asset, width)}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className={cx("object-cover", className)}
        {...blur}
      />
    );
  }

  return (
    <Image
      src={imageSrc(asset, width)}
      alt={image.alt ?? ""}
      width={dimensions?.width ?? width}
      height={dimensions?.height ?? Math.round(width / 1.5)}
      sizes={sizes}
      priority={priority}
      className={className}
      {...blur}
    />
  );
}
