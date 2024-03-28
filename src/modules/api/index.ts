import cors from "cors";
import express from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import checkApikey from "./controllers/checkApikey";
import { unkownRouteController, errorController } from "./controllers/error";
import channel from "./routes/channel";
import client from "./routes/client";
import servergroup from "./routes/servergroup";

export default (teamspeak: TeamSpeak) => {
  console.log("feature enabled api");

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(checkApikey);

  app.use("/v1/servergroup", servergroup(teamspeak));
  app.use("/v1/channel", channel(teamspeak));
  app.use("/v1/client", client(teamspeak));

  app.use(unkownRouteController);
  app.use(errorController);

  app.listen(Number(process.env.INTERNAL_PORT), () => {
    console.log(`Listening on Port ${process.env.INTERNAL_PORT}`);
  });
};
