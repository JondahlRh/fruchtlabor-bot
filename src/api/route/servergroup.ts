import { Router } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import servergroup from "../controller/servergroup";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get("/", servergroup(teamspeak).getAllServergroups);
  route.get("/:id", servergroup(teamspeak).getSingleServergroup);
  route.get("/:id/clients", servergroup(teamspeak).getClientsOfServergroup);

  return route;
};
