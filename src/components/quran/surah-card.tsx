import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Surah } from "@/types";

interface SurahCardProps {
  surah: Surah;
  className?: string;
}

export function SurahCard({ surah, className }: SurahCardProps) {
  return (
    <Link href={`/surah/${surah.id}`}>
      <Card
        className={cn(
          "group p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer",
          className
        )}
      >
        <div className="flex items-center gap-3">
          {/* Surah number badge */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {surah.id}
          </div>

          {/* Surah info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{surah.nameEn}</h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                {surah.revelationType}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {surah.nameTrans} · {surah.ayahCount} verses
            </p>
          </div>

          {/* Arabic name */}
          <div className="text-right shrink-0">
            <p
              className="text-lg font-arabic leading-none text-primary"
              dir="rtl"
              lang="ar"
            >
              {surah.nameAr}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
