"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseStyles = "animate-shimmer bg-gradient-to-r from-[var(--muted)] via-[var(--border)] to-[var(--muted)] bg-[length:200%_100%]";
  
  const variantStyles = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variantStyles.text} ${className}`}
            style={{ width: i === lines - 1 ? "80%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}

// Preset loading skeletons
export function SkeletonCard() {
  return (
    <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl space-y-4">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" lines={3} />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={80} height={32} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

export function SkeletonToolLayout() {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8 py-4">
        <Skeleton variant="text" width={60} />
        <span>/</span>
        <Skeleton variant="text" width={60} />
        <span>/</span>
        <Skeleton variant="text" width={100} />
      </div>

      {/* Hero skeleton */}
      <div className="mb-10 p-10 rounded-3xl bg-[var(--muted)] space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton variant="rectangular" width={80} height={80} />
          <div className="flex-1 space-y-3">
            <Skeleton variant="text" width={300} height={32} />
            <Skeleton variant="text" lines={2} />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="tool-container space-y-6">
        <Skeleton variant="rectangular" height={240} />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
        </div>
        <Skeleton variant="rectangular" height={48} />
        <Skeleton variant="rectangular" height={240} />
      </div>
    </div>
  );
}
