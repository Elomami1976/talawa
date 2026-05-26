import duasData from "@/data/duas.json";

export interface Dua {
  id: number;
  arabic: string;
  repeat: string;
  reference: string;
}

export interface DuaCategory {
  id: number;
  title: string;
  audioUrl: string;
  duas: Dua[];
}

export const duaCategories = duasData as DuaCategory[];

export function getDuaCategoryById(id: number): DuaCategory | undefined {
  return duaCategories.find((c) => c.id === id);
}

/**
 * Parses the "repeat" field which may be a number, "1", "3", "100"
 * or an Arabic descriptor.
 */
export function parseRepeat(repeat: string): number {
  const n = parseInt(repeat, 10);
  if (!isNaN(n) && n > 0) return n;
  return 1;
}
