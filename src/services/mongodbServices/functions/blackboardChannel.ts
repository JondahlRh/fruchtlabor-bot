import BlackboardChannel from "models/functions/BlackboardChannel";

const populate = ["channel"];

export const findBlackboardChannels = async () => {
  try {
    return await BlackboardChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};
