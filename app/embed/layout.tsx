// Embed Layout | TypeScript
"use client";

import { useEffect } from "react";
import type { Metadata } from "next";

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Hide main layout elements for embed mode
    document.body.classList.add('embed-mode');
    
    return () => {
      document.body.classList.remove('embed-mode');
    };
  }, []);

  return <>{children}</>;
}
