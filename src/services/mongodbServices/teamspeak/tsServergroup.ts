import TsServergroup from "models/teamspeak/TsServergroup";

export const findTsServergroups = async () => {
  try {
    return await TsServergroup.find().lean();
  } catch (error) {
    return [];
  }
};
