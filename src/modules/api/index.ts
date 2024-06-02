import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { TeamSpeak } from "ts3-nodejs-library";

import { unknownRouteController, errorController } from "./controllers/error";
import auth from "./routes/auth";
import bot from "./routes/bot";
import channel from "./routes/channel";
import client from "./routes/client";
import servergroup from "./routes/servergroup";
import swaggerDocs from "./swagger";

export default (teamspeak: TeamSpeak) => {
  console.log("feature enabled api");

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use("/v1/auth", auth());
  app.use("/v1/bot", bot(teamspeak));

  app.use("/v1/servergroup", servergroup(teamspeak));
  app.use("/v1/channel", channel(teamspeak));
  app.use("/v1/client", client(teamspeak));

  app.use(unknownRouteController);
  app.use(errorController);

  app.listen(+process.env.INTERNAL_PORT, () => {
    console.log(`Listening on Port ${process.env.INTERNAL_PORT}`);
  });
};
