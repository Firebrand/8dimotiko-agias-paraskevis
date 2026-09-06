import Link from "next/link";

import { External, Mail, MapPin, Phone, SOCIAL_ICONS } from "@/components/icons";
import { Logo } from "@/components/logo";
import type { NavItem, SiteSettings } from "@/lib/types";
import { isExternal, navHref } from "@/lib/utils";

export function SiteFooter({
  settings,
  items,
  footerNote,
}: {
  settings: SiteSettings;
  items: NavItem[];
  footerNote?: string | null;
}) {
  const title = settings.shortTitle ?? settings.title ?? "8ο Δημοτικό Αγίας Παρασκευής";
  const columns = items.filter((item) => (item.children ?? []).length > 0);
  const standalone = items.filter((item) => !(item.children ?? []).length && navHref(item) !== "/");

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-white/70">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 size-[34rem] rounded-full bg-brand-600/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-32 size-[30rem] rounded-full bg-sun-500/15 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_repeat(2,minmax(0,1fr))_minmax(0,1fr)]">
          <div>
            <Link href="/" className="inline-flex rounded-2xl">
              <Logo logo={settings.logo} title={title} tone="light" />
            </Link>
            {settings.description && (
              <p className="mt-5 max-w-sm text-sm leading-relaxed">{settings.description}</p>
            )}

            {(settings.socialLinks ?? []).length > 0 && (
              <ul className="mt-6 flex gap-2">
                {(settings.socialLinks ?? []).map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform as keyof typeof SOCIAL_ICONS];
                  if (!Icon || !social.url) return null;
                  return (
                    <li key={social._key}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                      >
                        <span className="sr-only">{social.platform}</span>
                        <Icon className="size-5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {columns.map((column) => (
            <nav key={column._key} aria-labelledby={`footer-${column._key}`}>
              <h2
                id={`footer-${column._key}`}
                className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white"
              >
                {column.label}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {(column.children ?? []).map((child) => (
                  <li key={child._key}>
                    <FooterLink href={navHref(child)} label={child.label} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
              Επικοινωνία
            </h2>
            <ul className="mt-4 space-y-3.5 text-sm">
              {settings.address && (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" />
                  {settings.mapUrl ? (
                    <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                      {settings.address}
                    </a>
                  ) : (
                    <span>{settings.address}</span>
                  )}
                </li>
              )}
              {settings.phone && (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-300" />
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-white">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand-300" />
                  <a href={`mailto:${settings.email}`} className="break-all hover:text-white">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>

            {standalone.length > 0 && (
              <ul className="mt-6 space-y-2.5 text-sm">
                {standalone.map((item) => (
                  <li key={item._key}>
                    <FooterLink href={navHref(item)} label={item.label} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{footerNote || `© ${new Date().getFullYear()} ${settings.title ?? title}`}</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/anazitisi" className="hover:text-white">
              Αναζήτηση
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white">
              Χάρτης ιστότοπου
            </Link>
            {/* A plain anchor, not a Link: the Studio has to load in its own
                document. Soft-navigating into it appends @sanity/ui's global
                stylesheet to the shared head, and its `* { margin: 0; padding: 0 }`
                reset lives in a cascade layer declared after Tailwind's — so it
                outranks every spacing utility. The stylesheet is never removed,
                which left the site unstyled after a press of the back button. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/studio" className="hover:text-white">
              Διαχείριση
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const external = isExternal(href);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-start gap-1.5 transition-colors hover:text-white"
    >
      <span className="text-balance">{label}</span>
      {external && <External className="mt-1 size-3 shrink-0 opacity-60" />}
    </Link>
  );
}
