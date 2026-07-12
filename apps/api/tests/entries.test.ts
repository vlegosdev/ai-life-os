import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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

  it("deletes only the matching entry", async () => {
    const entriesFilePath = await createTestFilePath();
    const app = await buildApp({ entriesFilePath });

    const firstResponse = await app.inject({
      method: "POST",
      url: "/entries",
      payload: { text: "Оставить" },
    });
    const secondResponse = await app.inject({
      method: "POST",
      url: "/entries",
      payload: { text: "Удалить" },
    });
    const firstEntry = entrySchema.parse(firstResponse.json());
    const secondEntry = entrySchema.parse(secondResponse.json());

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: `/entries/${secondEntry.id}`,
    });

    expect(deleteResponse.statusCode).toBe(204);
    expect(deleteResponse.body).toBe("");
    expect(entriesSchema.parse(JSON.parse(await readFile(entriesFilePath, "utf8")))).toEqual([
      firstEntry,
    ]);

    await app.close();
  });

  it("returns 404 without modifying entries when the id is missing", async () => {
    const entriesFilePath = await createTestFilePath();
    const app = await buildApp({ entriesFilePath });
    const createResponse = await app.inject({
      method: "POST",
      url: "/entries",
      payload: { text: "Сохранить" },
    });
    const entry = entrySchema.parse(createResponse.json());

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: "/entries/00000000-0000-4000-8000-000000000000",
    });

    expect(deleteResponse.statusCode).toBe(404);
    expect(deleteResponse.json()).toEqual({ error: "Entry not found" });
    expect(entriesSchema.parse(JSON.parse(await readFile(entriesFilePath, "utf8")))).toEqual([
      entry,
    ]);

    await app.close();
  });

  it("classifies and safely upgrades an existing entry without changing its text", async () => {
    const entriesFilePath = await createTestFilePath();
    const legacyEntry = {
      id: "00000000-0000-4000-8000-000000000001",
      text: "Нужно   сохранить исходные слова",
      createdAt: "2026-07-13T00:00:00.000Z",
    };
    await writeFile(entriesFilePath, JSON.stringify([legacyEntry]), "utf8");
    const app = await buildApp({ entriesFilePath });

    const response = await app.inject({ method: "GET", url: "/entries" });

    expect(response.statusCode).toBe(200);
    const entries = entriesSchema.parse(response.json());
    expect(entries).toEqual([{ ...legacyEntry, category: "task" }]);
    expect(entriesSchema.parse(JSON.parse(await readFile(entriesFilePath, "utf8")))).toEqual(
      entries,
    );

    await app.close();
  });

  it("persists a manual category correction across an API restart", async () => {
    const entriesFilePath = await createTestFilePath();
    const firstApp = await buildApp({ entriesFilePath });
    const createResponse = await firstApp.inject({
      method: "POST",
      url: "/entries",
      payload: { text: "Идея оставить точную формулировку" },
    });
    const createdEntry = entrySchema.parse(createResponse.json());
    expect(createdEntry.category).toBe("idea");

    const correctionResponse = await firstApp.inject({
      method: "PATCH",
      url: `/entries/${createdEntry.id}`,
      payload: { category: "goal" },
    });

    expect(correctionResponse.statusCode).toBe(200);
    const correctedEntry = entrySchema.parse(correctionResponse.json());
    expect(correctedEntry).toEqual({ ...createdEntry, category: "goal" });
    expect(correctedEntry.text).toBe(createdEntry.text);
    await firstApp.close();

    const restartedApp = await buildApp({ entriesFilePath });
    const entriesResponse = await restartedApp.inject({ method: "GET", url: "/entries" });
    expect(entriesSchema.parse(entriesResponse.json())).toEqual([correctedEntry]);

    await restartedApp.close();
  });
});
