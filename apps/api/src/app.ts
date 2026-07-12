import Fastify from "fastify";
import {
  createEntry,
  createEntrySchema,
  DEFAULT_ENTRIES_FILE_PATH,
  deleteEntry,
  readEntries,
} from "./entries.js";
import { HEALTH_RESPONSE } from "./health.js";

interface BuildAppOptions {
  entriesFilePath?: string;
}

export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({ logger: false });
  const entriesFilePath = options.entriesFilePath ?? DEFAULT_ENTRIES_FILE_PATH;
  let pendingWrite = Promise.resolve();

  function queueWrite<Result>(operation: () => Promise<Result>): Promise<Result> {
    const result = pendingWrite.then(operation);
    pendingWrite = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  app.get("/health", async () => HEALTH_RESPONSE);

  app.get("/entries", async (_request, reply) => {
    reply.header("cache-control", "no-store");
    return readEntries(entriesFilePath);
  });

  app.post("/entries", async (request, reply) => {
    const parsed = createEntrySchema.safeParse(request.body);
    const text = parsed.success ? parsed.data.text.trim() : "";

    if (!text) {
      return reply.code(400).send({ error: "Text is required" });
    }

    const entry = await queueWrite(() => createEntry(entriesFilePath, text));
    return reply.code(201).send(entry);
  });

  app.delete<{ Params: { id: string } }>("/entries/:id", async (request, reply) => {
    const deleted = await queueWrite(() => deleteEntry(entriesFilePath, request.params.id));

    if (!deleted) {
      return reply.code(404).send({ error: "Entry not found" });
    }

    return reply.code(204).send();
  });

  return app;
}
