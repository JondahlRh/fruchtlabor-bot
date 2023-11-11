import dotenv from "dotenv";

import app from "./app";

dotenv.config();
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

app();
