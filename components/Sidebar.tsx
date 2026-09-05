"use client";
// Tool category sidebar | TypeScript
import { usePreference, writePreference } from "@/lib/tool-history";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, createContext, useContext, useMemo, useRef, useSyncExternalStore } from "react";
import { toolsConfig, searchTools } from "@/lib/tools-config";
import {
  HomeIcon,
  GridIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  getCategoryIcon,
} from "@/assets/icons";

interface SidebarCategory {
  id: string;
  name: string;
  tools: { slug: string; name: string; icon?: string }[];
}

// Category metadata
const categoryMeta: Record<string, { name: string }> = {
  text: { name: "Text" },
  dev: { name: "Developer" },
  image: { name: "Image" },
  converter: { name: "Converters" },
  generator: { name: "Generators" },
  security: { name: "Security" },
  network: { name: "Network" },
  misc: { name: "Misc" },
};

// Generate sidebar categories from tools config
function generateSidebarCategories(): SidebarCategory[] {
  const categoryMap = new Map<string, { slug: string; name: string; icon?: string }[]>();

  toolsConfig.forEach((tool) => {
    if (!categoryMap.has(tool.category)) {
      categoryMap.set(tool.category, []);
    }
    categoryMap.get(tool.category)!.push({ slug: tool.slug, name: tool.name, icon: tool.icon });
  });

  const categories: SidebarCategory[] = [];
  const categoryOrder = ["text", "dev", "image", "converter", "generator", "security", "network", "misc"];

  categoryOrder.forEach((catId) => {
    const tools = categoryMap.get(catId);
    const meta = categoryMeta[catId];
    if (tools && meta) {
      categories.push({
        id: catId,
        name: meta.name,
        tools: tools,
      });
    }
  });

  return categories;
}

// Sidebar Context for global state
interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const collapsed = usePreference("sidebar-collapsed", "true") !== "false";
  const setCollapsed = (value: boolean) => writePreference("sidebar-collapsed", String(value));

  const toggle = () => setIsOpen((prev) => !prev);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, collapsed, setCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// Sidebar Toggle Button Component
