import ServerDescription from "models/functions/ServerDescription";

const populate = ["channel", "servers", "description"];

export const cachedFindServerDescriptions = async () => {
  try {
    return await ServerDescription.find().populate(populate).lean().cache();
  } catch (error) {
    return [];
  }
};
