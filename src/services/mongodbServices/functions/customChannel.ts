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
    return await CustomChannel.findOne().populate([
      ...populate,
      { path: "channelParent", match: { id: { $eq: channelid } } },
    ]);
  } catch (error) {
    return null;
  }
};
