export const categories = ["task", "expense", "goal", "idea", "note"] as const;

export type Category = (typeof categories)[number];
export type CategoryFilter = Category | "all";

export interface FilterableEntry {
  text: string;
  category: Category;
}

export function isCategory(value: unknown): value is Category {
  return categories.some((category) => category === value);
}

export function filterEntries<Entry extends FilterableEntry>(
  entries: Entry[],
  search: string,
  categoryFilter: CategoryFilter,
): Entry[] {
  const normalizedSearch = search.trim().toLowerCase();

  return entries.filter(
    (entry) =>
      (categoryFilter === "all" || entry.category === categoryFilter) &&
      (!normalizedSearch || entry.text.toLowerCase().includes(normalizedSearch)),
  );
}
