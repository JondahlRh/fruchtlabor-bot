import { Router } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import channel from "modules/api/controllers/channel";

import authCheck from "../middlewares/authCheck";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get(
    "/",
    authCheck("read_tschannels"),
    channel(teamspeak).getAllChannels
  );
  route.get(
    "/:id",
    authCheck("read_tschannels"),
    channel(teamspeak).getSingleChannel
  );
  route.get(
    "/:id/clients",
    authCheck("read_tschannels"),
    channel(teamspeak).getClientsOfChannel
  );

  return route;
};
