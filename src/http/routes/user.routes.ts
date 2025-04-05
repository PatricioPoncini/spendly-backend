import { Hono } from "hono";
import { z } from "zod";
import { User } from "@db/models";
import { schemaValidator } from "@utils/validator";
import { hashPassword } from "@utils/password";

const createUserSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  userName: z.string().nonempty(),
  password: z.string().nonempty(),
});

const router = new Hono().basePath("/users");

router.post("/register", schemaValidator(createUserSchema), async (c) => {
  const data = c.req.valid("json");

  const passwordHashed = hashPassword(data.password);
  data.password = passwordHashed;

  await User.create(data);

  return c.body(null, 204);
});

// TODO: Al hacer "/login" ver de usar 'hono/jwt'

export default router;
