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

export const findOneSupportMessageByChannelId = async (channelid: number) => {
  try {
    const data = await SupportMessage.find().populate(populate).lean();
    return data.find((x) => x.channel.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
