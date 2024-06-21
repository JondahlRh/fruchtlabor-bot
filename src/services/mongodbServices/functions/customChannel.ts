import CustomChannel from "models/functions/CustomChannel";

const populate = ["channelGroup", "channelParent"];

export const cachedFindOneCustomChannelByChannelId = async (
  channelid: number
) => {
  try {
    const data = await CustomChannel.find().populate(populate).lean().cache();
    return data.find((x) => x.channelParent.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
