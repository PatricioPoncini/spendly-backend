import {
  getSevenDaysExp,
  getThirtyMinutesExp,
  signAccessJWT,
  signRefreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "@utils/jwt";
import { describe, expect, test } from "bun:test";
import type { JWTPayload } from "hono/utils/jwt/types";

describe("JWT utility tests", () => {
  describe("Access JWT", () => {
    const accessJwtPayload = {
      sub: Bun.randomUUIDv7(),
      exp: getThirtyMinutesExp(),
    } satisfies JWTPayload;

    test("Should sign and verify a valid access JWT", async () => {
      const token = await signAccessJWT(accessJwtPayload);
      const decodedPayload = await verifyAccessJWT(token);

      expect(token).not.toBe("");
      expect(decodedPayload.sub).toEqual(accessJwtPayload.sub);
    });

    test("Should throw error for access token with invalid signature", async () => {
      const token = await signAccessJWT(accessJwtPayload);
      const tamperedToken = token.replace(/\w$/, "x");

      try {
        await verifyAccessJWT(tamperedToken);
      } catch (error) {
        expect(error).toBeDefined();
        const err = error as Error;
        expect(err.message).toEqual(
          `token(${tamperedToken}) signature mismatched`,
        );
      }
    });

    test("Should throw error for expired access token", async () => {
      const expiredAccessJwtPayload = {
        sub: Bun.randomUUIDv7(),
        exp: Math.floor(Date.now() / 1000) - 10,
      } satisfies JWTPayload;

      const token = await signAccessJWT(expiredAccessJwtPayload);

      try {
        await verifyAccessJWT(token);
      } catch (error) {
        expect(error).toBeDefined();
        const err = error as Error;
        expect(err.message).toEqual(`token (${token}) expired`);
      }
    });
  });

  describe("Refresh JWT", () => {
    const refreshJwtPayload = {
      sub: Bun.randomUUIDv7(),
      exp: getSevenDaysExp(),
    } satisfies JWTPayload;

    test("Should sign and verify a refresh JWT", async () => {
      const token = await signRefreshJWT(refreshJwtPayload);
      const decodedPayload = await verifyRefreshJWT(token);

      expect(token).not.toBe("");
      expect(decodedPayload.sub).toEqual(refreshJwtPayload.sub);
      expect(decodedPayload.exp).toEqual(refreshJwtPayload.exp);
    });

    test("Should throw error for refresh token with invalid signature", async () => {
      const token = await signRefreshJWT(refreshJwtPayload);
      const tamperedToken = token.replace(/\w$/, "x");

      try {
        await verifyRefreshJWT(tamperedToken);
      } catch (error) {
        expect(error).toBeDefined();
        const err = error as Error;
        expect(err.message).toEqual(
          `token(${tamperedToken}) signature mismatched`,
        );
      }
    });

    test("Should throw error for expired refresh token", async () => {
      const expiredRefreshJwtPayload = {
        sub: Bun.randomUUIDv7(),
        exp: Math.floor(Date.now() / 1000) - 10,
      } satisfies JWTPayload;

      const token = await signRefreshJWT(expiredRefreshJwtPayload);

      try {
        await verifyRefreshJWT(token);
      } catch (error) {
        expect(error).toBeDefined();
        const err = error as Error;
        expect(err.message).toEqual(`token (${token}) expired`);
      }
    });
  });
});
