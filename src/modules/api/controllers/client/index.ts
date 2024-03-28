import { TeamSpeak } from "ts3-nodejs-library";

import deleteBanClient from "./deleteBanClient";
import getAllClientsOnline from "./getAllClientsOnline";
import getBanList from "./getBanList";
import getSingleBan from "./getSingleBan";
import getSingleClient from "./getSingleClient";
import getSingleClientOnline from "./getSingleClientOnline";
import postBanClient from "./postBanClient";

export default (teamspeak: TeamSpeak) => ({
  getSingleClient: getSingleClient(teamspeak),
  getAllClientsOnline: getAllClientsOnline(teamspeak),
  getSingleClientOnline: getSingleClientOnline(teamspeak),
  getBanList: getBanList(teamspeak),
  getSingleBan: getSingleBan(teamspeak),
  postBanClient: postBanClient(teamspeak),
  deleteBanClient: deleteBanClient(teamspeak),
});
