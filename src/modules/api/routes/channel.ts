import { Router } from "express";
import channel from "modules/api/controllers/channel";
import { TeamSpeak } from "ts3-nodejs-library";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get("/", channel(teamspeak).getAllChannels);
  route.get("/:id", channel(teamspeak).getSingleChannel);
  route.get("/:id/clients", channel(teamspeak).getClientsOfChannel);

  return route;
};
