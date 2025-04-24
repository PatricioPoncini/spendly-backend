import { sign, verify } from "hono/jwt";
import { getEnvOrFail } from "./env";
import type { JWTPayload } from "hono/utils/jwt/types";

export const signAccessJWT = async (payload: JWTPayload) => {
  return await sign(payload, getEnvOrFail("JWT_SECRET"), "HS256");
};

export const signRefreshJWT = async (payload: JWTPayload) => {
  return await sign(payload, getEnvOrFail("REFRESH_JWT_SECRET"), "HS256");
};

export const verifyAccessJWT = async (token: string) => {
  return await verify(token, getEnvOrFail("JWT_SECRET"), "HS256");
};

export const verifyRefreshJWT = async (token: string) => {
  return await verify(token, getEnvOrFail("REFRESH_JWT_SECRET"), "HS256");
};

export const getSevenDaysExp = () =>
  Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

export const getThirtyMinutesExp = () =>
  Math.floor(Date.now() / 1000) + 60 * 30;
