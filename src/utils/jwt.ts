import { sign, verify } from "hono/jwt";
import { getEnvOrFail } from "./env";
import type { JWTPayload } from "hono/utils/jwt/types";

export const signJWT = async (payload: JWTPayload) => {
  return await sign(payload, getEnvOrFail("JWT_SECRET"), "HS256");
};

export const verifyJWT = async (token: string) => {
  return await verify(token, getEnvOrFail("JWT_SECRET"), "HS256");
};
