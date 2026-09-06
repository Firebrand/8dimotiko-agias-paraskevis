import type { SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import { category, page, post, staffMember } from "./documents";
import {
  audioEmbed,
  callout,
  dataTable,
  fileAttachment,
  figure,
  gallery,
  videoEmbed,
} from "./objects";
import { announcement, navigation, siteSettings } from "./singletons";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  post,
  page,
  category,
  staffMember,
  // Singletons
  siteSettings,
  navigation,
  announcement,
  // Objects
  blockContent,
  figure,
  gallery,
  fileAttachment,
  dataTable,
  videoEmbed,
  audioEmbed,
  callout,
];

/** Document types that must only ever have a single instance. */
export const singletonTypes = new Set(["siteSettings", "navigation", "announcement"]);
