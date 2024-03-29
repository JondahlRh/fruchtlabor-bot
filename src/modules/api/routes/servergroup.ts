import { Router } from "express";
import servergroup from "modules/api/controllers/servergroup";
import { TeamSpeak } from "ts3-nodejs-library";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get("/", servergroup(teamspeak).getAllServergroups);
  route.get("/:id", servergroup(teamspeak).getSingleServergroup);
  route.get("/:id/clients", servergroup(teamspeak).getClientsOfServergroup);

  route.put("/", servergroup(teamspeak).putServergroup);
  route.delete("/", servergroup(teamspeak).deleteServergroup);
  route.delete("/all", servergroup(teamspeak).deleteAllServergroups);

  return route;
};
