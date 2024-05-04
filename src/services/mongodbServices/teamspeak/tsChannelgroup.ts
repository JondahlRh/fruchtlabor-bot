import TsChannelgroup from "models/teamspeak/TsChannelgroup";

export const findTsChannelgroups = async () => {
  try {
    return await TsChannelgroup.find();
  } catch (error) {
    return [];
  }
};

export const findTsChannelgroupById = async (id: string) => {
  try {
    return await TsChannelgroup.findById(id);
  } catch (error) {
    return null;
  }
};
