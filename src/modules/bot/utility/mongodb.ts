import AddgroupChannel from "models/functions/AddgroupChannel";
import AfkChannel from "models/functions/AfkChannel";
import CustomChannel from "models/functions/CustomChannel";
import JoinMessage from "models/functions/JoinMessage";
import LobbyChannel from "models/functions/LobbyChannel";
import OnlineChannel from "models/functions/OnlineChannel";
import ServerPlayercount from "models/functions/ServerPlayercount";
import SupportMessage from "models/functions/SupportMessage";
import AsyncError from "models/general/AsyncError";
import Fruit from "models/general/Fruit";
import SupportLog from "models/general/SupportLog";
import TsChannel from "models/teamspeak/TsChannel";
import TsServergroup from "models/teamspeak/TsServergroup";
import { TeamSpeakClient } from "ts3-nodejs-library";

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
    timestamp: new Date(),
    function: fnName,
    message: error.message,
    name: error.name,
    stack: error.stack,
  }).save();
};

export const addSupportLog = async (
  supportMessage: SupportMessageType,
  client: TeamSpeakClient,
  supportClientsContact: TeamSpeakClient[],
  supportClientsListed: TeamSpeakClient[]
) => {
  const supportClientsContactMapped = supportClientsContact.map(
    (client) => client.uniqueIdentifier
  );
  const supportClientsListedMapped = supportClientsListed.map(
    (client) => client.uniqueIdentifier
  );

  await new SupportLog({
    timestamp: new Date(),
    channel: supportMessage.channel.id,
    client: client.uniqueIdentifier,
    supportClientsContact: supportClientsContactMapped,
    supportClientsListed: supportClientsListedMapped,
  }).save();
};

export const getServerPlayercounts = async (): Promise<
  ServerPlayercountType[]
> => {
  return await ServerPlayercount.find().populate("channel").populate("server");
};
