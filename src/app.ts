import mongoose from "mongoose";
import { schedule } from "node-cron";
import { TeamSpeak } from "ts3-nodejs-library";

import api from "./api";
import channelController from "./controllers/channel";
import messageController from "./controllers/message";
import eHandler from "./utility/asyncErrorHandler";

export default async () => {
  await mongoose.connect(process.env.MONGODB_CONNECT ?? "", {
    dbName: process.env.MONGODB_DBNAME,
  });
  console.log("connected to MongoDB");

  const teamspeak = await TeamSpeak.connect({
    host: process.env.TEAMSPEAK_IP,
    serverport: Number(process.env.TEAMSPEAK_PORT),
    username: process.env.TEAMSPEAKQUERY_USERNAME,
    password: process.env.TEAMSPEAKQUERY_PASSWORD,
    nickname: process.env.TEAMSPEAK_NICKNAME,
  });
  console.log("connected to Teamspeak");

  eHandler(channelController.botMove)(teamspeak);

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

  schedule("*/30 * * * * *", () => {
    eHandler(channelController.online)(teamspeak);
    eHandler(channelController.afk)(teamspeak);
  });

  api(teamspeak);
};
