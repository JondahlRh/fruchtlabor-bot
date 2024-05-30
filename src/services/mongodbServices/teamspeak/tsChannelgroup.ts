import TsChannelgroup from "models/teamspeak/TsChannelgroup";

export const findTsChannelgroups = async () => {
  try {
    return await TsChannelgroup.find().lean();
  } catch (error) {
    return [];
  }
};

export const findTsChannelgroupById = async (id: string) => {
  try {
    return await TsChannelgroup.findById(id).lean();
  } catch (error) {
    return null;
  }
};
