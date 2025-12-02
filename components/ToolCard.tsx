import Link from "next/link";
import { ToolConfig } from "@/lib/tools-config";
import { getCategoryIcon, ArrowUpRightIcon } from "@/assets/icons";

interface ToolCardProps {
  tool: ToolConfig;
}

export function ToolCard({ tool }: ToolCardProps) {
  const categoryColors: Record<string, { bg: string; text: string }> = {
    text: { bg: "bg-blue-500/10", text: "text-blue-400" },
    image: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    dev: { bg: "bg-orange-500/10", text: "text-orange-400" },
    converter: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
    generator: { bg: "bg-violet-500/10", text: "text-violet-400" },
    security: { bg: "bg-rose-500/10", text: "text-rose-400" },
    misc: { bg: "bg-gray-500/10", text: "text-gray-400" },
  };

  const colors = categoryColors[tool.category] || categoryColors.misc;
  const IconComponent = getCategoryIcon(tool.category);

  return (
    <Link href={`/tools/${tool.slug}`}>
      <div className="tool-card group bg-[var(--card)] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 h-full cursor-pointer active:scale-[0.98] transition-transform">
        {/* Header with icon badge */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${colors.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
            <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
          </div>
          <ArrowUpRightIcon 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:text-violet-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
          />
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 group-hover:text-violet-400 transition-colors duration-300 line-clamp-1">
          {tool.name}
        </h3>
        
        {/* Description with better line height */}
        <p className="text-[11px] sm:text-xs text-[var(--muted-foreground)] line-clamp-2 mb-3 sm:mb-4" style={{ lineHeight: '1.5' }}>
          {tool.description}
        </p>
        
        {/* Footer with category and badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className={`text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg ${colors.bg} ${colors.text} font-medium uppercase tracking-wider`}>
            {tool.category}
          </span>
          {tool.isNew && (
            <span className="text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 font-semibold flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" />
              New
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
