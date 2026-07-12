import { describe, expect, it } from "vitest";
import { formatEntryDate } from "../app/format-entry-date";

function localIso(year: number, month: number, day: number, hour: number, minute: number): string {
  return new Date(year, month, day, hour, minute).toISOString();
}

const now = new Date(2026, 6, 14, 16, 0);

describe("formatEntryDate", () => {
  it("formats an entry created today", () => {
    expect(formatEntryDate(localIso(2026, 6, 14, 14, 35), now)).toBe("Сегодня, 14:35");
  });

  it("formats an entry created yesterday", () => {
    expect(formatEntryDate(localIso(2026, 6, 13, 21, 10), now)).toBe("Вчера, 21:10");
  });

  it("formats an older entry without the current year", () => {
    expect(formatEntryDate(localIso(2026, 6, 12, 9, 20), now)).toBe("12 июля, 09:20");
  });

  it("includes a different year", () => {
    expect(formatEntryDate(localIso(2025, 6, 12, 9, 20), now)).toBe("12 июля 2025, 09:20");
  });

  it("returns null for invalid or missing timestamps", () => {
    expect(formatEntryDate("not-a-date", now)).toBeNull();
    expect(formatEntryDate(undefined, now)).toBeNull();
  });
});
