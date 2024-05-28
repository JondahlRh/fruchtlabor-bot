import { schedule } from "node-cron";
import { TeamSpeak } from "ts3-nodejs-library";

import channelController from "./controllers/channel";
import messageController from "./controllers/message";
import serverController from "./controllers/server";
import eHandler from "./utility/asyncErrorHandler";

export const moveDefaultChannel = (teamspeak: TeamSpeak) => {
  eHandler(channelController.botMove)(teamspeak);
};

export default (teamspeak: TeamSpeak) => {
  console.log("feature enabled bot");

  moveDefaultChannel(teamspeak);

  teamspeak.on("clientconnect", (event) => {
    eHandler(messageController.join)(teamspeak, event.client);
    eHandler(channelController.custom)(teamspeak, event.client);
    eHandler(messageController.support)(teamspeak, event.client);
    eHandler(channelController.addgroup)(event.client);
  });

  teamspeak.on("clientdisconnect", () => {
    eHandler(channelController.lobby)(teamspeak);
  });

  teamspeak.on("clientmoved", (event) => {
    eHandler(channelController.custom)(teamspeak, event.client);
    eHandler(channelController.lobby)(teamspeak);
    eHandler(messageController.support)(teamspeak, event.client);
    eHandler(channelController.addgroup)(event.client);
  });

  schedule("*/30 * * * * *", () => {
    // eHandler(channelController.online)(teamspeak);
    // eHandler(channelController.afk)(teamspeak);
    // eHandler(serverController.overview)(teamspeak);
    // eHandler(serverController.playercount)(teamspeak);
  });

  // eHandler(channelController.rules)(teamspeak);
  schedule("0 4 * * *", () => {
    // eHandler(channelController.rules)(teamspeak);
  });
};
