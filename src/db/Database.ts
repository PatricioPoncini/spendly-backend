import { Sequelize } from "sequelize";
import { getEnvOrFail } from "../utils";

export class Database {
    private static instance: Database | null = null;
    private sequelize: Sequelize;

    private constructor() {
        this.sequelize = new Sequelize(getEnvOrFail("POSTGRES_URL"));          
    }

    public static op(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async start() {
        await this.sequelize.authenticate();
        await this.sequelize.sync({alter: true}) // TODO: Remover y dejarlo en false, manejarse con migraciones
        console.log(`\x1b[32m💾 Connection has been established successfully\x1b[0m`);
    }
}