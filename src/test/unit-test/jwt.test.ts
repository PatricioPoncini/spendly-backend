import { signJWT, verifyJWT } from "@utils/jwt";
import { describe, expect, test } from "bun:test";
import type { JWTPayload } from "hono/utils/jwt/types";

describe("JWT utility tests", () => {
  const payload: JWTPayload = {
    sub: Bun.randomUUIDv7(),
    exp: Math.floor(Date.now() / 1000) + 60,
  };

  test("Should sign and verify a valid JWT", async () => {
    const token = await signJWT(payload);
    const decodedPayload = await verifyJWT(token);

    expect(token).not.toBe("");
    expect(decodedPayload.sub).toEqual(payload.sub);
  });

  test("Should throw error for token with invalid signature", async () => {
    const token = await signJWT(payload);
    const tamperedToken = token.replace(/\w$/, "x");

    try {
      await verifyJWT(tamperedToken);
    } catch (error) {
      expect(error).toBeDefined();
      const err = error as Error;
      expect(err.message).toEqual(
        `token(${tamperedToken}) signature mismatched`,
      );
    }
  });

  test("Should throw error for expired token", async () => {
    const expiredPayload: JWTPayload = {
      sub: Bun.randomUUIDv7(),
      exp: Math.floor(Date.now() / 1000) - 10,
    };

    const token = await signJWT(expiredPayload);

    try {
      await verifyJWT(token);
    } catch (error) {
      expect(error).toBeDefined();
      const err = error as Error;
      expect(err.message).toEqual(`token (${token}) expired`);
    }
  });
});
