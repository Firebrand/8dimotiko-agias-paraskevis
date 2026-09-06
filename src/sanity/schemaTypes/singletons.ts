import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ρυθμίσεις ιστότοπου",
  type: "document",
  groups: [
    { name: "general", title: "Γενικά", default: true },
    { name: "hero", title: "Αρχική σελίδα" },
    { name: "contact", title: "Επικοινωνία" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Όνομα σχολείου",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortTitle",
      title: "Σύντομο όνομα",
      type: "string",
      group: "general",
      description: 'Εμφανίζεται στο λογότυπο, π.χ. "8ο Δημοτικό Αγίας Παρασκευής".',
    }),
    defineField({
      name: "description",
      title: "Περιγραφή ιστότοπου",
      type: "text",
      rows: 3,
      group: "general",
      description: "Χρησιμοποιείται από τη Google και τα μέσα κοινωνικής δικτύωσης.",
    }),
    defineField({
      name: "logo",
      title: "Λογότυπο / έμβλημα",
      type: "image",
      group: "general",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroTitle",
      title: "Κύριος τίτλος αρχικής",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroText",
      title: "Κείμενο αρχικής",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroImages",
      title: "Φωτογραφίες αρχικής",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "figure" })],
      options: { layout: "grid" },
      description: "Εναλλάσσονται στην κορυφή της αρχικής σελίδας.",
    }),
    defineField({
      name: "highlights",
      title: "Γρήγορες πληροφορίες",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({
          name: "highlight",
          type: "object",
          fields: [
            defineField({ name: "value", title: "Τιμή", type: "string" }),
            defineField({ name: "label", title: "Ετικέτα", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
      description: 'Π.χ. "11 τμήματα", "Ολοήμερο έως 15:50".',
    }),
    defineField({
      name: "quickLinks",
      title: "Γρήγοροι σύνδεσμοι",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({
          name: "quickLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Ετικέτα",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "description", title: "Περιγραφή", type: "string" }),
            defineField({
              name: "href",
              title: "Διεύθυνση",
              type: "string",
              description: 'Εσωτερική (π.χ. "/nea") ή εξωτερική διεύθυνση.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Εικονίδιο",
              type: "string",
              initialValue: "info",
              options: {
                list: [
                  { title: "Πληροφορία", value: "info" },
                  { title: "Ημερολόγιο", value: "calendar" },
                  { title: "Έγγραφο", value: "document" },
                  { title: "Άνθρωποι", value: "people" },
                  { title: "Τοποθεσία", value: "map" },
                  { title: "Ρολόι", value: "clock" },
                ],
              },
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "address",
      title: "Διεύθυνση",
      type: "string",
      group: "contact",
    }),
    defineField({ name: "phone", title: "Τηλέφωνο", type: "string", group: "contact" }),
    defineField({ name: "fax", title: "Φαξ", type: "string", group: "contact" }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({
      name: "mapUrl",
      title: "Σύνδεσμος Google Maps",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Ενσωματωμένος χάρτης (embed URL)",
      type: "url",
      group: "contact",
      description: "Google Maps → Κοινή χρήση → Ενσωμάτωση χάρτη → αντιγράψτε τη διεύθυνση src.",
    }),
    defineField({
      name: "officeHours",
      title: "Ώρες γραμματείας",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "parentsAssociationUrl",
      title: "Ιστοσελίδα Συλλόγου Γονέων",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "socialLinks",
      title: "Κοινωνικά δίκτυα",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          name: "social",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Δίκτυο",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "YouTube", value: "youtube" },
                ],
              },
            }),
            defineField({ name: "url", title: "Διεύθυνση", type: "url" }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Ρυθμίσεις ιστότοπου" }) },
});

export const announcement = defineType({
  name: "announcement",
  title: "Ανακοίνωση (μπάρα)",
  type: "document",
  description: "Η ταινία που εμφανίζεται στην κορυφή κάθε σελίδας.",
  fields: [
    defineField({
      name: "enabled",
      title: "Ενεργή",
      type: "boolean",
      initialValue: false,
      description: "Απενεργοποιήστε την για να κρύψετε τη μπάρα από όλο τον ιστότοπο.",
    }),
    defineField({
      name: "text",
      title: "Κείμενο",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          const enabled = (context.document as { enabled?: boolean } | undefined)?.enabled;
          return enabled && !value ? "Συμπληρώστε το κείμενο της ανακοίνωσης." : true;
        }),
    }),
    defineField({
      name: "tone",
      title: "Χρωματισμός",
      type: "string",
      initialValue: "info",
      options: {
        list: [
          { title: "Πληροφορία (μπλε)", value: "info" },
          { title: "Σημαντικό (πορτοκαλί)", value: "warning" },
          { title: "Επείγον (κόκκινο)", value: "urgent" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "linkLabel", title: "Ετικέτα συνδέσμου", type: "string" }),
    defineField({
      name: "linkHref",
      title: "Διεύθυνση συνδέσμου",
      type: "string",
      description: 'Εσωτερική (π.χ. "/nea/agiasmos") ή πλήρης διεύθυνση.',
    }),
    defineField({
      name: "expiresAt",
      title: "Λήγει στις",
      type: "datetime",
      description: "Μετά από αυτή την ημερομηνία η μπάρα κρύβεται αυτόματα.",
    }),
  ],
  preview: {
    select: { title: "text", enabled: "enabled", tone: "tone" },
    prepare: ({ title, enabled, tone }) => ({
      title: title || "Ανακοίνωση",
      subtitle: enabled ? `Ενεργή · ${tone}` : "Ανενεργή",
    }),
  },
});

const navLink = defineArrayMember({
  name: "navLink",
  title: "Σύνδεσμος",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Ετικέτα",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "page",
      title: "Σελίδα του ιστότοπου",
      type: "reference",
      to: [{ type: "page" }],
    }),
    defineField({
      name: "href",
      title: "Ή χειροκίνητη διεύθυνση",
      type: "string",
      description: 'Π.χ. "/nea" ή "https://syllogos8agp.gr". Αγνοείται αν έχει επιλεγεί σελίδα.',
    }),
  ],
  preview: {
    select: { title: "label", href: "href", pageSlug: "page.slug.current" },
    prepare: ({ title, href, pageSlug }) => ({
      title,
      subtitle: pageSlug ? `/${pageSlug}` : href,
    }),
  },
});

export const navigation = defineType({
  name: "navigation",
  title: "Μενού πλοήγησης",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Στοιχεία μενού",
      type: "array",
      of: [
        defineArrayMember({
          name: "navGroup",
          title: "Στοιχείο μενού",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Ετικέτα",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "page",
              title: "Σελίδα του ιστότοπου",
              type: "reference",
              to: [{ type: "page" }],
            }),
            defineField({
              name: "href",
              title: "Ή χειροκίνητη διεύθυνση",
              type: "string",
            }),
            defineField({
              name: "children",
              title: "Υπομενού",
              type: "array",
              of: [navLink],
            }),
          ],
          preview: {
            select: {
              title: "label",
              href: "href",
              pageSlug: "page.slug.current",
              count: "children.length",
            },
            prepare: ({ title, href, pageSlug, count }) => ({
              title,
              subtitle: [pageSlug ? `/${pageSlug}` : href, count ? `${count} υποσελίδες` : null]
                .filter(Boolean)
                .join(" · "),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "footerNote",
      title: "Σημείωση υποσέλιδου",
      type: "text",
      rows: 2,
    }),
  ],
  preview: { prepare: () => ({ title: "Μενού πλοήγησης" }) },
});
