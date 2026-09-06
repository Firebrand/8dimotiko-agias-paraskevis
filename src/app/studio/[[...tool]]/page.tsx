import type { Metadata, Viewport } from "next";

import Studio from "./studio";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Διαχείριση περιεχομένου",
  robots: { index: false, follow: false },
  referrer: "same-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  return <Studio />;
}
