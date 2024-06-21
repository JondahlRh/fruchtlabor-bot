import TsServergroup from "models/teamspeak/TsServergroup";

export const cachedFindTsServergroups = async () => {
  try {
    return await TsServergroup.find().lean().cache();
  } catch (error) {
    return [];
  }
};
