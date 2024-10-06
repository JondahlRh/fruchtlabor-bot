import { TeamSpeak } from "ts3-nodejs-library";

import exitHandler from "./utility/exitHandler.js";

async function app() {
  const teamspeak = await TeamSpeak.connect({
    host: process.env.TEAMSPEAK_HOST,
    serverport: +process.env.TEAMSPEAK_PORT,
    queryport: +process.env.TEAMSPEAK_QUERYPORT,
    username: process.env.TEAMSPEAK_USERNAME,
    password: process.env.TEAMSPEAK_PASSWORD,
    nickname: process.env.TEAMSPEAK_NICKNAME,
  });
  console.log("Connected to Teamspeak...");

  process.on("SIGTERM", async () => await exitHandler(teamspeak));
  process.on("SIGINT", async () => await exitHandler(teamspeak));
}

export default app;
