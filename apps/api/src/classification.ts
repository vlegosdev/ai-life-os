import { z } from "zod";

export const categorySchema = z.enum(["task", "expense", "goal", "idea", "note"]);

export type Category = z.infer<typeof categorySchema>;

const expensePhrases = ["потратил", "заплатил", "купил"];
const goalPhrases = ["хочу", "цель", "накопить", "научиться"];
const ideaPhrases = ["идея", "можно сделать", "придумал"];
const taskPhrases = ["надо", "нужно", "купить", "позвонить", "сделать"];
const amountOrCurrency = /\d+(?:[.,]\d+)?|₽|руб(?:ль|ля|лей)?|доллар(?:а|ов)?|usd|eur|€|\$/i;

function includesPhrase(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

export function classifyEntry(text: string): Category {
  const normalizedText = text.toLocaleLowerCase("ru-RU");

  if (includesPhrase(normalizedText, expensePhrases) && amountOrCurrency.test(normalizedText)) {
    return "expense";
  }

  if (includesPhrase(normalizedText, goalPhrases)) {
    return "goal";
  }

  if (includesPhrase(normalizedText, ideaPhrases)) {
    return "idea";
  }

  if (includesPhrase(normalizedText, taskPhrases)) {
    return "task";
  }

  return "note";
}
