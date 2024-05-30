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

export const findAfkChannels = async () => {
  try {
    return await AfkChannel.find().populate(populate).lean();
  } catch (error) {
    return [];
  }
};

export const findAfkChannelById = async (id: string) => {
  try {
    return await AfkChannel.findById(id).populate(populate).lean();
  } catch (error) {
    return null;
  }
};

export const findOneDefaultAfkChannel = async () => {
  try {
    return await AfkChannel.findOne({ isDefault: true })
      .populate(populate)
      .lean();
  } catch (error) {
    return null;
  }
};
