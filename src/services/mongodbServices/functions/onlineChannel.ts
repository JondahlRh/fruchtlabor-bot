import OnlineChannel from "models/functions/OnlineChannel";

const populate = [
  "channel",
  "servergroups",
  {
    path: "collections",
    populate: ["channels", "channelParents", "servergroups"],
  },
];

export const cachedFindOnlineChannels = async () => {
  try {
    return await OnlineChannel.find().populate(populate).lean().cache();
  } catch (error) {
    return [];
  }
};
