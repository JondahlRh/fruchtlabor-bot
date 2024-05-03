import { Router } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import client from "modules/api/controllers/client";
import authCheck from "modules/api/middlewares/authCheck";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get("/ban", authCheck("read_bans"), client(teamspeak).getBanList);
  route.post("/ban", authCheck("create_bans"), client(teamspeak).postBanClient);
  route.delete(
    "/ban",
    authCheck("delete_bans"),
    client(teamspeak).deleteBanClient
  );
  route.get("/ban/:id", authCheck("read_bans"), client(teamspeak).getSingleBan);

  route.get(
    "/online",
    authCheck("read_clients"),
    client(teamspeak).getAllClientsOnline
  );
  route.get(
    "/online/:id",
    authCheck("read_clients"),
    client(teamspeak).getSingleClientOnline
  );
  route.get(
    "/:id",
    authCheck("read_clients"),
    client(teamspeak).getSingleClient
  );

  return route;
};
