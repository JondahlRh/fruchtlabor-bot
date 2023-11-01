import { TeamSpeak } from "ts3-nodejs-library";

import LobbyChannel from "../../models/functions/LobbyChannel.js";
import Fruit from "../../models/general/Fruit.js";

import tsChannelSetPermHelper from "../../utility/tsChannelSetPermHelper.js";

/**
 * @type {TeamSpeak[]}
 */
const eventQueue = [];
let isProcessing = false;

const lobby = async () => {
  if (isProcessing) return;
  if (eventQueue.length === 0) return;

  isProcessing = true;
  const teamspeak = eventQueue.shift();

  const fruitList = await Fruit.find();

  const lobbyChannels = await LobbyChannel.find()
    .populate("channelParent")
    .populate("channelParentSiblings")
    .populate("description");

  for (const lobbyChannel of lobbyChannels) {
    const channelList = await teamspeak.channelList();

    const channelChildren = channelList.filter(
      (channel) => +channel.pid === lobbyChannel.channelParent.channelId
    );
    const channelChildrenEmpty = channelChildren.filter(
      (channel) => channel.totalClients === 0
    );
    const channelSiblings = channelList.filter((channel) =>
      lobbyChannel.channelParentSiblings.some(
        (sibChannel) => sibChannel.channelId === +channel.pid
      )
    );
    const channelCategorie = [...channelChildren, ...channelSiblings];
    const unusedFruitList = fruitList.filter(
      (fruit) =>
        !channelCategorie.some((channel) => channel.name.includes(fruit.name))
    );

    const channelsToBeDeleted = Math.max(
      0,
      Math.min(
        channelChildren.length - lobbyChannel.minimum,
        channelChildrenEmpty.length - 1
      )
    );

    for (let i = 0; i < channelsToBeDeleted; i++) {
      await teamspeak.channelDelete(channelChildrenEmpty[i + 1].cid);
    }

    const channelsToBeCreated = Math.max(
      0,
      lobbyChannel.minimum - channelChildren.length,
      1 - channelChildrenEmpty.length
    );

    const extraChanelnames = channelsToBeCreated - unusedFruitList.length;
    for (let i = 0; i < extraChanelnames; i++) {
      unusedFruitList.push({ name: Date.now() + i });
    }

    const channelSuffixes = unusedFruitList.slice(0, channelsToBeCreated);
    const channelProperties = {
      channelFlagPermanent: true,
      cpid: lobbyChannel.channelParent.channelId,
      channelDescription: lobbyChannel.description.text,
      channelOrder: channelChildren[0]?.order,
      channelFlagMaxclientsUnlimited: lobbyChannel.clientLimit === -1,
      channelMaxclients: lobbyChannel.clientLimit,
    };

    for (const channelSuffix of channelSuffixes) {
      const channelName = lobbyChannel.prefix.concat(" - ", channelSuffix.name);

      const tsLobbyChannel = await teamspeak.channelCreate(
        channelName,
        channelProperties
      );

      await tsChannelSetPermHelper(
        teamspeak,
        tsLobbyChannel,
        lobbyChannel.permissions
      );
    }

    if (
      channelChildren[0]?.totalClients > 0 &&
      channelChildrenEmpty.length > 0
    ) {
      await teamspeak.channelEdit(channelChildrenEmpty[0].cid, {
        channelOrder: channelChildren[0].order,
      });
    }
  }

  isProcessing = false;
  lobby();
};

/**
 * @param {TeamSpeak} teamspeak Current TeamSpeak Instance
 */
const channelLobby = async (teamspeak) => {
  eventQueue.push(teamspeak);
  lobby();
};

export default channelLobby;
