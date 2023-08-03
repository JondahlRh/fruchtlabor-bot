import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./.env.prod" });
} else {
  dotenv.config({ path: "./.env.dev" });
}

app();
