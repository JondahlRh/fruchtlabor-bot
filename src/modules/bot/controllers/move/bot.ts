import { TeamSpeak } from "ts3-nodejs-library";

import { findOneTsBotChannel } from "services/mongodbServices/teamspeak/tsChannel";

export default async function botMove(teamspeak: TeamSpeak) {
  const self = await teamspeak.self();
  const botChannel = await findOneTsBotChannel();

  if (botChannel === null) throw new Error("Bot Channel is not definded");

  if (+self.cid !== botChannel.id) {
    await teamspeak.clientMove(self, botChannel.id.toString());
  }
}
