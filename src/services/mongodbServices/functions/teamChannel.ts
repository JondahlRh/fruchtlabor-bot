import TeamChannel from "models/functions/TeamChannel";

const populate = ["channel"];

export const findTeamChannels = async () => {
  try {
    return await TeamChannel.find().populate(populate);
  } catch (error) {
    return [];
  }
};

export const findTeamChannelById = async (id: string) => {
  try {
    return await TeamChannel.findById(id).populate(populate);
  } catch (error) {
    return null;
  }
};
