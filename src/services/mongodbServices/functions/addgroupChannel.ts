import AddgroupChannel from "models/functions/AddgroupChannel";

const populate = ["channel", "moveChannel", "servergroup"];

export const findOneAddgroupChannelByChannelId = async (channelid: number) => {
  try {
    const data = await AddgroupChannel.find().populate(populate).lean();
    return data.find((x) => x.channel.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
