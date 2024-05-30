import TsChannel from "models/teamspeak/TsChannel";

export const findOneTsBotChannel = async () => {
  try {
    return await TsChannel.findOne({ isBotChannel: true }).lean();
  } catch (error) {
    return null;
  }
};
