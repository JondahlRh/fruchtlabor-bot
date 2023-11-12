import { TeamSpeak } from "ts3-nodejs-library";

import { TsChannelType } from "src/types/mongoose/teamspeak";

import TsChannel from "src/models/teamspeak/TsChannel";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const botMove = async (teamspeak: TeamSpeak) => {
  const self = await teamspeak.self();
  const botChannel: TsChannelType | null = await TsChannel.findOne({
    isBotChannel: true,
  });

  if (botChannel === null) throw new Error("Bot Channel is not definded");

  if (+self.cid !== botChannel.channelId) {
    await teamspeak.clientMove(self, String(botChannel.channelId));
  }
};

export default botMove;
