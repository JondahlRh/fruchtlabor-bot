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

  app.use(express.json());
  app.use(cors());

  app.use(checkApikey);

  app.use("/v1/servergroup", servergroup(teamspeak));
  app.use("/v1/channel", channel(teamspeak));
  app.use("/v1/client", client(teamspeak));

  app.use(unkownRouteError);
  app.use(errorRoute);

  console.log(`Listening on ${process.env.API_HOST}:${process.env.API_PORT}/`);
  app.listen(Number(process.env.API_PORT), String(process.env.API_HOST));
};
