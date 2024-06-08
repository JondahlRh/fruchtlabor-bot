import { Router } from "express";
import { TeamSpeak } from "ts3-nodejs-library";

import authCheck from "modules/api/middlewares/authCheck";

import bot from "../controllers/bot";

export default (teamspeak: TeamSpeak) => {
  const route = Router();

  route.post(
    "/infodescription",
    authCheck("exec_infodescription"),
    bot(teamspeak).infodescription
  );
  route.post(
    "/teamchannel",
    authCheck("exec_teamchannel"),
    bot(teamspeak).teamchannel
  );

  return route;
};
