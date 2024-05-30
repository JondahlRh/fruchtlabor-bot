import ServerDescription from "models/functions/ServerDescription";

const populate = ["channel", "servers", "description"];

export const findServerDescriptions = async () => {
  try {
    return await ServerDescription.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findServerDescriptionById = async (id: string) => {
  try {
    return await ServerDescription.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};
