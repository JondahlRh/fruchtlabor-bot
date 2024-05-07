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
    const data = await SupportMessage.find().populate(populate);
    return data.find((x) => x.channel.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
