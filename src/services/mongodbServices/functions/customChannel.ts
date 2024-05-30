import CustomChannel from "models/functions/CustomChannel";

const populate = ["channelGroup", "channelParent"];

export const findOneCustomChannelByChannelId = async (channelid: number) => {
  try {
    const data = await CustomChannel.find().populate(populate).lean();
    return data.find((x) => x.channelParent.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
