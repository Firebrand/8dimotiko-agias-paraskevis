import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

import { Download, Info, Play } from "@/components/icons";
import { Gallery } from "@/components/gallery";
import { SanityImage } from "@/components/sanity-image";
import type {
  AudioBlock,
  CalloutBlock,
  FigureBlock,
  FileBlock,
  GalleryBlock,
  PortableTextBlocks,
  TableBlock,
  VideoBlock,
} from "@/lib/types";
import { cx, formatFileSize, hasImage } from "@/lib/utils";

const CALLOUT_TONES = {
  info: "border-brand-200 bg-brand-50 text-brand-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-sun-200 bg-sun-50 text-sun-900",
} as const;

const components: PortableTextComponents = {
  block: {
    // WordPress used <br> for line breaks, so newlines inside a block matter.
    normal: ({ children }) => <p className="whitespace-pre-line">{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote className="whitespace-pre-line">{children}</blockquote>,
  },

  // List items carry <br>-derived newlines too, so they need the same treatment.
  listItem: {
    bullet: ({ children }) => <li className="whitespace-pre-line">{children}</li>,
    number: ({ children }) => <li className="whitespace-pre-line">{children}</li>,
  },

  marks: {
    underline: ({ children }) => <span className="underline decoration-brand-300 decoration-2">{children}</span>,
    link: ({ children, value }) => {
      const href = (value?.href as string | undefined) ?? "#";
      const external = /^https?:\/\//i.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noreferrer nofollow" } : {})}>
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => {
      const slug = value?.slug as string | undefined;
      const docType = value?.docType as string | undefined;
      if (!slug) return <>{children}</>;
      return <Link href={docType === "post" ? `/nea/${slug}` : `/${slug}`}>{children}</Link>;
    },
  },

  types: {
    figure: ({ value }: { value: FigureBlock }) => {
      if (!hasImage(value)) return null;
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-3xl bg-mist ring-1 ring-black/5">
            <SanityImage
              image={value}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-ink-soft/80">{value.caption}</figcaption>
          )}
        </figure>
      );
    },

    gallery: ({ value }: { value: GalleryBlock }) => (
      <Gallery images={value.images ?? []} title={value.title} />
    ),

    fileAttachment: ({ value }: { value: FileBlock }) => {
      const asset = value.file?.asset;
      if (!asset?.url) return null;
      const extension = (asset.extension ?? "").toUpperCase();
      return (
        <a
          href={`${asset.url}?dl=`}
          className="group my-6 flex items-center gap-4 rounded-3xl border border-black/8 bg-white p-4 no-underline shadow-card transition-shadow hover:shadow-card-hover sm:p-5"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-white">
            <Download className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[0.98rem] font-bold text-ink group-hover:text-brand-700">
              {value.title ?? asset.originalFilename ?? "Αρχείο"}
            </span>
            <span className="mt-0.5 block text-xs font-medium uppercase tracking-wide text-ink-soft/70">
              {[extension, formatFileSize(asset.size), value.description].filter(Boolean).join(" · ")}
            </span>
          </span>
          <span className="hidden shrink-0 text-sm font-semibold text-brand-600 sm:block">Λήψη</span>
        </a>
      );
    },

    dataTable: ({ value }: { value: TableBlock }) => {
      const rows = value.rows ?? [];
      if (!rows.length) return null;
      const [head, ...body] = value.hasHeaderRow ? rows : [null, ...rows];

      return (
        <figure className="my-8">
          {value.caption && (
            <figcaption className="mb-3 font-display text-base font-bold text-ink">{value.caption}</figcaption>
          )}
          <div className="overflow-x-auto rounded-3xl border border-black/8 shadow-card">
            <table className="w-full min-w-160 border-collapse text-left text-sm">
              {head && (
                <thead>
                  <tr className="bg-brand-600 text-white">
                    {(head.cells ?? []).map((cell, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-4 py-3.5 font-display text-xs font-bold uppercase tracking-wider"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-black/6 bg-white">
                {body.map((row) => (
                  <tr key={row!._key} className="transition-colors hover:bg-brand-50/60">
                    {(row!.cells ?? []).map((cell, index) => (
                      <td
                        key={index}
                        className={cx(
                          "px-4 py-3.5 align-top text-ink-soft",
                          index === 0 && "font-semibold text-ink",
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    },

    videoEmbed: ({ value }: { value: VideoBlock }) => {
      const fileUrl = value.file?.asset?.url;
      const poster = hasImage(value.poster) ? value.poster.asset.url : undefined;

      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-3xl bg-ink shadow-card">
            {fileUrl ? (
              <video controls preload="metadata" poster={poster} className="aspect-video w-full">
                <source src={fileUrl} type={value.file?.asset?.mimeType ?? "video/mp4"} />
                Ο περιηγητής σας δεν υποστηρίζει την αναπαραγωγή βίντεο.
              </video>
            ) : value.url ? (
              <iframe
                src={value.url}
                title={value.title ?? "Βίντεο"}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full border-0"
              />
            ) : null}
          </div>
          {value.title && (
            <figcaption className="mt-3 flex items-center justify-center gap-2 text-sm text-ink-soft/80">
              <Play className="size-4 shrink-0" />
              {value.title}
            </figcaption>
          )}
        </figure>
      );
    },

    audioEmbed: ({ value }: { value: AudioBlock }) => {
      const url = value.file?.asset?.url;
      if (!url) return null;
      return (
        <figure className="my-6 rounded-3xl border border-black/8 bg-mist p-4 sm:p-5">
          {value.title && (
            <figcaption className="mb-3 font-display text-[0.98rem] font-bold text-ink">
              {value.title}
            </figcaption>
          )}
          <audio controls preload="metadata" src={url} className="w-full">
            Ο περιηγητής σας δεν υποστηρίζει την αναπαραγωγή ήχου.
          </audio>
        </figure>
      );
    },

    callout: ({ value }: { value: CalloutBlock }) => (
      <aside
        className={cx(
          "my-8 rounded-3xl border p-5 sm:p-6",
          CALLOUT_TONES[value.tone ?? "info"],
        )}
      >
        <div className="flex gap-3.5">
          <Info className="mt-0.5 size-5 shrink-0 opacity-70" />
          <div className="min-w-0">
            {value.title && (
              <p className="font-display text-base font-bold">{value.title}</p>
            )}
            {value.text && (
              <div className="mt-1 [&>*+*]:mt-2 [&_p]:text-[0.97rem] [&_p]:leading-relaxed">
                <PortableText value={value.text} components={components} />
              </div>
            )}
          </div>
        </div>
      </aside>
    ),
  },
};

export function RichText({ value, className }: { value?: PortableTextBlocks | null; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cx("rich-text", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
