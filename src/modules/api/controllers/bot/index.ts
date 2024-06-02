import { TeamSpeak } from "ts3-nodejs-library";

import blackboardchannel from "./blackboardchannel";
import organizationchannel from "./organizationchannel";
import teamchannel from "./teamchannel";

export default (teamspeak: TeamSpeak) => ({
  blackboardchannel: blackboardchannel(teamspeak),
  organizationchannel: organizationchannel(teamspeak),
  teamchannel: teamchannel(teamspeak),
});
