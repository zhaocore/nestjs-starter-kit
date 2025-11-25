import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { getConfig } from "./src/config/configuration";

dotenv.config();

const {
	database: { host, port, password, user, dbName, dbType },
} = getConfig();

export default new DataSource({
	type: dbType,
	host,
	port,
	username: user,
	password,
	database: dbName,
	logging: true,
	entities: ["dist/**/*.entity.ts"],
	migrations: ["src/**/migrations/*.ts"],
	subscribers: ["src/**/subscribers/*.ts"],
});
