import { TeamSpeak } from "ts3-nodejs-library";

import BotDefaultChannel from "../models/functions/BotDefaultChannel.js";

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const botDefaultChannelMove = async (teamspeak) => {
  const self = await teamspeak.self();
  const botChannel = await BotDefaultChannel.findOne().populate("channel");

  if (+self.cid !== botChannel.channel.channelId) {
    await teamspeak.clientMove(self, botChannel.channel.channelId);
  }
};

export default botDefaultChannelMove;
