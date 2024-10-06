import mongoose from "mongoose";
import { TeamSpeak } from "ts3-nodejs-library";
import cache from "ts-cache-mongoose";

import exitHandler from "utility/exitHandler";

import api from "./modules/api";
import bot, { moveDefaultChannel } from "./modules/bot";

export default async () => {
  await mongoose.connect(process.env.MONGODB_CONNECT ?? "", {
    dbName: process.env.MONGODB_DBNAME,
  });
  console.log("connected to MongoDB");

  cache.init(mongoose, {
    defaultTTL: "60 seconds",
    engine: "memory",
  });

  const teamspeak = await TeamSpeak.connect({
    host: process.env.TEAMSPEAK_IP,
    serverport: +process.env.TEAMSPEAK_PORT,
    queryport: +process.env.TEAMSPEAK_QUERYPORT,
    username: process.env.TEAMSPEAKQUERY_USERNAME,
    password: process.env.TEAMSPEAKQUERY_PASSWORD,
    nickname: process.env.TEAMSPEAK_NICKNAME,
  });
  console.log("connected to Teamspeak");

  moveDefaultChannel(teamspeak);

  if (process.env.FEATUREFLAG_BOT === "true") {
    bot(teamspeak);
  }

  if (process.env.FEATUREFLAG_API === "true") {
    api(teamspeak);
  }

  process.on("SIGTERM", async () => await exitHandler(teamspeak));
  process.on("SIGINT", async () => await exitHandler(teamspeak));
  process.on("exit", async () => await exitHandler(teamspeak));
};
