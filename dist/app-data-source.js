"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const getAppDataSource = () => {
    const portStr = process.env.DB_PORT || "3306";
    if (process.env.ENV_TYPE === "DEVELOPMENT") {
        return new typeorm_1.DataSource({
            type: "mysql",
            host: process.env.INSTANCE_DB_HOST,
            port: parseInt(portStr),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            synchronize: true,
            logging: false,
            migrationsTableName: "migrations",
            entities: ["src/migration/**/*.ts"],
            subscribers: ["src/subscriber/**/*.ts"],
        });
    }
    else {
        return new typeorm_1.DataSource({
            type: "mysql",
            extra: {
                socketPath: process.env.INSTANCE_UNIX_SOCKET,
            },
            port: parseInt(portStr),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            synchronize: true,
            logging: false,
            migrationsTableName: "migrations",
            entities: ["src/migration/**/*.ts"],
            subscribers: ["src/subscriber/**/*.ts"],
        });
    }
};
exports.getAppDataSource = getAppDataSource;
