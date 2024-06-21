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

export const cachedFindOneSupportMessageByChannelId = async (
  channelid: number
) => {
  try {
    const data = await SupportMessage.find().populate(populate).lean().cache();
    return data.find((x) => x.channel.id === channelid) ?? null;
  } catch (error) {
    return null;
  }
};
