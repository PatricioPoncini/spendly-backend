import { Hono } from "hono";
import { z } from "zod";
import { User } from "@db/models";
import { schemaValidator } from "@utils/validator";
import { hashPassword, verifyPassword } from "@utils/password";
import type { JWTPayload } from "hono/utils/jwt/types";
import { signJWT } from "@utils/jwt";

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

  const payload = {
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 30, // Token expires in 30 minutes
  } satisfies JWTPayload;

  const token = await signJWT(payload);

  return c.json({ token: token }, 200);
});

export default r;
