import JoinMessage from "models/functions/JoinMessage";

const populate = ["servergroup"];

export const findJoinMessages = async () => {
  try {
    return await JoinMessage.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findJoinMessageById = async (id: string) => {
  try {
    return await JoinMessage.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};
