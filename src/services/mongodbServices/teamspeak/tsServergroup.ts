import TsServergroup from "models/teamspeak/TsServergroup";

export const findTsServergroups = async () => {
  try {
    return await TsServergroup.find();
  } catch (error) {
    return [];
  }
};

export const findTsServergroupById = async (id: string) => {
  try {
    return await TsServergroup.findById(id);
  } catch (error) {
    return null;
  }
};
