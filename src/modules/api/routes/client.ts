import { Router } from "express";
import client from "modules/api/controllers/client";
import { TeamSpeak } from "ts3-nodejs-library";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get("/ban", client(teamspeak).getBanList);
  route.post("/ban", client(teamspeak).postBanClient);
  route.delete("/ban", client(teamspeak).deleteBanClient);
  route.get("/ban/:id", client(teamspeak).getSingleBan);

  route.get("/online", client(teamspeak).getAllClientsOnline);
  route.get("/online/:id", client(teamspeak).getSingleClientOnline);
  route.get("/:id", client(teamspeak).getSingleClient);

  return route;
};
