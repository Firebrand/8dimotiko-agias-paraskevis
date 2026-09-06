import Link from "next/link";

import { NotFoundContent } from "@/components/not-found-content";
import { Logo } from "@/components/logo";

/**
 * Global 404 for URLs that match no route at all. It cannot use the `(site)`
 * layout, so it carries a minimal header of its own.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="rounded-2xl">
          <Logo title="8ο Δημοτικό Αγίας Παρασκευής" />
        </Link>
      </div>
      <div className="flex-1">
        <NotFoundContent />
      </div>
    </div>
  );
}
