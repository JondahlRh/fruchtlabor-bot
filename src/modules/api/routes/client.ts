import { Router } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import client from "../controllers/client";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get("/uuid/:id", client(teamspeak).getSingleClientByUuid);
  route.get("/dbid/:id", client(teamspeak).getSingleClientByDbid);

  route.get("/online", client(teamspeak).getAllClientsOnline);

  route.post("/ban", client(teamspeak).postBanClient);

  return route;
};
