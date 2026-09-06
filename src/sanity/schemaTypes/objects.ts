import { defineArrayMember, defineField, defineType } from "sanity";

/** Image with the accessibility + caption fields the old site was missing. */
export const figure = defineType({
  name: "figure",
  title: "Εικόνα",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Εναλλακτικό κείμενο",
      type: "string",
      description: "Σύντομη περιγραφή της εικόνας για άτομα που χρησιμοποιούν αναγνώστη οθόνης.",
    }),
    defineField({ name: "caption", title: "Λεζάντα", type: "string" }),
  ],
  preview: {
    select: { media: "asset", title: "caption", subtitle: "alt" },
  },
});

export const gallery = defineType({
  name: "gallery",
  title: "Συλλογή φωτογραφιών",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Τίτλος (προαιρετικός)", type: "string" }),
    defineField({
      name: "images",
      title: "Φωτογραφίες",
      type: "array",
      of: [defineArrayMember({ type: "figure" })],
      options: { layout: "grid" },
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", count: "images.length", media: "images.0.asset" },
    prepare: ({ title, count, media }) => ({
      title: title || "Συλλογή φωτογραφιών",
      subtitle: `${count ?? 0} φωτογραφίες`,
      media,
    }),
  },
});

export const fileAttachment = defineType({
  name: "fileAttachment",
  title: "Συνημμένο αρχείο",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Τίτλος",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "Αρχείο",
      type: "file",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", title: "Περιγραφή", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
    prepare: ({ title, subtitle }) => ({ title: title || "Αρχείο", subtitle }),
  },
});

/** Simple grid table — mirrors the schedule tables used on the legacy site. */
export const dataTable = defineType({
  name: "dataTable",
  title: "Πίνακας",
  type: "object",
  fields: [
    defineField({ name: "caption", title: "Λεζάντα / τίτλος πίνακα", type: "string" }),
    defineField({
      name: "hasHeaderRow",
      title: "Η πρώτη γραμμή είναι επικεφαλίδα",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "rows",
      title: "Γραμμές",
      type: "array",
      of: [
        defineArrayMember({
          name: "row",
          title: "Γραμμή",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Κελιά",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }) => ({ title: (cells ?? []).join("  ·  ") || "Κενή γραμμή" }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { caption: "caption", count: "rows.length" },
    prepare: ({ caption, count }) => ({
      title: caption || "Πίνακας",
      subtitle: `${count ?? 0} γραμμές`,
    }),
  },
});

export const videoEmbed = defineType({
  name: "videoEmbed",
  title: "Βίντεο",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Τίτλος", type: "string" }),
    defineField({
      name: "url",
      title: "Σύνδεσμος (YouTube / Vimeo)",
      type: "url",
      description: "Χρησιμοποιήστε αυτό ΄η ανεβάστε αρχείο βίντεο παρακάτω.",
    }),
    defineField({ name: "file", title: "Αρχείο βίντεο", type: "file", options: { accept: "video/*" } }),
    defineField({ name: "poster", title: "Εικόνα εξωφύλλου", type: "image" }),
  ],
  preview: {
    select: { title: "title", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({ title: title || "Βίντεο", subtitle }),
  },
});

export const audioEmbed = defineType({
  name: "audioEmbed",
  title: "Ηχητικό",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Τίτλος", type: "string" }),
    defineField({
      name: "file",
      title: "Αρχείο ήχου",
      type: "file",
      options: { accept: "audio/*" },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title || "Ηχητικό" }),
  },
});

export const callout = defineType({
  name: "callout",
  title: "Πλαίσιο έμφασης",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "Χρωματισμός",
      type: "string",
      initialValue: "info",
      options: {
        list: [
          { title: "Πληροφορία", value: "info" },
          { title: "Επιτυχία", value: "success" },
          { title: "Προσοχή", value: "warning" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({ name: "title", title: "Τίτλος", type: "string" }),
    defineField({
      name: "text",
      title: "Κείμενο",
      type: "array",
      of: [defineArrayMember({ type: "block", styles: [], lists: [] })],
    }),
  ],
  preview: {
    select: { title: "title", tone: "tone" },
    prepare: ({ title, tone }) => ({ title: title || "Πλαίσιο έμφασης", subtitle: tone }),
  },
});
