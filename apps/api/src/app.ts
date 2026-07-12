import Fastify from "fastify";
import {
  createEntry,
  createEntrySchema,
  DEFAULT_ENTRIES_FILE_PATH,
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

    const write = pendingWrite.then(() => createEntry(entriesFilePath, text));
    pendingWrite = write.then(
      () => undefined,
      () => undefined,
    );

    const entry = await write;
    return reply.code(201).send(entry);
  });

  return app;
}
