import type { StructureResolver } from "sanity/structure";

/**
 * Custom Studio sidebar: singletons open straight into their document instead
 * of showing a pointless one-item list, and news posts are grouped by year.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Περιεχόμενο")
    .items([
      S.listItem()
        .title("Νέα & Ανακοινώσεις")
        .schemaType("post")
        .child(
          S.documentTypeList("post")
            .title("Νέα & Ανακοινώσεις")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),

      S.listItem()
        .title("Σελίδες")
        .schemaType("page")
        .child(S.documentTypeList("page").title("Σελίδες")),

      S.listItem()
        .title("Προσωπικό")
        .schemaType("staffMember")
        .child(
          S.documentTypeList("staffMember")
            .title("Προσωπικό")
            .defaultOrdering([
              { field: "section", direction: "asc" },
              { field: "order", direction: "asc" },
            ]),
        ),

      S.listItem()
        .title("Κατηγορίες")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Κατηγορίες")),

      S.divider(),

      S.listItem()
        .title("Ανακοίνωση (μπάρα)")
        .schemaType("announcement")
        .child(S.document().schemaType("announcement").documentId("announcement")),

      S.listItem()
        .title("Μενού πλοήγησης")
        .schemaType("navigation")
        .child(S.document().schemaType("navigation").documentId("navigation")),

      S.listItem()
        .title("Ρυθμίσεις ιστότοπου")
        .schemaType("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
