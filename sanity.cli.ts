import { defineCliConfig } from "sanity/cli";

// Kept free of path aliases so the Sanity CLI can load this file standalone.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  autoUpdates: true,
});
