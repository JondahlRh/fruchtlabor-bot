import AddgroupChannel from "models/functions/AddgroupChannel";

const populate = ["channel", "moveChannel", "servergroup"];

export const cachedFindOneAddgroupChannelByChannelId = async (
  channelid: number
) => {
  try {
    const data = await AddgroupChannel.find().populate(populate).lean().cache();
    return data.find((x) => x.channel.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
