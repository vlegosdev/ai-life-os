import { describe, expect, it } from "vitest";
import { filterEntries, type Category } from "../app/filter-entries";

interface TestEntry {
  id: number;
  text: string;
  category: Category;
}

const entries: TestEntry[] = [
  { id: 6, text: "Call Mom", category: "task" },
  { id: 5, text: "Buy milk", category: "task" },
  { id: 4, text: "Paid 500 rubles", category: "expense" },
  { id: 3, text: "Learn piano", category: "goal" },
  { id: 2, text: "App concept", category: "idea" },
  { id: 1, text: "Quiet day", category: "note" },
];

describe("filterEntries", () => {
  it.each([
    ["task", [6, 5]],
    ["expense", [4]],
    ["goal", [3]],
    ["idea", [2]],
    ["note", [1]],
  ] as const)("filters the %s category without changing order", (category, expectedIds) => {
    expect(filterEntries(entries, "", category).map((entry) => entry.id)).toEqual(expectedIds);
  });

  it("shows every entry for the all filter", () => {
    expect(filterEntries(entries, "", "all")).toEqual(entries);
  });

  it("combines category and trimmed case-insensitive search", () => {
    expect(filterEntries(entries, "  CALL  ", "task").map((entry) => entry.id)).toEqual([6]);
    expect(filterEntries(entries, "paid", "goal")).toEqual([]);
  });

  it("updates results when an entry category changes", () => {
    const correctedEntries = entries.map((entry) =>
      entry.id === 6 ? { ...entry, category: "goal" as const } : entry,
    );

    expect(filterEntries(correctedEntries, "", "task").map((entry) => entry.id)).toEqual([5]);
    expect(filterEntries(correctedEntries, "", "goal").map((entry) => entry.id)).toEqual([6, 3]);
  });

  it("removes a deleted entry from an active filter", () => {
    expect(
      filterEntries(
        entries.filter((entry) => entry.id !== 5),
        "",
        "task",
      ).map((entry) => entry.id),
    ).toEqual([6]);
  });
});
