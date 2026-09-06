/**
 * Sanity connection details.
 *
 * The project id and dataset are public values (they appear in every image
 * URL), so they are defaulted here. That keeps `git clone && npm run dev` and a
 * fresh Vercel import working with no configuration, while still allowing an
 * override — e.g. to point a preview deployment at a different dataset.
 *
 * No token is needed to render the site: the dataset is public and only
 * published content is queried. `SANITY_API_TOKEN` is required solely by the
 * WordPress migration script.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "dt6i1qpo";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-01";

/** Where the embedded Studio lives, relative to the site root. */
export const studioBasePath = "/studio";
