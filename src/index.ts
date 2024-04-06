import "dotenv";

import app from "./app";
import proccesEnvParse from "./utility/proccesEnvParse";

proccesEnvParse();

app();
