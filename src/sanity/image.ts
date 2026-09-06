import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/** Ready-to-use `src` for a fixed width, consumed by next/image as a plain URL. */
export function imageSrc(source: SanityImageSource, width: number, quality = 75) {
  return urlForImage(source).width(width).quality(quality).url();
}
