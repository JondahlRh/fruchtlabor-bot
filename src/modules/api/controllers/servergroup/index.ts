import { TeamSpeak } from "ts3-nodejs-library";

import deleteAllServergroups from "./deleteAllServergroups";
import deleteServergroup from "./deleteServergroup";
import getAllServergroups from "./getAllServergroups";
import getClientsOfServergroup from "./getClientsOfServergroup";
import getSingleServergroup from "./getSingleServergroup";
import putServergroup from "./putServergroup";

export default (teamspeak: TeamSpeak) => ({
  getAllServergroups: getAllServergroups(teamspeak),
  getSingleServergroup: getSingleServergroup(teamspeak),
  getClientsOfServergroup: getClientsOfServergroup(teamspeak),
  putServergroup: putServergroup(teamspeak),
  deleteServergroup: deleteServergroup(teamspeak),
  deleteAllServergroups: deleteAllServergroups(teamspeak),
});
