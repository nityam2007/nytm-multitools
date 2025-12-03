"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { toolsConfig } from "@/lib/tools-config";
import {
  HomeIcon,
  GridIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
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
  const categoryOrder = ["text", "dev", "image", "converter", "generator", "security", "misc"];

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
  const [collapsed, setCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for sidebar state
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
    // Default collapsed on mobile
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
  }, [collapsed, mounted]);

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
export function SidebarToggle({ className = "" }: { className?: string }) {
  const { toggle, isOpen, collapsed, setCollapsed } = useSidebar();

  const handleClick = () => {
    if (window.innerWidth < 1024) {
      toggle();
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg hover:bg-[var(--muted)] transition-all duration-200 ${className}`}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      title={isOpen ? "Close sidebar (Esc)" : "Open sidebar"}
    >
      <MenuIcon className="w-5 h-5" />
    </button>
  );
}

// Navigation items with SVG icons
const navItems = [
  { href: "/", label: "Home", exact: true },
  { href: "/tools", label: "All Tools", exact: true },
];

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

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, collapsed, setCollapsed } = useSidebar();
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate categories from tools config
  const sidebarCategories = useMemo(() => generateSidebarCategories(), []);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return sidebarCategories;
    
    const query = searchQuery.toLowerCase();
    return sidebarCategories
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter((tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.slug.toLowerCase().includes(query)
        ),
      }))
      .filter((cat) => cat.tools.length > 0);
  }, [sidebarCategories, searchQuery]);

  // Auto-expand category if search matches
  useEffect(() => {
    if (searchQuery) {
      setOpenCategories(filteredCategories.map(c => c.id));
    }
  }, [searchQuery, filteredCategories]);

  // Auto-expand active category
  useEffect(() => {
    if (pathname?.startsWith("/tools/")) {
      const toolSlug = pathname.replace("/tools/", "");
      const category = sidebarCategories.find(cat => 
        cat.tools.some(t => t.slug === toolSlug)
      );
      if (category && !openCategories.includes(category.id)) {
        setOpenCategories(prev => [...prev, category.id]);
      }
    }
  }, [pathname, sidebarCategories]);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 
        bg-[var(--background)] border-r border-[var(--border)]
        transition-all duration-300 ease-out overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
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
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsOpen(false);
              } else {
                setCollapsed(!collapsed);
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
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[var(--muted)] border border-transparent text-sm focus:border-violet-500/40 focus:bg-violet-500/5 placeholder-[var(--muted-foreground)] transition-all duration-200"
              />
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 kbd text-[10px]">/</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`space-y-1 ${collapsed ? 'p-2' : 'p-3'}`}>
          {/* Home */}
          <Tooltip text="Home" show={collapsed}>
            <Link
              href="/"
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive("/", true)
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
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
              onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive("/tools", true)
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
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
        <div className={`flex-1 overflow-y-auto overflow-x-hidden pb-20 ${collapsed ? 'px-2' : 'px-3'}`} style={{ maxHeight: "calc(100vh - 260px)" }}>
          {filteredCategories.map((category) => {
            const IconComponent = getCategoryIcon(category.id);
            return (
              <div key={category.id} className="mb-1">
                <Tooltip text={`${category.name} (${category.tools.length})`} show={collapsed}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]
                      ${collapsed ? "justify-center !px-2" : ""}
                      ${openCategories.includes(category.id) && !collapsed ? "bg-[var(--muted)] text-[var(--foreground)]" : ""}
                    `}
                  >
                    <div className={`flex items-center justify-center flex-shrink-0 ${collapsed ? 'min-w-[24px]' : ''}`}>
                      <IconComponent className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} ${openCategories.includes(category.id) ? 'text-violet-500' : ''}`} />
                    </div>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-sm text-left font-medium">{category.name}</span>
                        <span className="text-[10px] text-[var(--muted-foreground)] bg-[var(--muted)] px-1.5 py-0.5 rounded-md tabular-nums">{category.tools.length}</span>
                        <ChevronDownIcon className={`w-3.5 h-3.5 text-[var(--muted-foreground)] transition-transform duration-200 ${openCategories.includes(category.id) ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </button>
                </Tooltip>
                
                {!collapsed && openCategories.includes(category.id) && (
                  <div className="ml-5 pl-3 border-l-2 border-violet-500/20 space-y-0.5 mt-1.5 mb-3">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
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
