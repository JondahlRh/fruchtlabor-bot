import AddgroupChannel from "models/functions/AddgroupChannel";

const populate = ["channel", "moveChannel", "servergroup"];

export const findAddgroupChannels = async () => {
  try {
    return await AddgroupChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findAddgroupChannelById = async (id: string) => {
  try {
    return await AddgroupChannel.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};

export const findOneAddgroupChannelByChannelId = async (channelid: number) => {
  try {
    const data = await AddgroupChannel.find().populate(populate).lean();
    return data.find((x) => x.channel.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
