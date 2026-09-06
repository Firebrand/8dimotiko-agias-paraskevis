import { defineLive } from "next-sanity/live";

import { client } from "./client";

/**
 * Live Content API wiring. Published edits made in the Studio show up on the
 * site within seconds, so the school never needs a redeploy to publish news.
 *
 * Only a server-side token is provided: the site renders published content
 * only, so nothing secret is ever handed to the browser.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_TOKEN,
  // The public site never renders drafts, so no token is shared with browsers.
  browserToken: false,
});
