import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

export const getAppDataSource = () => {
  const portStr: string = process.env.DB_PORT || "3306";
  if (process.env.ENV_TYPE === "DEVELOPMENT") {
    return new DataSource({
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
  } else {
    return new DataSource({
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
