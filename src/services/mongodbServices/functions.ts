import AddgroupChannel from "models/functions/AddgroupChannel";
import AfkChannel from "models/functions/AfkChannel";
import CustomChannel from "models/functions/CustomChannel";
import JoinMessage from "models/functions/JoinMessage";
import LobbyChannel from "models/functions/LobbyChannel";
import OnlineChannel from "models/functions/OnlineChannel";
import ServerOverview from "models/functions/ServerOverview";
import ServerPlayercount from "models/functions/ServerPlayercount";
import SupportMessage from "models/functions/SupportMessage";

export const findOneAddgroupChannel = async (channelid: number) => {
  try {
    return await AddgroupChannel.findOne().populate([
      { path: "channel", match: { id: { $eq: channelid } } },
      "moveChannel",
      "servergroup",
    ]);
  } catch (error) {
    return null;
  }
};

export const findOneDefaultAfkChannel = async () => {
  try {
    return await AfkChannel.findOne({ isDefault: true }).populate([
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
    ]);
  } catch (error) {
    return null;
  }
};

export const findAfkChannels = async () => {
  try {
    return await AfkChannel.find({ isDefault: false }).populate([
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
    ]);
  } catch (error) {
    return null;
  }
};

export const findOneCustomChannel = async (channelid: number) => {
  try {
    return await CustomChannel.findOne().populate([
      { path: "channelParent", match: { id: { $eq: channelid } } },
      "channelGroup",
    ]);
  } catch (error) {
    return null;
  }
};

export const findJoinMessages = async () => {
  try {
    return await JoinMessage.find().populate(["servergroup"]);
  } catch (error) {
    return null;
  }
};

export const findLobbyChannels = async () => {
  try {
    return await LobbyChannel.find().populate([
      "channelParent",
      "channelParentSiblings",
      "description",
    ]);
  } catch (error) {
    return null;
  }
};

export const findOnlineChannels = async () => {
  try {
    return await OnlineChannel.find().populate([
      "channel",
      "servergroups",
      {
        path: "collections",
        populate: ["channels", "channelParents", "servergroups"],
      },
    ]);
  } catch (error) {
    return null;
  }
};

export const findServerOverviews = async () => {
  try {
    return await ServerOverview.find().populate(["channel", "servers"]);
  } catch (error) {
    return null;
  }
};

export const findServerPlayercounts = async () => {
  try {
    return await ServerPlayercount.find().populate(["channel", "server"]);
  } catch (error) {
    return null;
  }
};

export const findOneSupportMessage = async (channelid: number) => {
  try {
    return await SupportMessage.findOne().populate([
      { path: "channel", match: { id: { $eq: channelid } } },
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
    ]);
  } catch (error) {
    return null;
  }
};
