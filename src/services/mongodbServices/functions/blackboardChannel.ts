import BlackboardChannel from "models/functions/BlackboardChannel";

const populate = ["channel"];

export const findBlackboardChannels = async () => {
  try {
    return await BlackboardChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findBlackboardChannelById = async (id: string) => {
  try {
    return await BlackboardChannel.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};
