import { Clock, External, Mail, MapPin, Phone } from "@/components/icons";
import type { SiteSettings } from "@/lib/types";

/** Contact details plus an embedded map, reused by pages that opt in. */
export function ContactPanel({ settings }: { settings: SiteSettings }) {
  const rows = [
    settings.address && {
      icon: MapPin,
      label: "Διεύθυνση",
      value: settings.address,
      href: settings.mapUrl ?? undefined,
      external: true,
    },
    settings.phone && {
      icon: Phone,
      label: "Τηλέφωνο",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s+/g, "")}`,
    },
    settings.email && {
      icon: Mail,
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings.officeHours && {
      icon: Clock,
      label: "Ώρες γραμματείας",
      value: settings.officeHours,
    },
  ].filter(Boolean) as {
    icon: typeof MapPin;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }[];

  if (!rows.length && !settings.mapEmbedUrl) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="flex h-full items-start gap-4 rounded-3xl border border-black/6 bg-white p-5 shadow-card">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <row.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-soft/60">
                  {row.label}
                </p>
                {row.href ? (
                  <a
                    href={row.href}
                    {...(row.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="mt-1 inline-flex items-start gap-1.5 font-display text-[0.98rem] font-bold text-ink transition-colors hover:text-brand-700"
                  >
                    <span className="break-words">{row.value}</span>
                    {row.external && <External className="mt-1 size-3.5 shrink-0 opacity-50" />}
                  </a>
                ) : (
                  <p className="mt-1 font-display text-[0.98rem] font-bold text-ink">{row.value}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {settings.mapEmbedUrl && (
        <div className="min-h-72 overflow-hidden rounded-3xl border border-black/6 bg-mist shadow-card">
          <iframe
            src={settings.mapEmbedUrl}
            title="Χάρτης — η θέση του σχολείου"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full min-h-72 border-0"
          />
        </div>
      )}
    </div>
  );
}
