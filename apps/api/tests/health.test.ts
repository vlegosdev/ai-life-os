import { describe, expect, it } from "vitest";
import { healthResponseSchema } from "../src/health.js";
import { buildApp } from "../src/app.js";

describe("GET /health", () => {
  it("returns a typed successful response", async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);

    const body: unknown = response.json();
    expect(healthResponseSchema.parse(body)).toEqual({ status: "ok" });

    await app.close();
  });
});
