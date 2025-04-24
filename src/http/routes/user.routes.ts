import { Hono } from "hono";
import { z } from "zod";
import { User } from "@db/models";
import { schemaValidator } from "@utils/validator";
import { hashPassword, verifyPassword } from "@utils/password";
import type { JWTPayload } from "hono/utils/jwt/types";
import {
  getSevenDaysExp,
  getThirtyMinutesExp,
  signAccessJWT,
  signRefreshJWT,
  verifyRefreshJWT,
} from "@utils/jwt";

const createUserSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  userName: z.string().nonempty(),
  password: z.string().nonempty().min(8),
});

const loginUserSchema = z.object({
  userName: z.string().nonempty(),
  password: z.string().nonempty(),
});

const r = new Hono().basePath("/users");

r.post("/refresh", async (c) => {
  const refreshToken = c.req.raw.headers
    .get("cookie")
    ?.match(/refreshToken=([^;]+)/)?.[1];

  if (!refreshToken) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const payload = await verifyRefreshJWT(refreshToken);

  const newAccessToken = await signAccessJWT({
    sub: payload.sub, // userId
    exp: getThirtyMinutesExp(),
  });

  return c.json({ accessToken: newAccessToken });
});

r.post("/register", schemaValidator(createUserSchema), async (c) => {
  const data = c.req.valid("json");

  data.password = await hashPassword(data.password);

  await User.create(data);

  return c.body(null, 204);
});

r.post("/login", schemaValidator(loginUserSchema), async (c) => {
  const data = c.req.valid("json");

  const user = await User.findOne({ where: { userName: data.userName } });
  if (!user) {
    return c.json({ message: "Invalid credentials" }, 400);
  }

  const isValid = await verifyPassword(data.password, user.password);
  if (!isValid) {
    return c.json({ message: "Invalid credentials" }, 400);
  }

  const accessToken = await signAccessJWT({
    sub: user.id,
    exp: getThirtyMinutesExp(),
  });

  const refreshToken = await signRefreshJWT({
    sub: user.id,
    exp: getSevenDaysExp(),
  } satisfies JWTPayload);

  c.header(
    "Set-Cookie",
    `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=${getSevenDaysExp()}`,
  );

  return c.json({ accessToken: accessToken }, 200);
});

export default r;
