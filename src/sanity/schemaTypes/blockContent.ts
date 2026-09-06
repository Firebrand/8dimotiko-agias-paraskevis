import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The rich-text field used by both news posts and static pages. Everything the
 * legacy WordPress content used is representable here.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Περιεχόμενο",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Κανονικό", value: "normal" },
        { title: "Επικεφαλίδα", value: "h2" },
        { title: "Υποεπικεφαλίδα", value: "h3" },
        { title: "Μικρή επικεφαλίδα", value: "h4" },
        { title: "Παράθεμα", value: "blockquote" },
      ],
      lists: [
        { title: "Κουκκίδες", value: "bullet" },
        { title: "Αρίθμηση", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Έντονα", value: "strong" },
          { title: "Πλάγια", value: "em" },
          { title: "Υπογράμμιση", value: "underline" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Σύνδεσμος",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Διεύθυνση (URL)",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({
                    scheme: ["http", "https", "mailto", "tel"],
                    allowRelative: true,
                  }),
              }),
            ],
          }),
          defineArrayMember({
            name: "internalLink",
            title: "Σύνδεσμος σε σελίδα του site",
            type: "object",
            fields: [
              defineField({
                name: "reference",
                title: "Προορισμός",
                type: "reference",
                to: [{ type: "page" }, { type: "post" }],
                validation: (rule) => rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: "figure" }),
    defineArrayMember({ type: "gallery" }),
    defineArrayMember({ type: "fileAttachment" }),
    defineArrayMember({ type: "dataTable" }),
    defineArrayMember({ type: "videoEmbed" }),
    defineArrayMember({ type: "audioEmbed" }),
    defineArrayMember({ type: "callout" }),
  ],
});
