import InfoDescription from "models/functions/InfoDescription";

const populate = ["channel"];

export const findInfoDescriptions = async () => {
  try {
    return await InfoDescription.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};
