import { schedule } from "node-cron";
import { TeamSpeak } from "ts3-nodejs-library";

import channelController from "./controllers/channel";
import descriptionController from "./controllers/description";
import messageController from "./controllers/message";
import moveController from "./controllers/move";
import serverController from "./controllers/server";
import eHandler from "./utility/asyncErrorHandler";

export const moveDefaultChannel = (teamspeak: TeamSpeak) => {
  eHandler(moveController.botMove)(teamspeak);
};

export default (teamspeak: TeamSpeak) => {
  console.log("feature enabled bot");

  moveDefaultChannel(teamspeak);

  teamspeak.on("clientconnect", (event) => {
    eHandler(messageController.joinMessage)(teamspeak, event.client);
    eHandler(channelController.customChannel)(teamspeak, event.client);
    eHandler(messageController.supportMessage)(teamspeak, event.client);
    eHandler(channelController.addgroupChannel)(event.client);
  });

  teamspeak.on("clientdisconnect", () => {
    eHandler(channelController.lobbyChannel)(teamspeak);
  });

  teamspeak.on("clientmoved", (event) => {
    eHandler(channelController.customChannel)(teamspeak, event.client);
    eHandler(channelController.lobbyChannel)(teamspeak);
    eHandler(messageController.supportMessage)(teamspeak, event.client);
    eHandler(channelController.addgroupChannel)(event.client);
  });

  schedule("*/30 * * * * *", () => {
    eHandler(descriptionController.onlineDescription)(teamspeak);
    eHandler(moveController.afkMove)(teamspeak);
    eHandler(serverController.overviewServer)(teamspeak);
    eHandler(serverController.detailsServer)(teamspeak);
  });

  schedule("0 4 * * *", () => {
    eHandler(descriptionController.organizationchannelDescription)(teamspeak);
    eHandler(descriptionController.blackboarchannelDescription)(teamspeak);
    eHandler(descriptionController.forumsyncDescription)(teamspeak);
    eHandler(descriptionController.teamchannelDescription)(teamspeak);
  });
};
