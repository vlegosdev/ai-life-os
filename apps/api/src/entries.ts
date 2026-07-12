import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { categorySchema, classifyEntry, type Category } from "./classification.js";

const storedEntrySchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  createdAt: z.string().optional(),
  category: categorySchema.optional(),
});

export const entrySchema = storedEntrySchema.extend({ category: categorySchema });
export const entriesSchema = z.array(entrySchema);
const storedEntriesSchema = z.array(storedEntrySchema);

export const createEntrySchema = z.object({
  text: z.string(),
});

export const updateEntryCategorySchema = z.object({
  category: categorySchema,
});

export type Entry = z.infer<typeof entrySchema>;

export const DEFAULT_ENTRIES_FILE_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../local-data/entries.json",
);

function isMissingFile(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export async function readEntries(filePath: string): Promise<Entry[]> {
  try {
    const contents = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(contents);
    const storedEntries = storedEntriesSchema.parse(parsed);
    const entries = storedEntries.map((entry) => ({
      ...entry,
      category: entry.category ?? classifyEntry(entry.text),
    }));

    if (storedEntries.some((entry) => entry.category === undefined)) {
      await writeEntries(filePath, entries);
    }

    return entries;
  } catch (error) {
    if (isMissingFile(error)) {
      return [];
    }

    throw error;
  }
}

async function writeEntries(filePath: string, entries: Entry[]): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });

  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  await rename(temporaryPath, filePath);
}

export async function createEntry(filePath: string, text: string): Promise<Entry> {
  const entries = await readEntries(filePath);
  const entry: Entry = {
    id: randomUUID(),
    text,
    createdAt: new Date().toISOString(),
    category: classifyEntry(text),
  };

  await writeEntries(filePath, [entry, ...entries]);

  return entry;
}

export async function deleteEntry(filePath: string, id: string): Promise<boolean> {
  const entries = await readEntries(filePath);
  const entryIndex = entries.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return false;
  }

  await writeEntries(filePath, [...entries.slice(0, entryIndex), ...entries.slice(entryIndex + 1)]);

  return true;
}

export async function updateEntryCategory(
  filePath: string,
  id: string,
  category: Category,
): Promise<Entry | null> {
  const entries = await readEntries(filePath);
  const entryIndex = entries.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return null;
  }

  const existingEntry = entries[entryIndex];

  if (!existingEntry) {
    return null;
  }

  const updatedEntry: Entry = { ...existingEntry, category };
  const updatedEntries = [...entries];
  updatedEntries[entryIndex] = updatedEntry;
  await writeEntries(filePath, updatedEntries);

  return updatedEntry;
}
