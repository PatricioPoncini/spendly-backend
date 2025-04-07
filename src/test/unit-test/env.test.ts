import { getEnvOrFail } from "@utils/env";
import { describe, expect, test } from "bun:test";

describe("Environment variable utility", () => {
  test("Should return value when environment variable is defined", () => {
    Bun.env.PORT = "3000";
    const value = getEnvOrFail("PORT");
    expect(value).not.toBe("");
    expect(value).toEqual("3000");
  });

  test("Should throw error when environment variable is missing", () => {
    Bun.env.PORT = "";

    try {
      getEnvOrFail("PORT");
      throw new Error("Expected error was not thrown");
    } catch (error) {
      expect(error).toBeDefined();
      const err = error as { message: string };
      expect(err.message).toEqual(
        'Environment variable "PORT" is required but was not found.',
      );
    }
  });
});
