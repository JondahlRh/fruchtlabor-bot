import CustomChannel from "models/functions/CustomChannel";

const populate = ["channelGroup", "channelParent"];

export const findCustomChannels = async () => {
  try {
    return await CustomChannel.find().populate(populate);
  } catch (error) {
    return [];
  }
};

export const findCustomChannelById = async (id: string) => {
  try {
    return await CustomChannel.findById(id).populate(populate);
  } catch (error) {
    return null;
  }
};

export const findOneCustomChannelByChannelId = async (channelid: number) => {
  try {
    const data = await CustomChannel.find().populate(populate);
    return data.find((x) => x.channelParent.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
