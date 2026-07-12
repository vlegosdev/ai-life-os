import { describe, expect, it } from "vitest";
import { classifyEntry } from "../src/classification.js";

describe("classifyEntry", () => {
  it.each([
    ["Надо позвонить завтра", "task"],
    ["Заплатил 500 рублей за интернет", "expense"],
    ["Хочу научиться плавать", "goal"],
    ["Можно сделать небольшой прототип", "idea"],
    ["Сегодня был спокойный день", "note"],
  ] as const)("classifies %s as %s", (text, expectedCategory) => {
    expect(classifyEntry(text)).toBe(expectedCategory);
  });

  it("requires an amount or currency for an expense", () => {
    expect(classifyEntry("Купил хлеб")).toBe("note");
  });
});
