import mongoose from "mongoose";
import { TeamSpeak } from "ts3-nodejs-library";
import trycatchHandler from "./utility/trycatchHandler.js";

export default async () => {
  const m = await trycatchHandler(
    mongoose.connect(process.env.MONGO_DB, { dbName: "DEV" })
  );
  if (m === undefined) return;
  console.log("connected to MongoDB");

  const t = await trycatchHandler(
    TeamSpeak.connect({
      host: process.env.TEAMSPEAK_IP,
      serverport: process.env.TEAMSPEAK_PORT,
      username: process.env.TEAMSPEAKQUERY_USERNAME,
      password: process.env.TEAMSPEAKQUERY_PASSWORD,
      nickname: "Fruchtlabor Bot",
    })
  );
  if (t === undefined) return;
  console.log("connected to TeamSpeak");

  
};
