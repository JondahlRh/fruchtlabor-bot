import dotenv from "dotenv";

import app from "./src/app.js";

dotenv.config();
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

app();
