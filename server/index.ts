import express, { Express } from "express";
import dotenv from "dotenv";
import { buildApp } from "./app";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const endpoint = buildApp(app);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${port}${endpoint}`
  );
});
