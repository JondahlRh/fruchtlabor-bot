import InfoDescription from "models/functions/InfoDescription";

const populate = ["channel"];

export const cachedFindInfoDescriptions = async () => {
  try {
    return await InfoDescription.find().populate(populate).lean().cache();
  } catch (error) {
    return [];
  }
};
