/** Shapes returned by the GROQ projections in src/sanity/queries.ts. */

export type SanityAsset = {
  _id: string;
  url: string;
  mimeType?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
  lqip?: string | null;
};

export type Figure = {
  _type?: "figure";
  _key?: string;
  alt?: string | null;
  caption?: string | null;
  asset?: SanityAsset | null;
};

export type FileRef = {
  asset?: {
    _id: string;
    url: string;
    originalFilename?: string | null;
    extension?: string | null;
    size?: number | null;
    mimeType?: string | null;
  } | null;
};

export type CategoryRef = {
  _id: string;
  title: string;
  slug: string;
  accent?: Accent | null;
};

export type Accent = "blue" | "teal" | "violet" | "amber" | "rose" | "green";

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string | null;
  coverImage?: Figure | null;
  categories?: CategoryRef[] | null;
};

export type PostDetail = PostCard & {
  _updatedAt: string;
  body?: PortableTextBlocks | null;
};

export type PageDetail = {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  _updatedAt: string;
  coverImage?: Figure | null;
  showStaffDirectory?: boolean | null;
  showContactDetails?: boolean | null;
  body?: PortableTextBlocks | null;
};

export type SectionChild = {
  _key: string;
  label: string;
  href?: string | null;
  pageSlug?: string | null;
  subtitle?: string | null;
  coverImage?: Figure | null;
};

export type StaffSection = "management" | "teacher" | "specialty" | "inclusion" | "parallel";

export type StaffMember = {
  _id: string;
  name: string;
  section: StaffSection;
  role?: string | null;
  contactHours?: string | null;
};

export type NavLink = {
  _key: string;
  label: string;
  href?: string | null;
  pageSlug?: string | null;
};

export type NavItem = NavLink & { children?: NavLink[] | null };

export type Navigation = {
  footerNote?: string | null;
  items?: NavItem[] | null;
};

export type Announcement = {
  enabled?: boolean | null;
  text?: string | null;
  tone?: "info" | "warning" | "urgent" | null;
  linkLabel?: string | null;
  linkHref?: string | null;
  expiresAt?: string | null;
};

export type QuickLink = {
  _key: string;
  label: string;
  description?: string | null;
  href: string;
  icon?: "info" | "calendar" | "document" | "people" | "map" | "clock" | null;
};

export type SiteSettings = {
  title?: string | null;
  shortTitle?: string | null;
  description?: string | null;
  logo?: Figure | null;
  heroTitle?: string | null;
  heroText?: string | null;
  heroImages?: Figure[] | null;
  highlights?: { _key: string; value?: string | null; label?: string | null }[] | null;
  quickLinks?: QuickLink[] | null;
  address?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  officeHours?: string | null;
  mapUrl?: string | null;
  mapEmbedUrl?: string | null;
  parentsAssociationUrl?: string | null;
  socialLinks?: { _key: string; platform?: string | null; url?: string | null }[] | null;
};

// -------------------------------------------------------------- Portable Text

export type Span = {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
};

export type MarkDef =
  | { _type: "link"; _key: string; href: string }
  | { _type: "internalLink"; _key: string; slug?: string | null; docType?: string | null };

export type TextBlock = {
  _type: "block";
  _key: string;
  style?: string;
  listItem?: "bullet" | "number";
  level?: number;
  children?: Span[];
  markDefs?: MarkDef[];
};

export type GalleryBlock = {
  _type: "gallery";
  _key: string;
  title?: string | null;
  images?: Figure[] | null;
};

export type FileBlock = {
  _type: "fileAttachment";
  _key: string;
  title?: string | null;
  description?: string | null;
  file?: FileRef | null;
};

export type TableBlock = {
  _type: "dataTable";
  _key: string;
  caption?: string | null;
  hasHeaderRow?: boolean | null;
  rows?: { _key: string; cells?: string[] | null }[] | null;
};

export type VideoBlock = {
  _type: "videoEmbed";
  _key: string;
  title?: string | null;
  url?: string | null;
  file?: FileRef | null;
  poster?: Figure | null;
};

export type AudioBlock = {
  _type: "audioEmbed";
  _key: string;
  title?: string | null;
  file?: FileRef | null;
};

export type CalloutBlock = {
  _type: "callout";
  _key: string;
  tone?: "info" | "success" | "warning" | null;
  title?: string | null;
  text?: TextBlock[] | null;
};

export type FigureBlock = Figure & { _type: "figure"; _key: string };

export type PortableTextBlock =
  | TextBlock
  | FigureBlock
  | GalleryBlock
  | FileBlock
  | TableBlock
  | VideoBlock
  | AudioBlock
  | CalloutBlock;

export type PortableTextBlocks = PortableTextBlock[];
