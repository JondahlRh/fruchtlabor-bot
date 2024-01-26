import cors from "cors";
import express from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import checkApikey from "./controllers/checkApikey";
import { errorRoute, unkownRouteError } from "./controllers/errors";
import channel from "./routes/channel";
import client from "./routes/client";
import servergroup from "./routes/servergroup";

export default (teamspeak: TeamSpeak) => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(checkApikey);

  app.use("/v1/servergroup", servergroup(teamspeak));
  app.use("/v1/channel", channel(teamspeak));
  app.use("/v1/client", client(teamspeak));

  app.use(unkownRouteError);
  app.use(errorRoute);

  console.log(`Listening on htttp://0.0.0.0:${process.env.API_PORT}/`);
  app.listen(Number(process.env.API_PORT));
};
