import JoinMessage from "models/functions/JoinMessage";

const populate = ["servergroup"];

export const cachedFindJoinMessages = async () => {
  try {
    return await JoinMessage.find().populate(populate).lean().cache();
  } catch (error) {
    return [];
  }
};
