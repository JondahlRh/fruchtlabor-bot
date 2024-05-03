import { TeamSpeak } from "ts3-nodejs-library";

import Fruit from "models/general/Fruit";

import tsChannelSetPermHelper from "modules/bot/utility/tsChannelSetPermHelper";

import { findLobbyChannels } from "services/mongodbServices/functions";
import { findFruits } from "services/mongodbServices/general";

const eventQueue: TeamSpeak[] = [];
let isProcessing = false;

const lobby = async () => {
  if (isProcessing) return;
  if (eventQueue.length === 0) return;

  isProcessing = true;

  const teamspeak = eventQueue.shift();
  if (!teamspeak) return;

  const fruitList = await findFruits();
  if (fruitList === null) return;

  const lobbyChannels = await findLobbyChannels();
  if (lobbyChannels === null) return;

  for (const lobbyChannel of lobbyChannels) {
    const channelList = await teamspeak.channelList();

    const channelChildren = channelList.filter(
      (channel) => +channel.pid === lobbyChannel.channelParent.id
    );
    const channelChildrenEmpty = channelChildren.filter(
      (channel) => channel.totalClients === 0
    );
    const channelSiblings = channelList.filter((channel) =>
      lobbyChannel.channelParentSiblings.some(
        (sibChannel) => sibChannel.id === +channel.pid
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
      const channel = channelChildrenEmpty[i + 1];
      if (!channel) break;

      await teamspeak.channelDelete(channel.cid);
    }

    const channelsToBeCreated = Math.max(
      0,
      lobbyChannel.minimum - channelChildren.length,
      1 - channelChildrenEmpty.length
    );

    const extraChanelnames = channelsToBeCreated - unusedFruitList.length;
    for (let i = 0; i < extraChanelnames; i++) {
      unusedFruitList.push(new Fruit({ name: String(Date.now() + i) }));
    }

    const channelSuffixes = unusedFruitList.slice(0, channelsToBeCreated);
    const channelProperties = {
      channelFlagPermanent: true,
      cpid: String(lobbyChannel.channelParent.id),
      channelDescription: lobbyChannel.description.text,
      channelOrder: channelChildren[0]?.order,
      channelFlagMaxclientsUnlimited: lobbyChannel.clientLimit === -1,
      channelMaxclients: lobbyChannel.clientLimit,
    };

    for (const channelSuffix of channelSuffixes) {
      const channelName = lobbyChannel.prefix
        ? lobbyChannel.prefix.concat(" - ", channelSuffix.name)
        : channelSuffix.name;

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

    const firstEmptyChannel = channelChildrenEmpty[0];
    const firstChannel = channelChildren[0];

    if (firstEmptyChannel && firstChannel && firstChannel.totalClients > 0) {
      await teamspeak.channelEdit(firstEmptyChannel.cid, {
        channelOrder: firstChannel.order,
      });
    }
  }

  isProcessing = false;
  lobby();
};

const channelLobby = async (teamspeak: TeamSpeak) => {
  eventQueue.push(teamspeak);
  lobby();
};

export default channelLobby;
