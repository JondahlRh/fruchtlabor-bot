import TsChannel from "models/teamspeak/TsChannel";

export const findTsChannels = async () => {
  try {
    return await TsChannel.find();
  } catch (error) {
    return [];
  }
};

export const findTsChannelById = async (id: string) => {
  try {
    return await TsChannel.findById(id);
  } catch (error) {
    return null;
  }
};

export const findOneTsBotChannel = async () => {
  try {
    return await TsChannel.findOne({ isBotChannel: true });
  } catch (error) {
    return null;
  }
};
