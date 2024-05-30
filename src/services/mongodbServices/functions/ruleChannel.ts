import RuleChannel from "models/functions/RuleChannel";

const populate = ["channel"];

export const findRuleChannels = async () => {
  try {
    return await RuleChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};
