import OnlineChannel from "models/functions/OnlineChannel";

const populate = [
  "channel",
  "servergroups",
  {
    path: "collections",
    populate: ["channels", "channelParents", "servergroups"],
  },
];

export const findOnlineChannels = async () => {
  try {
    return await OnlineChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};
