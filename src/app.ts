import mongoose from "mongoose";
import cron from "node-cron";
import { TeamSpeak } from "ts3-nodejs-library";

import botMove from "./controllers/channel/botMove";
import channelController from "./controllers/channel";
import messageController from "./controllers/message";

import eHandler from "./utility/asyncErrorHandler";

export default async () => {
  await mongoose.connect(process.env.MONGODB_CONNECT, {
    dbName: process.env.MONGODB_DBNAME,
  });
  console.log("connected to MongoDB");

  const teamspeak = await TeamSpeak.connect({
    host: process.env.TEAMSPEAK_IP,
    serverport: process.env.TEAMSPEAK_PORT,
    username: process.env.TEAMSPEAKQUERY_USERNAME,
    password: process.env.TEAMSPEAKQUERY_PASSWORD,
    nickname: process.env.TEAMSPEAK_NICKNAME,
  });
  console.log("connected to Teamspeak");

  eHandler(botMove)(teamspeak);

  teamspeak.on("clientconnect", (event) => {
    eHandler(messageController.join)(teamspeak, event.client);
    eHandler(channelController.custom)(teamspeak, event.client);
    eHandler(messageController.support)(teamspeak, event.client);
    eHandler(channelController.addgroup)(event.client);
  });

  teamspeak.on("clientdisconnect", (event) => {
    eHandler(channelController.lobby)(teamspeak);
  });

  teamspeak.on("clientmoved", (event) => {
    eHandler(channelController.custom)(teamspeak, event.client);
    eHandler(channelController.lobby)(teamspeak);
    eHandler(messageController.support)(teamspeak, event.client);
    eHandler(channelController.addgroup)(event.client);
  });

  cron.schedule("*/30 * * * * *", () => {
    eHandler(channelController.online)(teamspeak);
    eHandler(channelController.afk)(teamspeak);
  });
};
