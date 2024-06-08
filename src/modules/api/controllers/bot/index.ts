import { TeamSpeak } from "ts3-nodejs-library";

import infodescription from "./infodescription";
import teamchannel from "./teamchannel";

export default (teamspeak: TeamSpeak) => ({
  infodescription: infodescription(teamspeak),
  teamchannel: teamchannel(teamspeak),
});
