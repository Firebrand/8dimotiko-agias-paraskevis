import { defineQuery } from "next-sanity";

/**
 * Shared projections. Images always resolve their asset metadata so that
 * next/image can render correct dimensions and a blur placeholder.
 */
const IMAGE = /* groq */ `
  _type,
  alt,
  caption,
  "asset": asset->{
    _id,
    url,
    mimeType,
    "dimensions": metadata.dimensions,
    "lqip": metadata.lqip
  }
`;

const FILE = /* groq */ `
  "asset": asset->{ _id, url, originalFilename, extension, size, mimeType }
`;

const BODY = /* groq */ `
  ...,
  _type == "figure" => { ${IMAGE} },
  _type == "gallery" => { _type, _key, title, images[]{ _key, ${IMAGE} } },
  _type == "fileAttachment" => { _type, _key, title, description, "file": file{ ${FILE} } },
  _type == "videoEmbed" => { _type, _key, title, url, "file": file{ ${FILE} }, poster{ ${IMAGE} } },
  _type == "audioEmbed" => { _type, _key, title, "file": file{ ${FILE} } },
  markDefs[]{
    ...,
    _type == "internalLink" => {
      "slug": @.reference->slug.current,
      "docType": @.reference->_type
    }
  }
`;

const POST_CARD = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage{ ${IMAGE} },
  "categories": categories[]->{ _id, title, "slug": slug.current, accent }
`;

export const settingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    title,
    shortTitle,
    description,
    logo{ ${IMAGE} },
    heroTitle,
    heroText,
    heroImages[]{ _key, ${IMAGE} },
    highlights[]{ _key, value, label },
    quickLinks[]{ _key, label, description, href, icon },
    address,
    phone,
    fax,
    email,
    officeHours,
    mapUrl,
    mapEmbedUrl,
    parentsAssociationUrl,
    socialLinks[]{ _key, platform, url }
  }
`);

export const navigationQuery = defineQuery(`
  *[_type == "navigation"][0]{
    footerNote,
    items[]{
      _key,
      label,
      href,
      "pageSlug": page->slug.current,
      children[]{
        _key,
        label,
        href,
        "pageSlug": page->slug.current
      }
    }
  }
`);

export const announcementQuery = defineQuery(`
  *[_type == "announcement"][0]{
    enabled,
    text,
    tone,
    linkLabel,
    linkHref,
    expiresAt
  }
`);

export const homeQuery = defineQuery(`{
  "featured": *[_type == "post" && defined(slug.current)]
    | order(featured desc, publishedAt desc)[0...3]{ ${POST_CARD} },
  "recent": *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc)[3...12]{ ${POST_CARD} },
  "total": count(*[_type == "post" && defined(slug.current)])
}`);

export const postsPageQuery = defineQuery(`{
  "posts": *[
    _type == "post" && defined(slug.current) &&
    ($category == "" || $category in categories[]->slug.current)
  ] | order(publishedAt desc)[$from...$to]{ ${POST_CARD} },
  "total": count(*[
    _type == "post" && defined(slug.current) &&
    ($category == "" || $category in categories[]->slug.current)
  ])
}`);

export const postQuery = defineQuery(`{
  "post": *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    excerpt,
    coverImage{ ${IMAGE} },
    "categories": categories[]->{ _id, title, "slug": slug.current, accent },
    body[]{ ${BODY} }
  },
  "previous": *[_type == "post" && publishedAt < *[_type == "post" && slug.current == $slug][0].publishedAt]
    | order(publishedAt desc)[0]{ title, "slug": slug.current },
  "next": *[_type == "post" && publishedAt > *[_type == "post" && slug.current == $slug][0].publishedAt]
    | order(publishedAt asc)[0]{ title, "slug": slug.current },
  "related": *[
    _type == "post" && slug.current != $slug &&
    count((categories[]->slug.current)[@ in *[_type == "post" && slug.current == $slug][0].categories[]->slug.current]) > 0
  ] | order(publishedAt desc)[0...3]{ ${POST_CARD} }
}`);

export const postSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);

export const pageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    subtitle,
    _updatedAt,
    coverImage{ ${IMAGE} },
    showStaffDirectory,
    showContactDetails,
    body[]{ ${BODY} }
  }
`);

export const pageSlugsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)]{ "slug": slug.current }
`);

/** Child pages of a section, derived from the navigation document. */
export const sectionChildrenQuery = defineQuery(`
  *[_type == "navigation"][0].items[page->slug.current == $slug][0].children[]{
    _key,
    label,
    href,
    "pageSlug": page->slug.current,
    "subtitle": page->subtitle,
    "coverImage": page->coverImage{ ${IMAGE} }
  }
`);

export const staffQuery = defineQuery(`
  *[_type == "staffMember"] | order(order asc){
    _id,
    name,
    section,
    role,
    contactHours
  }
`);

export const categoriesQuery = defineQuery(`
  *[_type == "category" && count(*[_type == "post" && references(^._id)]) > 0]
    | order(title asc){
      _id,
      title,
      "slug": slug.current,
      accent,
      "count": count(*[_type == "post" && references(^._id)])
    }
`);

export const categoryQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, accent, description
  }
`);

export const categorySlugsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`);

/** Lightweight index powering the client-side site search. */
export const searchIndexQuery = defineQuery(`{
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    "id": _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "categories": categories[]->title,
    "text": pt::text(body)
  },
  "pages": *[_type == "page" && defined(slug.current)]{
    "id": _id,
    title,
    "slug": slug.current,
    subtitle,
    "text": pt::text(body)
  }
}`);

export const sitemapQuery = defineQuery(`{
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt, publishedAt },
  "pages": *[_type == "page" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "categories": *[_type == "category" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`);
