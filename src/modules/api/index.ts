import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { TeamSpeak } from "ts3-nodejs-library";

import { unknownRouteController, errorController } from "./controllers/error";
import admin from "./routes/admin";
import channel from "./routes/channel";
import client from "./routes/client";
import servergroup from "./routes/servergroup";
import swaggerSpec from "./utility/swaggerConfig";

export default (teamspeak: TeamSpeak) => {
  console.log("feature enabled api");

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/v1/servergroup", servergroup(teamspeak));
  app.use("/v1/channel", channel(teamspeak));
  app.use("/v1/client", client(teamspeak));

  app.use("/v1/admin", admin());

  app.use(unknownRouteController);
  app.use(errorController);

  app.listen(Number(process.env.INTERNAL_PORT), () => {
    console.log(`Listening on Port ${process.env.INTERNAL_PORT}`);
  });
};
