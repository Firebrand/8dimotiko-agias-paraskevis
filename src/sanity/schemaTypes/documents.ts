import { defineArrayMember, defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Κατηγορία",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Όνομα",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Διεύθυνση (slug)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accent",
      title: "Χρώμα",
      type: "string",
      initialValue: "blue",
      options: {
        list: [
          { title: "Μωβ", value: "blue" },
          { title: "Τιρκουάζ", value: "teal" },
          { title: "Γαλάζιο", value: "violet" },
          { title: "Λαχανί", value: "amber" },
          { title: "Ροζ", value: "rose" },
          { title: "Πράσινο", value: "green" },
        ],
      },
    }),
    defineField({ name: "description", title: "Περιγραφή", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const post = defineType({
  name: "post",
  title: "Νέα & Ανακοινώσεις",
  type: "document",
  groups: [
    { name: "content", title: "Περιεχόμενο", default: true },
    { name: "meta", title: "Ρυθμίσεις" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Τίτλος",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Διεύθυνση (slug)",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Ημερομηνία δημοσίευσης",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Σύντομη περιγραφή",
      type: "text",
      rows: 3,
      group: "content",
      description: "Εμφανίζεται στη λίστα των νέων και στα αποτελέσματα αναζήτησης.",
      validation: (rule) => rule.max(320),
    }),
    defineField({
      name: "coverImage",
      title: "Κύρια εικόνα",
      type: "figure",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Κείμενο",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "categories",
      title: "Κατηγορίες",
      type: "array",
      group: "meta",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
    }),
    defineField({
      name: "featured",
      title: "Προβολή στην αρχική σελίδα",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "legacyPath",
      title: "Παλιά διεύθυνση WordPress",
      type: "string",
      group: "meta",
      readOnly: true,
      description: "Χρησιμοποιείται για ανακατεύθυνση από τον παλιό ιστότοπο.",
    }),
  ],
  orderings: [
    {
      name: "publishedAtDesc",
      title: "Νεότερα πρώτα",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "publishedAt", media: "coverImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date
        ? new Date(date).toLocaleDateString("el-GR", { dateStyle: "long" })
        : "Χωρίς ημερομηνία",
      media,
    }),
  },
});

export const page = defineType({
  name: "page",
  title: "Σελίδες",
  type: "document",
  groups: [
    { name: "content", title: "Περιεχόμενο", default: true },
    { name: "meta", title: "Ρυθμίσεις" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Τίτλος",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Διεύθυνση (slug)",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Υπότιτλος",
      type: "text",
      rows: 2,
      group: "content",
      description: "Μια σύντομη εισαγωγή που εμφανίζεται κάτω από τον τίτλο.",
    }),
    defineField({
      name: "coverImage",
      title: "Εικόνα επικεφαλίδας",
      type: "figure",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Περιεχόμενο",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "showStaffDirectory",
      title: "Εμφάνιση καταλόγου εκπαιδευτικών",
      type: "boolean",
      group: "meta",
      initialValue: false,
      description: "Προσθέτει αυτόματα τον κατάλογο προσωπικού στο τέλος της σελίδας.",
    }),
    defineField({
      name: "showContactDetails",
      title: "Εμφάνιση στοιχείων επικοινωνίας & χάρτη",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "legacyPath",
      title: "Παλιά διεύθυνση WordPress",
      type: "string",
      group: "meta",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", media: "coverImage" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `/${subtitle}` : undefined,
      media,
    }),
  },
});

export const staffMember = defineType({
  name: "staffMember",
  title: "Προσωπικό",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ονοματεπώνυμο",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "section",
      title: "Ομάδα",
      type: "string",
      initialValue: "teacher",
      options: {
        list: [
          { title: "Διεύθυνση", value: "management" },
          { title: "Δάσκαλοι ανά τμήμα", value: "teacher" },
          { title: "Ειδικότητες", value: "specialty" },
          { title: "Τμήμα ένταξης", value: "inclusion" },
          { title: "Παράλληλη στήριξη", value: "parallel" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Τμήμα / Ειδικότητα",
      type: "string",
      description: 'Π.χ. "Α", "Β1", "Αγγλικά", "Διευθύντρια".',
    }),
    defineField({
      name: "contactHours",
      title: "Ώρες επικοινωνίας",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "order",
      title: "Σειρά εμφάνισης",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      name: "sectionThenOrder",
      title: "Ομάδα και σειρά",
      by: [
        { field: "section", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", role: "role", hours: "contactHours" },
    prepare: ({ title, role, hours }) => ({
      title: [role, title].filter(Boolean).join(" · "),
      subtitle: hours,
    }),
  },
});
