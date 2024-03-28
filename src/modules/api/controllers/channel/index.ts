import { TeamSpeak } from "ts3-nodejs-library";

import getAllChannels from "./getAllChannels";
import getClientsOfChannel from "./getClientsOfChannel";
import getSingleChannel from "./getSingleChannel";

export default (teamspeak: TeamSpeak) => ({
  getAllChannels: getAllChannels(teamspeak),
  getSingleChannel: getSingleChannel(teamspeak),
  getClientsOfChannel: getClientsOfChannel(teamspeak),
});
