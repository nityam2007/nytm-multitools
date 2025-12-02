"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("screen-resolution")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "screen-resolution");

interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  orientation: string;
  touchSupport: boolean;
}

export default function ScreenResolutionPage() {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo | null>(null);

  useEffect(() => {
    const updateScreenInfo = () => {
      setScreenInfo({
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth,
        orientation: window.screen.orientation?.type || "unknown",
        touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      });
    };

    updateScreenInfo();
    window.addEventListener("resize", updateScreenInfo);
    window.addEventListener("orientationchange", updateScreenInfo);
    
    return () => {
      window.removeEventListener("resize", updateScreenInfo);
      window.removeEventListener("orientationchange", updateScreenInfo);
    };
  }, []);

  if (!screenInfo) {
    return (
      <ToolLayout tool={tool} similarTools={similarTools}>
        <div className="text-center py-12">Loading screen information...</div>
      </ToolLayout>
    );
  }

  const commonResolutions = [
    { name: "HD", width: 1280, height: 720, aspect: "16:9" },
    { name: "Full HD", width: 1920, height: 1080, aspect: "16:9" },
    { name: "2K / QHD", width: 2560, height: 1440, aspect: "16:9" },
    { name: "4K / UHD", width: 3840, height: 2160, aspect: "16:9" },
    { name: "5K", width: 5120, height: 2880, aspect: "16:9" },
    { name: "8K", width: 7680, height: 4320, aspect: "16:9" },
    { name: "iPad", width: 2048, height: 1536, aspect: "4:3" },
    { name: "iPhone 14 Pro", width: 1179, height: 2556, aspect: "9:19.5" },
  ];

  const getDeviceType = () => {
    const { viewportWidth } = screenInfo;
    if (viewportWidth < 576) return "Mobile";
    if (viewportWidth < 768) return "Mobile / Small Tablet";
    if (viewportWidth < 992) return "Tablet";
    if (viewportWidth < 1200) return "Small Desktop / Laptop";
    if (viewportWidth < 1400) return "Desktop";
    return "Large Desktop / Monitor";
  };

  const getBreakpoint = () => {
    const { viewportWidth } = screenInfo;
    if (viewportWidth < 640) return "xs (<640px)";
    if (viewportWidth < 768) return "sm (≥640px)";
    if (viewportWidth < 1024) return "md (≥768px)";
    if (viewportWidth < 1280) return "lg (≥1024px)";
    if (viewportWidth < 1536) return "xl (≥1280px)";
    return "2xl (≥1536px)";
  };

  const physicalWidth = Math.round(screenInfo.screenWidth / screenInfo.devicePixelRatio);
  const physicalHeight = Math.round(screenInfo.screenHeight / screenInfo.devicePixelRatio);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="text-sm opacity-80 mb-1">Screen Resolution</div>
            <div className="text-4xl font-bold">
              {screenInfo.screenWidth} × {screenInfo.screenHeight}
            </div>
            <div className="text-sm opacity-80 mt-2">pixels</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
            <div className="text-sm opacity-80 mb-1">Viewport Size</div>
            <div className="text-4xl font-bold">
              {screenInfo.viewportWidth} × {screenInfo.viewportHeight}
            </div>
            <div className="text-sm opacity-80 mt-2">pixels (live)</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
            <div className="text-3xl font-bold">{screenInfo.devicePixelRatio}x</div>
            <div className="text-sm text-[var(--muted-foreground)]">Device Pixel Ratio</div>
          </div>
          <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
            <div className="text-3xl font-bold">{screenInfo.colorDepth}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Color Depth (bits)</div>
          </div>
          <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
            <div className="text-3xl font-bold">{screenInfo.touchSupport ? "Yes" : "No"}</div>
            <div className="text-sm text-[var(--muted-foreground)]">Touch Support</div>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Device Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Device Type</span>
                <span className="font-medium">{getDeviceType()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Breakpoint (Tailwind)</span>
                <span className="font-mono text-sm">{getBreakpoint()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Orientation</span>
                <span className="font-medium">{screenInfo.orientation.replace("-", " ")}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Available Screen</span>
                <span className="font-mono text-sm">{screenInfo.availWidth} × {screenInfo.availHeight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Physical Resolution</span>
                <span className="font-mono text-sm">{physicalWidth} × {physicalHeight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Aspect Ratio</span>
                <span className="font-medium">
                  {(screenInfo.screenWidth / screenInfo.screenHeight).toFixed(2)}:1
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Common Resolutions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3">Name</th>
                  <th className="text-left py-2 px-3">Resolution</th>
                  <th className="text-left py-2 px-3">Aspect</th>
                  <th className="text-left py-2 px-3">Match</th>
                </tr>
              </thead>
              <tbody>
                {commonResolutions.map((res, idx) => {
                  const isMatch = res.width === screenInfo.screenWidth && res.height === screenInfo.screenHeight;
                  return (
                    <tr key={idx} className={`border-b border-[var(--border)] ${isMatch ? "bg-green-500/10" : ""}`}>
                      <td className="py-2 px-3 font-medium">{res.name}</td>
                      <td className="py-2 px-3 font-mono">{res.width} × {res.height}</td>
                      <td className="py-2 px-3">{res.aspect}</td>
                      <td className="py-2 px-3">
                      {isMatch && (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <p className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Resize your browser window to see the viewport size update in real-time.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
