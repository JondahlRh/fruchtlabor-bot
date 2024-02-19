import mongoose from "mongoose";
import { TeamSpeak } from "ts3-nodejs-library";

import api from "./modules/api";
import bot, { moveDefaultChannel } from "./modules/bot";

export default async () => {
  await mongoose.connect(process.env.MONGODB_CONNECT ?? "", {
    dbName: process.env.MONGODB_DBNAME,
  });
  console.log("connected to MongoDB");

  const teamspeak = await TeamSpeak.connect({
    host: process.env.TEAMSPEAK_IP,
    serverport: Number(process.env.TEAMSPEAK_PORT),
    queryport: Number(process.env.TEAMSPEAK_QUERYPORT),
    username: process.env.TEAMSPEAKQUERY_USERNAME,
    password: process.env.TEAMSPEAKQUERY_PASSWORD,
    nickname: process.env.TEAMSPEAK_NICKNAME,
  });
  console.log("connected to Teamspeak");

  moveDefaultChannel(teamspeak);

  bot(teamspeak);
  api(teamspeak);
};
