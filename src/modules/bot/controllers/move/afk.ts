import { TeamSpeak, TeamSpeakClient } from "ts3-nodejs-library";

import { AfkChannelConditionsType } from "models/functions/AfkChannel";

import { clientMatchesCollection } from "modules/bot/utility/tsCollectionHelper";

import {
  cachedFindAfkChannels,
  cachedFindOneDefaultAfkChannel,
} from "services/mongodbServices/functions/afkChannel";
import { cachedFindTsServergroups } from "services/mongodbServices/teamspeak/tsServergroup";

const checkMove = (
  client: TeamSpeakClient,
  conditions: AfkChannelConditionsType
) => {
  const { general, micMuted, sndMuted } = conditions;
  const { idleTime, inputMuted, outputMuted } = client;

  if (general !== -1 && idleTime > general) return general;
  if (micMuted !== -1 && inputMuted && idleTime > micMuted) return micMuted;
  if (sndMuted !== -1 && outputMuted && idleTime > sndMuted) return sndMuted;

  return -1;
};

export default async function afkMove(teamspeak: TeamSpeak) {
  const afkChannels = await cachedFindAfkChannels();

  const defaultAfkChannel = await cachedFindOneDefaultAfkChannel();
  if (!defaultAfkChannel) {
    throw new Error("Afk Channel default is not definded!");
  }

  const clientList = await teamspeak.clientList();
  const channelList = await teamspeak.channelList();
  const tsServergroups = await cachedFindTsServergroups();

  for (const listClient of clientList) {
    if (listClient.type === 1) continue;

    const channel = channelList.find((c) => c.cid === listClient.cid);

    const clientData = {
      channel: channel?.cid,
      channelParent: channel?.pid,
      servergroups: listClient.servergroups,
    };

    const ignore = afkChannels.some((afkChannel) =>
      afkChannel.ignore.some((x) => clientMatchesCollection(clientData, x))
    );
    if (ignore) continue;

    const apply = afkChannels.find((afkChannel) =>
      afkChannel.apply.some((x) => clientMatchesCollection(clientData, x))
    );
    const afkChannel = apply ?? defaultAfkChannel;

    const maxIdleTime = checkMove(listClient, afkChannel.conditions);
    const maxIdleTimeMinutes = Math.floor(maxIdleTime / 1000 / 60);
    if (maxIdleTime === -1) continue;

    const tsServergroup = tsServergroups.find((tsSg) => {
      return (
        tsSg.isTeammember && listClient.servergroups.some((x) => tsSg.id === +x)
      );
    });

    const moveChannel = tsServergroup?.isTeammember
      ? afkChannel.moveChannel.teammember
      : afkChannel.moveChannel.member;

    if (+listClient.cid === moveChannel.id) continue;

    await listClient.move(moveChannel.id.toString());
    await listClient.message(
      `Du warst über ${maxIdleTimeMinutes} Minuten abwesend und wurdest in den Afk Channel gemoved!`
    );
  }
}
