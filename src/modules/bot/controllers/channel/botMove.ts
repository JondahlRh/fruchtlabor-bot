import { TeamSpeak } from "ts3-nodejs-library";

import { getBotTsChannel } from "modules/bot/utility/mongodb";

const botMove = async (teamspeak: TeamSpeak) => {
  const self = await teamspeak.self();
  const botChannel = await getBotTsChannel();

  if (botChannel === null) throw new Error("Bot Channel is not definded");

  if (+self.cid !== botChannel.id) {
    await teamspeak.clientMove(self, String(botChannel.id));
  }
};

export default botMove;