export function SidebarToggle({ className = "", onToggle }: { className?: string; onToggle?: () => void }) {
  const { toggle, isOpen, collapsed, setCollapsed } = useSidebar();

  const handleClick = () => {
    onToggle?.();
    if (window.innerWidth < 1024) {
      toggle();
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <button
      onClick={event => { event.currentTarget.focus(); handleClick(); }}
      className={`inline-flex items-center gap-1.5 px-2 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors ${className}`}
      aria-label={isOpen ? "Close tool categories" : "Open tool categories"}
      aria-controls="tools-sidebar"
      aria-expanded={isOpen}
      title={isOpen ? "Close tool categories (Esc)" : "Browse tool categories"}
    >
      <GridIcon aria-hidden="true" className="w-4 h-4" /><span className="text-sm font-medium">Tools</span>
    </button>
  );
}

// Tooltip component for collapsed sidebar
function Tooltip({ children, text, show }: { children: React.ReactNode; text: string; show: boolean }) {
  if (!show) return <>{children}</>;
  return (
    <div className="relative group/tooltip">
      {children}
      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[var(--foreground)] text-[var(--background)] text-xs font-medium rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
        {text}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-[var(--foreground)]" />
      </div>
    </div>
  );
}

const subscribeMobile = (notify: () => void) => {
  const media = window.matchMedia("(max-width: 1023px)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getMobileSnapshot = () => window.matchMedia("(max-width: 1023px)").matches;
const getServerMobileSnapshot = () => false;

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, collapsed: desktopCollapsed, setCollapsed } = useSidebar();
  const mobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getServerMobileSnapshot);
  const collapsed = !mobile && desktopCollapsed;
  const searchInput = useRef<HTMLInputElement>(null);
  const drawer = useRef<HTMLElement>(null);

  useEffect(() => {
    const searchShortcut = (event: KeyboardEvent) => {
      if (pathname === "/" || collapsed || (mobile && !isOpen)) return;
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey &&
          !(event.target as HTMLElement).closest("input,textarea,select,[contenteditable=true]")) {
        event.preventDefault(); searchInput.current?.focus();
      }
    };
    document.addEventListener("keydown", searchShortcut);
    return () => document.removeEventListener("keydown", searchShortcut);
  }, [pathname, collapsed, mobile, isOpen]);

  useEffect(() => {
    if (!mobile || !isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const background = [document.querySelector("header"), document.querySelector("main"), document.querySelector("footer")].filter((el): el is HTMLElement => el instanceof HTMLElement).map(el => ({ el, inert: el.inert }));
    background.forEach(({ el }) => { el.inert = true; });
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(drawer.current?.querySelectorAll<HTMLElement>("a[href],button:not(:disabled),input:not(:disabled)") || []).filter(el => el.getClientRects().length > 0);
    let focusFrame = 0;
    const focusDrawer = () => {
      const close = drawer.current?.querySelector<HTMLButtonElement>("button");
      if (!close) return;
      if (getComputedStyle(close).visibility === "visible") close.focus({ preventScroll: true });
      if (document.activeElement !== close) focusFrame = requestAnimationFrame(focusDrawer);
    };
    focusFrame = requestAnimationFrame(focusDrawer);
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = focusable(), first = controls[0], last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || !drawer.current?.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !drawer.current?.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      background.forEach(({ el, inert }) => { el.inert = inert; });
      document.removeEventListener("keydown", trapFocus);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [mobile, isOpen]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate categories from tools config
  const sidebarCategories = useMemo(() => generateSidebarCategories(), []);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return sidebarCategories;

    const matchingSlugs = new Set(searchTools(searchQuery).map(tool => tool.slug));
    return sidebarCategories
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter((tool) =>
          matchingSlugs.has(tool.slug)
        ),
      }))
      .filter((cat) => cat.tools.length > 0);
  }, [sidebarCategories, searchQuery]);

  const activeCategory = sidebarCategories.find(category => category.tools.some(tool => pathname === `/tools/${tool.slug}`))?.id;
  const [closedCategories, setClosedCategories] = useState<string[]>([]);
  const expandedCategories = searchQuery ? filteredCategories.map(c => c.id) : [...openCategories, ...(activeCategory && !closedCategories.includes(activeCategory) ? [activeCategory] : [])];
  const toggleCategory = (id: string) => {
    if (expandedCategories.includes(id)) { setOpenCategories(openCategories.filter(c => c !== id)); setClosedCategories([...closedCategories, id]); }
    else { setOpenCategories([...openCategories, id]); setClosedCategories(closedCategories.filter(c => c !== id)); }
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  // Don't show sidebar on admin pages
  if (pathname?.startsWith("/nytm-ctrl-x9k7")) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside ref={drawer} id="tools-sidebar" aria-label="Tool navigation" role={mobile ? "dialog" : undefined} aria-modal={mobile && isOpen ? true : undefined} className={`
        fixed top-0 left-0 h-full z-50 flex flex-col
        bg-[var(--background)] border-r border-[var(--border)]
        transition-transform duration-300 ease-out overflow-hidden
        ${isOpen ? "translate-x-0 visible" : "-translate-x-full invisible"}
        lg:translate-x-0 lg:visible
        w-[280px] sm:w-72 lg:w-auto
        ${collapsed ? "lg:!w-[72px]" : "lg:!w-64"}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)]">
          {!collapsed && (
            <Link href="/" className="flex items-center group">
              <span className="font-bold text-lg tracking-tight">
                <span className="gradient-text">NYTM</span>
                <span className="text-[var(--muted-foreground)] font-normal ml-1">Tools</span>
              </span>
            </Link>
          )}
          <button
            aria-label={mobile ? "Close tool categories" : collapsed ? "Expand tool sidebar" : "Collapse tool sidebar"}
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsOpen(false);
              } else {
                setCollapsed(!collapsed);
                // Close all category dropdowns when collapsing sidebar
                if (!collapsed) {
                  setOpenCategories([]);
                }
              }
            }}
            className={`p-2.5 rounded-xl hover:bg-violet-500/10 transition-all duration-200 ${collapsed ? "mx-auto" : ""}`}
          >
            {collapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="p-4 border-b border-[var(--border)]">
            <div className="relative">
              <input
                ref={searchInput}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                aria-label="Search sidebar tools"
                className="sidebar-search-control field-control"
              />
              <SearchIcon aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              {searchQuery ? <button type="button" aria-label="Clear sidebar search" className="sidebar-search-clear" onClick={() => { setSearchQuery(""); searchInput.current?.focus(); }}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M6 18 18 6" /></svg>
              </button> : <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 kbd text-[10px]">/</span>}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`space-y-1 ${collapsed ? 'p-2' : 'p-3'}`}>
          {/* Home */}
          <Tooltip text="Home" show={collapsed}>
            <Link
              href="/"
              aria-label="Home"
              aria-current={isActive("/", true) ? "page" : undefined}
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive("/", true)
                  ? "sidebar-active-link"
                  : "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }
                ${collapsed ? "justify-center !px-2" : ""}
              `}
            >
              <div className={`flex items-center justify-center flex-shrink-0 ${collapsed ? 'min-w-[24px]' : ''}`}>
                <HomeIcon className={collapsed ? "w-5 h-5" : "w-4 h-4"} />
              </div>
              {!collapsed && <span className="text-sm font-medium">Home</span>}
            </Link>
          </Tooltip>

          {/* All Tools */}
          <Tooltip text="All Tools" show={collapsed}>
            <Link
              href="/tools"
              aria-label="All tools"
              aria-current={isActive("/tools", true) ? "page" : undefined}
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive("/tools", true)
                  ? "sidebar-active-link"
                  : "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }
                ${collapsed ? "justify-center !px-2" : ""}
              `}
            >
              <div className={`flex items-center justify-center flex-shrink-0 ${collapsed ? 'min-w-[24px]' : ''}`}>
                <GridIcon className={collapsed ? "w-5 h-5" : "w-4 h-4"} />
              </div>
              {!collapsed && <span className="text-sm font-medium">All Tools</span>}
            </Link>
          </Tooltip>
        </nav>

        {/* Divider */}
        <div className={`my-3 border-t border-[var(--border)] ${collapsed ? 'mx-2' : 'mx-4'}`} />

        {/* Categories */}
        <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-6 ${collapsed ? 'px-2' : 'px-3'}`}>
          {!collapsed && searchQuery && <p role="status" className="px-3 pb-3 text-sm text-[var(--muted-foreground)]">{filteredCategories.reduce((total, category) => total + category.tools.length, 0)} matching tools{!filteredCategories.length ? ". Try a shorter search or a file type." : ""}</p>}
          {filteredCategories.map((category) => {
            const IconComponent = getCategoryIcon(category.id);
            return (
              <div key={category.id} className="mb-1">
                <Tooltip text={`${category.name} (${category.tools.length})`} show={collapsed}>
                  <button
                    aria-label={`${category.name} tools`}
                    aria-expanded={!collapsed && expandedCategories.includes(category.id)}
                    aria-controls={!collapsed && expandedCategories.includes(category.id) ? `sidebar-category-${category.id}` : undefined}
                    onClick={() => {
                      // Auto-expand sidebar when clicking category in collapsed mode
                      if (collapsed) {
                        setCollapsed(false);
                      }
                      toggleCategory(category.id);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]
                      ${collapsed ? "justify-center !px-2" : ""}
                      ${expandedCategories.includes(category.id) && !collapsed ? "bg-[var(--muted)] text-[var(--foreground)]" : ""}
                    `}
                  >
                    <div className={`flex items-center justify-center flex-shrink-0 ${collapsed ? 'min-w-[24px]' : ''}`}>
                      <IconComponent className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} ${expandedCategories.includes(category.id) ? 'text-violet-500' : ''}`} />
                    </div>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-sm text-left font-medium">{category.name}</span>
                        <span className="text-[10px] text-[var(--muted-foreground)] bg-[var(--muted)] px-1.5 py-0.5 rounded-md tabular-nums">{category.tools.length}</span>
                        <ChevronDownIcon className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 ${expandedCategories.includes(category.id) ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </button>
                </Tooltip>

                {!collapsed && expandedCategories.includes(category.id) && (
                  <div id={`sidebar-category-${category.id}`} className="ml-5 pl-3 border-l-2 border-violet-500/20 space-y-0.5 mt-1.5 mb-3">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        aria-current={pathname === `/tools/${tool.slug}` ? "page" : undefined}
                        title={tool.name}
                        onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                        className={`
                          relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                          ${pathname === `/tools/${tool.slug}`
                            ? "bg-violet-500/10 text-violet-400 font-medium"
                            : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                          }
                        `}
                      >
                        {/* Active indicator */}
                        {pathname === `/tools/${tool.slug}` && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-violet-500 rounded-full -ml-3" />
                        )}
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </aside>

      {/* Main Content Spacer */}
      <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"}`} />
    </>
  );
}
