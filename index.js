import dotenv from "dotenv";

import app from "./src/app.js";

dotenv.config();

switch (process.env.NODE_ENV) {
  case "development":
    dotenv.config({ path: "./.env.dev" });
    break;

  case "production":
    dotenv.config({ path: "./.env.prod" });
    break;

  default:
    throw new Error("NODE_ENV variabale not supported or provied!");
}

app();
