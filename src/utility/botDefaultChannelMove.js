import { TeamSpeak } from "ts3-nodejs-library";

// TODO: remove hard coded bot default channel ID
const BOT_CHANNEL = 163666;

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const botDefaultChannelMove = async (teamspeak) => {
  const self = await teamspeak.self();

  if (+self.cid !== BOT_CHANNEL) {
    await teamspeak.clientMove(self, BOT_CHANNEL);
  }
};

export default botDefaultChannelMove;
