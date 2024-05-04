import ServerOverview from "models/functions/ServerOverview";

const populate = ["channel", "servers"];

export const findServerOverviews = async () => {
  try {
    return await ServerOverview.find().populate(populate);
  } catch (error) {
    return [];
  }
};

export const findServerOverviewById = async (id: string) => {
  try {
    return await ServerOverview.findById(id).populate(populate);
  } catch (error) {
    return null;
  }
};
