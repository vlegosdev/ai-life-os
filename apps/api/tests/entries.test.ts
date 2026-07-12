import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";
import { entriesSchema, entrySchema } from "../src/entries.js";

const temporaryDirectories: string[] = [];

async function createTestFilePath() {
  const directory = await mkdtemp(join(tmpdir(), "ai-life-os-entries-"));
  temporaryDirectories.push(directory);
  return join(directory, "entries.json");
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

describe("entries API", () => {
  it("rejects empty input", async () => {
    const app = await buildApp({ entriesFilePath: await createTestFilePath() });

    const response = await app.inject({
      method: "POST",
      url: "/entries",
      payload: { text: "   " },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: "Text is required" });

    await app.close();
  });

  it("stores trimmed text without changing internal wording", async () => {
    const entriesFilePath = await createTestFilePath();
    const app = await buildApp({ entriesFilePath });

    const response = await app.inject({
      method: "POST",
      url: "/entries",
      payload: { text: "  Первая   важная мысль  " },
    });

    expect(response.statusCode).toBe(201);
    const entry = entrySchema.parse(response.json());
    expect(entry.text).toBe("Первая   важная мысль");
    expect(entriesSchema.parse(JSON.parse(await readFile(entriesFilePath, "utf8")))).toEqual([
      entry,
    ]);

    await app.close();
  });

  it("returns newest entries first after an API restart", async () => {
    const entriesFilePath = await createTestFilePath();
    const firstApp = await buildApp({ entriesFilePath });

    await firstApp.inject({ method: "POST", url: "/entries", payload: { text: "Первая" } });
    await firstApp.inject({ method: "POST", url: "/entries", payload: { text: "Вторая" } });
    await firstApp.close();

    const restartedApp = await buildApp({ entriesFilePath });
    const response = await restartedApp.inject({ method: "GET", url: "/entries" });

    expect(response.statusCode).toBe(200);
    const entries = entriesSchema.parse(response.json());
    expect(entries.map((entry) => entry.text)).toEqual(["Вторая", "Первая"]);

    await restartedApp.close();
  });
});
