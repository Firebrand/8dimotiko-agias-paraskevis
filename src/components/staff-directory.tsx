import { Clock } from "@/components/icons";
import type { StaffMember, StaffSection } from "@/lib/types";

const SECTIONS: { key: StaffSection; title: string; hint?: string }[] = [
  { key: "management", title: "Διεύθυνση" },
  { key: "teacher", title: "Δάσκαλοι ανά τμήμα" },
  { key: "specialty", title: "Ειδικότητες" },
  { key: "inclusion", title: "Τμήμα Ένταξης" },
  {
    key: "parallel",
    title: "Εκπαιδευτικοί Παράλληλης Στήριξης",
    hint: "Η επικοινωνία γίνεται κατόπιν συνεννόησης με τους γονείς.",
  },
];

export function StaffDirectory({ members }: { members: StaffMember[] }) {
  if (!members.length) return null;

  return (
    <div className="space-y-12">
      {SECTIONS.map((section) => {
        const people = members.filter((member) => member.section === section.key);
        if (!people.length) return null;

        return (
          <section key={section.key}>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-extrabold text-ink">{section.title}</h2>
              <span className="h-px flex-1 bg-gradient-to-r from-brand-200 to-transparent" />
            </div>
            {section.hint && <p className="mt-2 text-sm text-ink-soft">{section.hint}</p>}

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {people.map((member) => (
                <li key={member._id}>
                  <div className="flex h-full items-start gap-4 rounded-3xl border border-black/6 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover sm:p-5">
                    <span
                      aria-hidden
                      className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-center font-display text-sm font-extrabold leading-none text-white"
                    >
                      {member.role ? shortLabel(member.role) : initials(member.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      {member.role && (
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-600">
                          {member.role}
                        </p>
                      )}
                      <p className="mt-0.5 font-display text-[0.98rem] font-bold leading-snug text-ink">
                        {member.name}
                      </p>
                      {member.contactHours && (
                        <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-ink-soft">
                          <Clock className="mt-0.5 size-3.5 shrink-0 opacity-60" />
                          <span>{member.contactHours}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/** Class labels like "ΣΤ1" fit the badge; longer specialities get initials. */
function shortLabel(role: string) {
  return role.length <= 4 ? role : initials(role);
}

function initials(value: string) {
  return value
    .split(/[\s–-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}
