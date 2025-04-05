import {Hono} from "hono";
import { getEnvOrFail } from "../utils";

export class Server {
    private static instance: Server | null = null;
    private app: Hono;

    private constructor() {
        this.app = new Hono();
        this.routes();
    }

    private routes() {
        this.app.get("/ping", (c) => c.text("pong"));
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