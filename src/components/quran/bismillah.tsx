import { cn } from "@/lib/utils";

interface BismillahProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const BISMILLAH_TEXT = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

export function Bismillah({ className, size = "md" }: BismillahProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl md:text-5xl",
  };

  return (
    <div className={cn("flex justify-center py-6", className)}>
      <p
        className={cn(
          "font-arabic text-primary leading-loose tracking-wide",
          sizeClasses[size]
        )}
        dir="rtl"
        lang="ar"
        aria-label="Bismillah"
      >
        {BISMILLAH_TEXT}
      </p>
    </div>
  );
}
