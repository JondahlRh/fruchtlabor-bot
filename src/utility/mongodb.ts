import AddgroupChannel from "../models/functions/AddgroupChannel";
import AfkChannel from "../models/functions/AfkChannel";
import CustomChannel from "../models/functions/CustomChannel";
import JoinMessage from "../models/functions/JoinMessage";
import LobbyChannel from "../models/functions/LobbyChannel";
import OnlineChannel from "../models/functions/OnlineChannel";
import SupportMessage from "../models/functions/SupportMessage";
import AsyncError from "../models/general/AsyncError";
import Fruit from "../models/general/Fruit";
import TsChannel from "../models/teamspeak/TsChannel";
import TsServergroup from "../models/teamspeak/TsServergroup";
import {
  AddgroupChannelType,
  AfkChannelType,
  CustomChannelType,
  JoinMessageType,
  LobbyChannelType,
  OnlineChannelType,
  SupportMessageType,
} from "../types/mongoose/functions";
import { FruitType } from "../types/mongoose/general";
import { TsChannelType, TsServergroupType } from "../types/mongoose/teamspeak";

export const getAddgroupChannels = async (): Promise<AddgroupChannelType[]> => {
  return await AddgroupChannel.find()
    .populate("channel")
    .populate("moveChannel")
    .populate("servergroup");
};

export const getAfkChannels = async (): Promise<AfkChannelType[]> => {
  return await AfkChannel.find()
    .populate({
      path: "moveChannel",
      populate: [{ path: "member" }, { path: "teammember" }],
    })
    .populate({
      path: "ignore",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    })
    .populate({
      path: "apply",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    });
};

export const getTsServergroups = async (): Promise<TsServergroupType[]> => {
  return await TsServergroup.find();
};

export const getBotTsChannel = async (): Promise<TsChannelType | null> => {
  return await TsChannel.findOne({ isBotChannel: true });
};

export const getCustomChannels = async (): Promise<CustomChannelType[]> => {
  return await CustomChannel.find()
    .populate("channelParent")
    .populate("channelGroup");
};

export const getFruits = async (): Promise<FruitType[]> => {
  return await Fruit.find();
};

export const getLobbyChannels = async (): Promise<LobbyChannelType[]> => {
  return await LobbyChannel.find()
    .populate("channelParent")
    .populate("channelParentSiblings")
    .populate("description");
};

export const getOnlineChannels = async (): Promise<OnlineChannelType[]> => {
  return await OnlineChannel.find()
    .populate("channel")
    .populate("servergroups")
    .populate({
      path: "collections",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    });
};

export const getJoinMessages = async (): Promise<JoinMessageType[]> => {
  return await JoinMessage.find().populate("servergroup");
};

export const getSupportMessages = async (): Promise<SupportMessageType[]> => {
  return await SupportMessage.find()
    .populate("channel")
    .populate("contactServergroups")
    .populate({
      path: "ignore",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    })
    .populate({
      path: "doNotDisturb",
      populate: [
        { path: "channels" },
        { path: "channelParents" },
        { path: "servergroups" },
      ],
    })
    .populate("specials.servergroup")
    .populate("specials.contactServergroups");
};

export const saveErrorLog = async (error: Error, fnName: string) => {
  await new AsyncError({
    function: fnName,
    message: error.message,
    name: error.name,
    stack: error.stack,
  }).save();
};
