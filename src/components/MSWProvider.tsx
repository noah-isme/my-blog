"use client";

import { useEffect } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only start MSW in development and when running in the browser
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      // Dynamic import to avoid bundling MSW in production
      import("../mocks/browser")
        .then(({ worker }) => {
          worker
            .start({
              onUnhandledRequest: "bypass",
              serviceWorker: {
                url: "/mockServiceWorker.js",
              },
            })
            .then(() => {
              console.log("✅ MSW started successfully");
            })
            .catch((error) => {
              console.error("❌ MSW failed to start:", error);
            });
        })
        .catch((importError) => {
          console.error("❌ Failed to import MSW:", importError);
        });
    }
  }, []);

  return <>{children}</>;
}