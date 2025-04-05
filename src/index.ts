import { Database } from "./db";
import { Server } from "./http";

try {
  Server.op().start();
  Database.op().start();
} catch (e) {
  console.error(e);
}
