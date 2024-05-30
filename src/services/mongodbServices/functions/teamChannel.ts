import TeamChannel from "models/functions/TeamChannel";

const populate = ["channel"];

export const findTeamChannels = async () => {
  try {
    return await TeamChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};
