import { QueryInterface, Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import user from "@db/models/User";
import fs from "fs/promises";
import { getEnvOrFail } from "@utils/env";

export class Database {
  private static instance: Database | null = null;
  private sequelize: Sequelize;
  private migrator: Umzug<QueryInterface>;

  private constructor() {
    this.sequelize = new Sequelize(getEnvOrFail("POSTGRES_URL"));
    this.migrator = new Umzug({
      migrations: {
        glob: "src/db/migrations/*.up.sql",
        resolve: ({ name, path: filePath }) => ({
          name,
          up: async () => {
            if (!filePath) {
              throw new Error(`Missing file path for migration: ${name}`);
            }
            const sql = await fs.readFile(filePath, "utf-8");
            await this.sequelize.query(sql);
          },
        }),
      },
      context: this.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.sequelize }),
      logger: console,
    });
  }

  public static op(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async start() {
    await this.sequelize.authenticate();
    await this.migrator.up();
    this.initializeModels(this.sequelize);
    console.log(
      `\x1b[32m💾 Connection has been established successfully\x1b[0m`,
    );
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  private initializeModels(sequelize: Sequelize) {
    const models = [user];
    for (const model of models) {
      model.init(sequelize);
    }
    for (const model of models) {
      model.associate();
    }
  }
}
