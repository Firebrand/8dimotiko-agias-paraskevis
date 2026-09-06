"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * Reads a "dismissed" flag out of localStorage the React way, so there is no
 * setState-in-effect and no flash of a banner the visitor already closed.
 * The server snapshot is `true`, meaning nothing renders until the client
 * confirms the notice has not been dismissed.
 */
export function useDismissed(key: string) {
  const dismissed = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key) === "1",
    () => true,
  );

  const dismiss = useCallback(() => {
    window.localStorage.setItem(key, "1");
    for (const listener of listeners) listener();
  }, [key]);

  return [dismissed, dismiss] as const;
}
