import TsChannel from "models/teamspeak/TsChannel";

export const findTsChannels = async () => {
  try {
    return await TsChannel.find().lean();
  } catch (error) {
    return [];
  }
};

export const findTsChannelById = async (id: string) => {
  try {
    return await TsChannel.findById(id).lean();
  } catch (error) {
    return null;
  }
};

export const findOneTsBotChannel = async () => {
  try {
    return await TsChannel.findOne({ isBotChannel: true }).lean();
  } catch (error) {
    return null;
  }
};
