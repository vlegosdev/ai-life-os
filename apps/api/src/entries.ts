import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

export const entrySchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  createdAt: z.string().datetime(),
});

export const entriesSchema = z.array(entrySchema);

export const createEntrySchema = z.object({
  text: z.string(),
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
    return entriesSchema.parse(parsed);
  } catch (error) {
    if (isMissingFile(error)) {
      return [];
    }

    throw error;
  }
}

export async function createEntry(filePath: string, text: string): Promise<Entry> {
  const entries = await readEntries(filePath);
  const entry: Entry = {
    id: randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  };

  await mkdir(dirname(filePath), { recursive: true });

  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify([entry, ...entries], null, 2)}\n`, "utf8");
  await rename(temporaryPath, filePath);

  return entry;
}
