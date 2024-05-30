import TsServergroup from "models/teamspeak/TsServergroup";

export const findTsServergroups = async () => {
  try {
    return await TsServergroup.find().lean();
  } catch (error) {
    return [];
  }
};

export const findTsServergroupById = async (id: string) => {
  try {
    return await TsServergroup.findById(id).lean();
  } catch (error) {
    return null;
  }
};
