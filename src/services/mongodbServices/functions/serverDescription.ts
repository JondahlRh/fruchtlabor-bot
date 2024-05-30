import ServerDescription from "models/functions/ServerDescription";

const populate = ["channel", "servers", "description"];

export const findServerDescriptions = async () => {
  try {
    return await ServerDescription.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};
