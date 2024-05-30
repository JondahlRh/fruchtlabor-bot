import RuleChannel from "models/functions/RuleChannel";

const populate = ["channel"];

export const findRuleChannels = async () => {
  try {
    return await RuleChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findRuleChannelById = async (id: string) => {
  try {
    return await RuleChannel.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};
