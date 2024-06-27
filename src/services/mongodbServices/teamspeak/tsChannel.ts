import TsChannel from "models/teamspeak/TsChannel";

export const cachedFindOneTsBotChannel = async () => {
  try {
    return await TsChannel.findOne({ isBotChannel: true }).lean().cache("1h");
  } catch (error) {
    return null;
  }
};

export const findByIdTsChannel = async (id: string) => {
  try {
    return await TsChannel.findById(id).lean();
  } catch (error) {
    return null;
  }
};
