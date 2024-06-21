import AfkChannel from "models/functions/AfkChannel";

const populate = [
  {
    path: "moveChannel",
    populate: ["member", "teammember"],
  },
  {
    path: "apply",
    populate: ["channels", "channelParents", "servergroups"],
  },
  {
    path: "ignore",
    populate: ["channels", "channelParents", "servergroups"],
  },
];

export const cachedFindAfkChannels = async () => {
  try {
    return await AfkChannel.find().populate(populate).lean().cache();
  } catch (error) {
    return [];
  }
};

export const cachedFindOneDefaultAfkChannel = async () => {
  try {
    return await AfkChannel.findOne({ isDefault: true })
      .populate(populate)
      .lean()
      .cache();
  } catch (error) {
    return null;
  }
};
