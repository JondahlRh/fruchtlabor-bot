import type { TeamSpeak } from "ts3-nodejs-library";

async function exitHandler(teamspeak: TeamSpeak) {
  await teamspeak.quit();
}

export default exitHandler;
