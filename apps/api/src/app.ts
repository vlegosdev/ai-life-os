import Fastify from "fastify";
import { HEALTH_RESPONSE } from "./health.js";

export async function buildApp() {
  const app = Fastify({ logger: false });

  app.get("/health", async () => HEALTH_RESPONSE);

  return app;
}
