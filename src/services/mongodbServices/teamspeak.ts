import TsChannel from "models/teamspeak/TsChannel";
import TsServergroup from "models/teamspeak/TsServergroup";

export const findTsServergroups = async () => {
  try {
    return await TsServergroup.find();
  } catch (error) {
    return null;
  }
};

export const findTsBotChannel = async () => {
  try {
    return await TsChannel.findOne({ isBotChannel: true });
  } catch (error) {
    return null;
  }
};
