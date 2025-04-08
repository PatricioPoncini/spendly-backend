import { verifyJWT } from "@utils/jwt";
import { createFactory } from "hono/factory";
import type { AuthEnv, AuthenticatedUser } from "types";

export const authMiddleware = createFactory<AuthEnv>().createMiddleware(
  async (c, next) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    try {
      const decoded = await verifyJWT(token);
      const user = {
        userId: decoded.sub,
      } as AuthenticatedUser;

      c.set("user", user);

      await next();
    } catch (err) {
      console.error(err);
      return c.json({ message: "Invalid or expired token" }, 401);
    }
  },
);
