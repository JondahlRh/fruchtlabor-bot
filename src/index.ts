import { config } from "dotenv";

import app from "./app";

config();
config({ path: `./.env.${process.env.NODE_ENV}` });

app();
