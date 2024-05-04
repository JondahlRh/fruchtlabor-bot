import SupportMessage from "models/functions/SupportMessage";

const populate = [
  "channel",
  "contactServergroups",
  {
    path: "ignore",
    populate: ["channels", "channelParents", "servergroups"],
  },
  {
    path: "doNotDisturb",
    populate: ["channels", "channelParents", "servergroups"],
  },
  {
    path: "specials",
    populate: ["servergroup", "contactServergroups"],
  },
];

export const findSupportMessages = async () => {
  try {
    return await SupportMessage.find().populate(populate);
  } catch (error) {
    return [];
  }
};

export const findSupportMessageById = async (id: string) => {
  try {
    return await SupportMessage.findById(id).populate(populate);
  } catch (error) {
    return null;
  }
};

export const findOneSupportMessageByChannelId = async (channelid: number) => {
  try {
    return await SupportMessage.findOne().populate([
      ...populate,
      { path: "channel", match: { id: { $eq: channelid } } },
    ]);
  } catch (error) {
    return null;
  }
};
