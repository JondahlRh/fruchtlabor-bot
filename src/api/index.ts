import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import channel from "./route/channel";
import client from "./route/client";
import servergroup from "./route/servergroup";
import { HtmlError } from "./utility/HtmlError";

export default (teamspeak: TeamSpeak) => {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.use("/servergroup", servergroup(teamspeak));
  app.use("/channel", channel(teamspeak));
  app.use("/client", client(teamspeak));

  app.use((req, res, next) => {
    next(new HtmlError("Route does not exist!", 404, "UNKOWN_ROUTE"));
  });

  app.use(
    (
      error: HtmlError,
      req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      if (res.headersSent) next(error);

      res.status(error.htmlCode).json({
        message: error.message,
        errorCode: error.errorCode,
      });
    }
  );

  console.log(`Listening on http://localhost:${process.env.API_PORT}/`);
  app.listen(Number(process.env.API_PORT));
};
