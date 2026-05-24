"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  className,
  defaultValue = "",
  onSearch,
  placeholder = "Search the Quran...",
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      setIsLoading(true);
      if (onSearch) {
        onSearch(query);
        setIsLoading(false);
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsLoading(false);
      }
    },
    [onSearch, router]
  );

  const debouncedSearch = useCallback(
    debounce((q: string) => handleSearch(q), 500),
    [handleSearch]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(value);
    }
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            debouncedSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-9 pr-20"
          aria-label="Search"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => handleSearch(value)}
            disabled={!value.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Search"}
          </Button>
        </div>
      </div>
    </div>
  );
}
