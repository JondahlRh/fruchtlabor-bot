import { config } from "dotenv";

import app from "./app";
import proccesEnvParse from "./utility/proccesEnvParse";

config();
proccesEnvParse();

app();
