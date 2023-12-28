import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import checkApikey from "./controller/checkApikey";
import { errorRoute, unkownRouteError } from "./controller/errors";
import channel from "./route/channel";
import client from "./route/client";
import servergroup from "./route/servergroup";

export default (teamspeak: TeamSpeak) => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.use(checkApikey);

  app.use("/servergroup", servergroup(teamspeak));
  app.use("/channel", channel(teamspeak));
  app.use("/client", client(teamspeak));

  app.use(unkownRouteError);
  app.use(errorRoute);

  console.log(`Listening on http://localhost:${process.env.API_PORT}/`);
  app.listen(Number(process.env.API_PORT));
};
