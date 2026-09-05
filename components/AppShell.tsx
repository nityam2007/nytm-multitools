// Responsive page spacing beside the tool sidebar | TypeScript
"use client";
import type { ReactNode } from "react";
import { useSidebar } from "./Sidebar";
export function AppShell({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  return <div className={`app-shell flex flex-col min-h-screen transition-[padding] duration-300 ${collapsed ? "lg:pl-[72px]" : "lg:pl-64"}`}>{children}</div>;
}
