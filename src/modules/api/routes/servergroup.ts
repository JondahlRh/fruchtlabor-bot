import { Router } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import servergroup from "modules/api/controllers/servergroup";

import authCheck from "modules/api/middlewares/authCheck";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.get(
    "/",
    authCheck("read_servergroups"),
    servergroup(teamspeak).getAllServergroups
  );
  route.get(
    "/:id",
    authCheck("read_servergroups"),
    servergroup(teamspeak).getSingleServergroup
  );
  route.get(
    "/:id/clients",
    authCheck("read_servergroups"),
    servergroup(teamspeak).getClientsOfServergroup
  );

  route.put(
    "/",
    authCheck("add_servergroups"),
    servergroup(teamspeak).putServergroup
  );
  route.delete(
    "/",
    authCheck("remove_servergroups"),
    servergroup(teamspeak).deleteServergroup
  );
  route.delete(
    "/all",
    authCheck("remove_servergroups"),
    servergroup(teamspeak).deleteAllServergroups
  );

  return route;
};
