import mongoose from "mongoose";
import { TeamSpeak } from "ts3-nodejs-library";

export default async (teamspeak: TeamSpeak) => {
  await teamspeak.quit();
  await mongoose.disconnect();
};
