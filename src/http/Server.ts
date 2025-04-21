import { Hono } from "hono";
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes";
import expenseRoutes from "./routes/expense.routes";
import { getEnvOrFail } from "@utils/env";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

export class Server {
  private static instance: Server | null = null;
  private app: Hono;

  private constructor() {
    this.app = new Hono();
    this.logger();
    this.cors();
    this.routes();
  }

  private routes() {
    this.app.get("/ping", (c) => c.json({message: "pong"}));
    this.app.route("/", userRoutes);
    this.app.route("/", categoryRoutes);
    this.app.route("/", expenseRoutes);
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

  private logger() {
    this.app.use(logger());
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
