"use client";

import { NextStudio } from "next-sanity/studio/client-component";

import config from "../../../../sanity.config";

/**
 * The Studio lives behind a client boundary on purpose: importing
 * `sanity.config.ts` from a Server Component pulls the whole Studio bundle into
 * the RSC graph, where `sanity`'s dependencies have no `react-server` build.
 */
export default function Studio() {
  return <NextStudio config={config} />;
}
