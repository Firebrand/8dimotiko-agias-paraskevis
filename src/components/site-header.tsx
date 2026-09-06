"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChevronDown, Close, External, Menu, Search } from "@/components/icons";
import { Logo } from "@/components/logo";
import type { Figure, NavItem } from "@/lib/types";
import { cx, isExternal, navHref } from "@/lib/utils";

export function SiteHeader({
  items,
  title,
  logo,
}: {
  items: NavItem[];
  title: string;
  logo?: Figure | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navigating anywhere dismisses the open menus. Adjusting state during render
  // is the React-recommended alternative to an effect here.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenGroup(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scrolling while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenGroup(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled ? "bg-white/85 shadow-[0_1px_0_rgb(15_18_34/0.07)] backdrop-blur-xl" : "bg-white/60 backdrop-blur-sm",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Μετάβαση στο περιεχόμενο
      </a>

      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 rounded-2xl" aria-label={`${title} — Αρχική`}>
          <Logo logo={logo} title={title} />
        </Link>

        <nav aria-label="Κύριο μενού" className="ml-auto hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const href = navHref(item);
            const children = item.children ?? [];
            const active = isActive(href);

            if (!children.length) {
              return (
                <NavTopLink key={item._key} href={href} active={active} label={item.label} />
              );
            }

            return (
              <div
                key={item._key}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenGroup(item._key);
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-expanded={openGroup === item._key}
                  onClick={() => setOpenGroup(openGroup === item._key ? null : item._key)}
                  className={cx(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                    active || openGroup === item._key
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-soft hover:bg-mist hover:text-ink",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cx(
                      "size-4 transition-transform duration-200",
                      openGroup === item._key && "rotate-180",
                    )}
                  />
                </button>

                <div
                  className={cx(
                    "absolute left-1/2 top-full w-80 -translate-x-1/2 pt-2 transition-all duration-200",
                    openGroup === item._key
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0",
                  )}
                >
                  <ul className="overflow-hidden rounded-3xl border border-black/5 bg-white p-2 shadow-card">
                    <li>
                      <DropdownLink href={href} label={`Επισκόπηση: ${item.label}`} muted />
                    </li>
                    {children.map((child) => (
                      <li key={child._key}>
                        <DropdownLink href={navHref(child)} label={child.label} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          <Link
            href="/anazitisi"
            aria-label="Αναζήτηση"
            className="ml-1 grid size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-mist hover:text-ink"
          >
            <Search className="size-5" />
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <Link
            href="/anazitisi"
            aria-label="Αναζήτηση"
            className="grid size-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-mist"
          >
            <Search className="size-5" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-mist"
          >
            <span className="sr-only">{mobileOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}</span>
            {mobileOpen ? <Close className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-black/5 bg-white px-4 pb-8 pt-3 lg:hidden"
      >
        <ul className="space-y-1">
          {items.map((item) => {
            const href = navHref(item);
            const children = item.children ?? [];
            return (
              <li key={item._key}>
                <Link
                  href={href}
                  target={isExternal(href) ? "_blank" : undefined}
                  rel={isExternal(href) ? "noreferrer" : undefined}
                  className={cx(
                    "flex items-center justify-between rounded-2xl px-4 py-3 font-display text-base font-bold",
                    isActive(href) ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-mist",
                  )}
                >
                  {item.label}
                  {isExternal(href) && <External className="size-4 opacity-60" />}
                </Link>
                {children.length > 0 && (
                  <ul className="mb-2 ml-4 space-y-0.5 border-l-2 border-brand-100 pl-3">
                    {children.map((child) => (
                      <li key={child._key}>
                        <Link
                          href={navHref(child)}
                          className={cx(
                            "block rounded-xl px-3 py-2.5 text-[0.95rem] transition-colors",
                            isActive(navHref(child))
                              ? "font-semibold text-brand-700"
                              : "text-ink-soft hover:bg-mist hover:text-ink",
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

function NavTopLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  const external = isExternal(href);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cx(
        "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
        active ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-mist hover:text-ink",
      )}
    >
      {label}
      {external && <External className="size-3.5 opacity-60" />}
    </Link>
  );
}

function DropdownLink({ href, label, muted }: { href: string; label: string; muted?: boolean }) {
  const external = isExternal(href);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cx(
        "flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm transition-colors",
        muted
          ? "font-medium text-ink-soft/80 hover:bg-mist hover:text-ink"
          : "font-semibold text-ink hover:bg-brand-50 hover:text-brand-700",
      )}
    >
      <span className="text-balance">{label}</span>
      {external && <External className="size-3.5 shrink-0 opacity-60" />}
    </Link>
  );
}
