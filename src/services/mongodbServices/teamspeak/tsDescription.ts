import TsDescription from "models/teamspeak/TsDescription";

export const findTsDescriptions = async () => {
  try {
    return await TsDescription.find();
  } catch (error) {
    return [];
  }
};

export const findTsDescriptionById = async (id: string) => {
  try {
    return await TsDescription.findById(id);
  } catch (error) {
    return null;
  }
};
