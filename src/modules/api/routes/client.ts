import { Router } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import client from "../controllers/client";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get("/online", client(teamspeak).getAllClientsOnline);
  route.get("/online/:id", client(teamspeak).getSingleClientOnline);
  route.get("/:id", client(teamspeak).getSingleClient);

  route.post("/ban", client(teamspeak).postBanClient);

  return route;
};
