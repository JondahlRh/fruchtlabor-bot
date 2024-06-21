import ServerTitle from "models/functions/ServerTitle";

const populate = ["channel", "server"];

export const cachedFindServerTitles = async () => {
  try {
    return await ServerTitle.find().populate(populate).lean().cache();
  } catch (error) {
    return [];
  }
};
