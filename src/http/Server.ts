import { Hono } from "hono";
import userRoutes from "./routes/user.routes";
import { getEnvOrFail } from "@utils/env";
import { cors } from "hono/cors";

export class Server {
  private static instance: Server | null = null;
  private app: Hono;

  private constructor() {
    this.app = new Hono();
    this.cors();
    this.routes();
  }

  private routes() {
    this.app.get("/ping", (c) => c.text("pong"));
    this.app.route("/", userRoutes);
  }

  private cors() {
    this.app.use(
      cors({
        origin: getEnvOrFail("FRONTEND_ORIGIN"),
        allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      }),
    );
  }

  public static op(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public start() {
    const port = parseInt(getEnvOrFail("PORT"));
    Bun.serve({
      fetch: this.app.fetch,
      port,
    });
    console.log(`\x1b[32m🚀 Server running on port :${port}\x1b[0m`);
  }
}
