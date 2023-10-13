import { TeamSpeak } from "ts3-nodejs-library";

import BotDefaultChannel from "../models/functions/BotDefaultChannel.js";
import TsChannel from "../models/teamspeak/TsChannel.js";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const botMove = async (teamspeak) => {
  const self = await teamspeak.self();
  const botChannel = await TsChannel.findOne({ isBotChannel: true });

  if (+self.cid !== botChannel.channelId) {
    await teamspeak.clientMove(self, botChannel.channelId);
  }
};

export default botMove;
