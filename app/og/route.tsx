// Build-time social sharing image with the current tool count | TypeScript
import { ImageResponse } from "next/og";
import { SITE_NAME, SOCIAL_IMAGE, TOTAL_TOOLS } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "52px 64px", background: "#F8F7FA", color: "#1C1C1E", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 12, background: "#7C3AED", color: "#ffffff", fontSize: 28, fontWeight: 700 }}>N</div>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>{SITE_NAME}</span>
          </div>
          <div style={{ display: "flex", padding: "12px 20px", border: "1px solid #E5E1EB", borderRadius: 32, fontSize: 23, color: "#6B6B7B" }}>
            {TOTAL_TOOLS} free online tools
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 55, fontSize: 108, lineHeight: 1.02, letterSpacing: -6, fontWeight: 700 }}>
          <span>Small tasks.</span>
          <span style={{ color: "#7C3AED" }}>Sorted.</span>
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 29, letterSpacing: -0.5, color: "#6B6B7B" }}>
          Merge PDFs. Resize images. Format code.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 24, borderTop: "1px solid #E5E1EB", fontSize: 23 }}>
          <span style={{ color: "#6B6B7B" }}>Free to use. No signup. No installation.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 700 }}>
            <span>nytm.in</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10" /></svg>
          </div>
        </div>
      </div>
    ),
    { width: SOCIAL_IMAGE.width, height: SOCIAL_IMAGE.height },
  );
}
