// ScrollToTop | Client Component for page navigation scroll reset
"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return null;
}
