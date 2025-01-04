// components/LoadingSkeleton.tsx
export const NavSkeleton = () => {
  return (
    <div className="h-14 border-b border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 md:px-8 h-full animate-pulse">
        <div className="w-24 h-6 bg-primary/10 rounded" />
        <div className="hidden md:flex items-center gap-4">
          <div className="w-20 h-8 bg-primary/10 rounded-full" />
          <div className="w-8 h-8 bg-primary/10 rounded-full" />
        </div>
        <div className="flex md:hidden items-center gap-2">
          <div className="w-12 h-8 bg-primary/10 rounded-full" />
          <div className="w-8 h-8 bg-primary/10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const SideNavSkeleton = () => {
  return (
    <div className="w-64 p-4">
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-primary/10 rounded-lg" />
        ))}
      </div>
    </div>
  );
};