import TsChannel from "models/teamspeak/TsChannel";

export const cachedFindOneTsBotChannel = async () => {
  try {
    return await TsChannel.findOne({ isBotChannel: true }).lean().cache("1h");
  } catch (error) {
    return null;
  }
};
