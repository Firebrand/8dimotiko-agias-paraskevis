"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { ArrowLeft, ArrowRight, Close, Expand } from "@/components/icons";
import type { Figure } from "@/lib/types";
import { cx, hasImage } from "@/lib/utils";
import { imageSrc } from "@/sanity/image";

type Ready = Figure & { asset: { url: string } };

/** Photo grid with a keyboard-accessible lightbox. */
export function Gallery({ images, title }: { images: Figure[]; title?: string | null }) {
  const ready = images.filter(hasImage) as Ready[];
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (delta: number) => setActive((current) => (current === null ? null : (current + delta + ready.length) % ready.length)),
    [ready.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  if (!ready.length) return null;

  // Two images sit side by side; three or more use a denser mosaic.
  const columns = ready.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <figure className="not-prose my-8">
      {title && (
        <figcaption className="mb-4 font-display text-lg font-bold text-ink">{title}</figcaption>
      )}
      <ul className={cx("grid grid-cols-2 gap-2.5 sm:gap-3", columns)}>
        {ready.map((image, index) => (
          <li key={image._key ?? image.asset.url} className="min-w-0">
            <button
              type="button"
              onClick={() => setActive(index)}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-2xl bg-mist ring-1 ring-black/5 transition-shadow hover:shadow-card-hover"
            >
              <Image
                src={imageSrc(image.asset, 800)}
                alt={image.alt ?? ""}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                {...(image.asset.lqip
                  ? { placeholder: "blur" as const, blurDataURL: image.asset.lqip }
                  : {})}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-white/95 text-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                <Expand className="size-4" />
              </span>
              <span className="sr-only">
                Άνοιγμα φωτογραφίας {index + 1} από {ready.length}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Προβολή φωτογραφίας"
          className="fixed inset-0 z-100 flex flex-col bg-ink/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white/80">
            <p className="text-sm font-medium tabular-nums">
              {active + 1} / {ready.length}
            </p>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="grid size-11 place-items-center rounded-full transition-colors hover:bg-white/15 hover:text-white"
            >
              <span className="sr-only">Κλείσιμο</span>
              <Close className="size-6" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-16">
            <Image
              key={ready[active].asset.url}
              src={imageSrc(ready[active].asset, 1800)}
              alt={ready[active].alt ?? ""}
              width={ready[active].asset.dimensions?.width ?? 1800}
              height={ready[active].asset.dimensions?.height ?? 1200}
              sizes="100vw"
              className="max-h-full w-auto max-w-full rounded-xl object-contain"
              priority
            />

            {ready.length > 1 && (
              <>
                <LightboxNav side="left" onClick={() => step(-1)} />
                <LightboxNav side="right" onClick={() => step(1)} />
              </>
            )}
          </div>

          {(ready[active].caption || ready[active].alt) && (
            <p className="mx-auto max-w-3xl px-6 pb-6 text-center text-sm text-white/75">
              {ready[active].caption || ready[active].alt}
            </p>
          )}
        </div>
      )}
    </figure>
  );
}

function LightboxNav({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/12 text-white backdrop-blur transition-colors hover:bg-white/25",
        side === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4",
      )}
    >
      <span className="sr-only">{side === "left" ? "Προηγούμενη" : "Επόμενη"} φωτογραφία</span>
      <Icon className="size-6" />
    </button>
  );
}
